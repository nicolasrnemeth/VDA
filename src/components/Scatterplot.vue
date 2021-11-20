<template>
  <div class="vis-component" id="scatterPlot" ref="chart">
    <svg class="main-svg" :width="svgWidth" :height="svgHeight" ref="mainSvg">
      <g class="chart-group" ref="chartGroup">
        <g class="bivariate-palette" ref="bivariatePalette"></g>
        <g class="axis axis-x" ref="xAxis"></g>
        <g class="axis axis-y" ref="yAxis"></g>
        <g class="brush-area" ref="brushArea"></g>
        <g class="points-group" ref="pointsGroup"></g>
        <rect id="toolTip"></rect>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'Scatterplot',
  props: {
  },
  data() {
    return {
      // Track whether the area of the brush is larger than 0
      // to only start graying out states on the map when one has already
      // started brushing
      brushExtent: null,
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 40, right: 30, bottom: 60, left: 70,
      },
    }
  },
  mounted() {
    if (this.$refs.chart) {
        this.svgWidth = this.$refs.chart.clientWidth;
        this.svgHeight = this.svgWidth;
        this.$store.commit('changeScatterPlotHeight', this.svgHeight);
    }
    this.createChart();
    this.createBrush();
    // Create axes labels only once to avoid overlaying multiple texts
    // when year selections are changed
    this.creatAxesLabels();
    this.updateStateColorIndexPairs();
  },
  methods: {
    // Draw scatterplot including axes points and bivariate color scheme
    createChart() {
      d3.select(this.$refs.chartGroup)
        .attr("transform", `translate(${this.svgPadding.left}, ${this.svgPadding.top})`);
      this.createXAxis();
      this.createYAxis();
      this.createPoints();
      this.createPalette();
    },
    createXAxis() {
      let XAxis = d3.select(this.$refs.xAxis)
      XAxis.attr('transform', `translate(0, ${this.svgHeight - this.svgPadding.top - this.svgPadding.bottom})`)
           .call(d3.axisBottom(this.xScale).tickFormat(d => d));
    },
    createYAxis() {
      let YAxis = d3.select(this.$refs.yAxis)
      YAxis.call(d3.axisLeft(this.yScale).tickFormat(d => (d3.format(".1f")(d/1e03) + " k")))
    },
    creatAxesLabels() {
      let translateLabel = this.svgWidth - this.svgPadding.left - this.svgPadding.right;
      d3.select(this.$refs.yAxis)
        .append('text')
        .text("Average Yearly Personal Income (in $)")
        .attr('transform', 'rotate(-90)')
        .attr('y', '-5em')
        .attr('x', -0.5*translateLabel)
        .style('text-anchor', 'middle')
        .style('fill', 'black')
        .style('font-weight', 'bold');
    
      d3.select(this.$refs.xAxis)
        .append('text')
        .text("Educational Attainment: Bachelor's Degree or Higher (in %)")
        .attr('x', 0.5*translateLabel)
        .attr('y', '3.5em')
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold');
    },
    createPoints() {
      const pointsGroup = d3.select(this.$refs.pointsGroup)
      pointsGroup.selectAll('.points')
                 .data(this.allData)
                 .join('circle')
                 .attr('class', 'points')
                 .attr('id', d => d.state.replaceAll(" ", "")+"_point")
                 .attr('cx', d => this.xScale(d.eduRate))
                 .attr('cy', d => this.yScale(d.income))
                 .attr('r', 5)
                 .style('fill-opacity', 0)
                 .style('stroke', 'black')
                 .style('stroke-width', 1.2);
      
      d3.selectAll('title:not(.tooltip-map)').remove();
      d3.selectAll('.points')
        .append('title')
        .text(d => {
              return (
                `${d.state}\n\nEducation: ${d.eduRate} %\nIncome: ${d.income} $`
              );
        });
    },
    createPalette() {
      const palette = d3.select(this.$refs.bivariatePalette)
      palette.selectAll('.palette-rect')
             .data(this.paletteColor)
             .join('rect')
             .attr('class', 'palette-rect')
             .attr('id', (d,i) => "rect_"+i)
             .attr('width', this.paletteRect.width)
             .attr('height', this.paletteRect.height)
             // based on the specific ordering of colors in the arrays
             // compute the positions of the rectangles
             .attr('x',  (d,i) => (i%3)*this.paletteRect.width)
             .attr('y', (d,i) => {
               if(i < 3) return 2*this.paletteRect.height;
               if (i < 6) return this.paletteRect.height;
               return 0
             })
             .style('fill', d => d)
             .style('stroke', 'black')
             .style('stroke-width', 0.2)
    },
    createBrush() {
      let brush = d3.brush()
                    .extent([[0, 0], 
                             [this.svgWidth - this.svgPadding.left - this.svgPadding.right,
                              this.svgHeight - this.svgPadding.top - this.svgPadding.bottom]])
                    .on("start brush end", this.handleBrush);
      d3.select(this.$refs.brushArea).attr('class', 'brush').call(brush);
    },
    handleBrush(event) {
      let extent = event.selection;
      this.brushExtent = extent;
      if (extent != undefined) this.updateBrush(extent);
      if (extent && ((extent[0][0] - extent[1][0]) != 0 && (extent[1][0] - extent[1][1]))) {
        this.$store.commit('changeScatterPlotIsBrushed', true);
      }
      else {
        this.$store.commit('changeScatterPlotIsBrushed', false);
      }
    },
    updateBrush(extent) {
        // Add a selected class to all points inside the brush
        d3.selectAll('.points')
          .classed('selected', d => this.isBrushed(extent, d.eduRate, d.income))
        // Retrieve ids of all points inside the brush
        let selectedElements = document.getElementsByClassName("selected");
        let selectedIds = [];
        for (let i=0; i < selectedElements.length; i++) {
          selectedIds.push(selectedElements[i].getAttribute("id").replace("_point", "_path"));
        }
        // Pass ids of points inside brush forward to store
        // to communicate them to the choroplethMap component
        this.changeBrushedState(selectedIds);
    },
    changeBrushedState(selectedStateIds) {
      this.$store.commit("changeBrushedState", selectedStateIds);
    },
    // Check whether points are inside brush
    isBrushed(brushCoors, x, y) {
      let xRange = this.xScale(x); 
      let yRange = this.yScale(y);
      let left = brushCoors[0][0], right = brushCoors[1][0],
          bottom = brushCoors[0][1], top = brushCoors[1][1];
      return (left <= xRange && xRange <= right && bottom <= yRange && yRange <= top); 
    },
    // Round the values of the axes at both ends to multiples of in my case 5
    roundUpToMultipleOfX(value, x, factor=1.05) {
      return Math.ceil( (factor * value) / x) * x;
    },
    // see above --> done to have more consistent axes when years are changed
    roundDownToMultipleOfX(value, x, factor=0.95) {
      return Math.floor( (factor * value) / x) * x;
    },
    // Return the index of the color in the bivariate color scheme array
    // based inside which of the 9 rectangles each data point falls in
    colorIndex(x, y) {
      let xRange = this.xScale(x);
      let yRange = (this.svgHeight - this.svgPadding.top 
                    - this.svgPadding.bottom - this.yScale(y));
      return Math.floor(yRange / this.paletteRect.height) * 3 
             + Math.floor(xRange / this.paletteRect.width);
    },
    // update the colors of the states in the map
    updateStateColorIndexPairs() {
      this.$store.commit('clearStateColorIndexPairs');

      for (let datum of this.allData) {
        this.setStateColorIndexPairs({
          id: datum.state.replaceAll(" ", "")+"_path",
          colorIndex: this.colorIndex(datum.eduRate, datum.income),
        })
      }
    },
    setStateColorIndexPairs(obj) {
        this.$store.commit('changeStateColorIndexPairs', obj);
    },
    // Update colors of 3x3 bivariate color scheme
    updateColor() {
      for (let idx in this.paletteColor) {
        d3.select("#rect_"+idx)
          .style("fill", this.paletteColor[idx]);
      }
    },
    // the function increaseColorSaturation was inspired by: https://observablehq.com/@d3/working-with-color
    increaseColorSaturation(color, k=1.25) {
      const {l, c, h} = d3.lch(color);
      return d3.lch(l, c + 18 * k, h).formatHex();
    },
    // highlight points in scatterplot when clicking on respective states in map
    highlightSelectedStates() {
      for (let id of this.selectedStates) {
        d3.select('#'+id+"_point")
          .style('fill-opacity', 1)
          .style('fill', "black");
      }
    },
    removeHightlighting() {
      d3.selectAll('.points')
        .style("stroke-width", 1.2)
        .style('fill-opacity', 0);
    },
  },
  computed: {
    paletteColor: {
      get() {
        if (this.$store.getters.saturateColor) {
          return this.$store.getters.paletteColor.map(d => this.increaseColorSaturation(d));
        }
        return this.$store.getters.paletteColor;
      }
    },
    allData: {
      get() {
        return this.$store.getters.allData;
      },
    },
    paletteRect: {
      get() {
        return {
          width: ((this.svgWidth - this.svgPadding.left - this.svgPadding.right) / 3), 
          height: ((this.svgHeight - this.svgPadding.top - this.svgPadding.bottom) / 3),
        }
      }
    },
    selectedStates: {
      get() {
        return this.$store.getters.selectedStates;
      }
    },
    dataMax_income() {
      return d3.max(this.allData, d => d.income);
    },
    dataMin_income() {
      return d3.min(this.allData, d => d.income);
    },
    dataMax_eduRate() {
      return d3.max(this.allData, d => d.eduRate);
    },
    dataMin_eduRate() {
      return d3.min(this.allData, d => d.eduRate);
    },
    xScale() {
      return d3.scaleLinear()
               .domain([this.roundDownToMultipleOfX(this.dataMin_eduRate, 5), 
                        this.roundUpToMultipleOfX(this.dataMax_eduRate, 5)])
               .range([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right]);
    },
    yScale() {
      return d3.scaleLinear()
               .domain([this.roundDownToMultipleOfX(this.dataMin_income, 5*1e03), 
                        this.roundUpToMultipleOfX(this.dataMax_income, 5*1e03)])
               .range([this.svgHeight - this.svgPadding.top - this.svgPadding.bottom, 0]);
    }
  },
  watch: {
    allData: {
      handler() {
        this.createChart();
        this.updateStateColorIndexPairs();
        if (this.brushExtent) this.updateBrush(this.brushExtent);
        if (this.selectedStates.length > 0) {
          this.highlightSelectedStates();
        }
      },
      deep: true,
      immediate: true,
    },
    paletteColor: {
      handler() {
        this.updateColor();
      },
      deep: true,
      immediate: true,
    },
    selectedStates: {
      handler() {
        if (this.selectedStates.length > 0) {
          this.highlightSelectedStates();
        } else {
          this.removeHightlighting();
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style>
</style>
