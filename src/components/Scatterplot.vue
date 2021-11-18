<template>
  <div class="vis-component" id="scatterPlot" ref="chart">
    <svg class="main-svg" :width="svgWidth" :height="svgHeight" ref="mainSvg">
      <g class="chart-group" ref="chartGroup">
        <g class="bivariate-palette" ref="bivariatePalette"></g>
        <g class="axis axis-x" ref="xAxis"></g>
        <g class="axis axis-y" ref="yAxis"></g>
        <g class="brush-area" ref="brushArea"></g>
        <g class="points-group" ref="pointsGroup"></g>
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
      brushExtent: null,
      svgWidth: 500,
      svgHeight: 500,
      mounted: false,
      svgPadding: {
        top: 40, right: 50, bottom: 60, left: 50,
      },
    }
  },
  mounted() {
    this.createChart();
    this.updateStateColorIndexPairs();
    this.createBrush();
    this.mounted = true;
  },
  methods: {
    createChart() {
      if (this.$refs.chart) {
        this.svgWidth = this.$refs.chart.clientWidth;
        this.svgHeight = this.svgWidth;
        this.$store.commit('changeScatterPlotHeight', this.svgHeight);
      }
      d3.select(this.$refs.chartGroup)
        .attr("transform", `translate(${this.svgPadding.left}, ${this.svgPadding.top})`);
      this.createXAxis();
      this.createYAxis();
      this.createPoints();
      this.createPalette();
    },
    createXAxis() {
      let XAxis = d3.select(this.$refs.xAxis)
      let translateXlabel = this.svgWidth - this.svgPadding.left - this.svgPadding.right;
      XAxis.attr('transform', `translate(0, ${this.svgHeight - this.svgPadding.top - this.svgPadding.bottom})`)
           .call(d3.axisBottom(this.xScale).tickFormat(d => d + " %"))
      if (!this.mounted) {
        XAxis.append('text')
             .text("Educational Attainment: Bachelor's Degree or Higher (%)")
             .attr('x', translateXlabel - 0.85*1e-02*translateXlabel)
             .attr('y', '-.75em')
             .style('fill', 'black')
             .style('text-anchor', 'end')
             .style('font-weight', 'bold');
      }
    },
    createYAxis() {
      let YAxis = d3.select(this.$refs.yAxis)
      YAxis.call(d3.axisLeft(this.yScale).tickFormat(d => (d3.format(".1f")(d/1e03) + " k")))
      if (!this.mounted) {
        YAxis.append('text')
             .text("Average Yearly Personal Income (in $)")
             .attr('transform', 'rotate(-90)')
             .attr('y', '1.5em')
             .attr('x', '-0.75%')
             .style('text-anchor', 'end')
             .style('fill', 'black')
             .style('font-weight', 'bold');
      }
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
                 .style('stroke-width', 1.2)
      
      d3.selectAll('title').remove();
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
                    .on("start brush", this.handleBrush);
      d3.select(this.$refs.brushArea).attr('class', 'brush').call(brush);
    },
    handleBrush(event) {
      let extent = event.selection;
      this.brushExtent = extent;
      this.updateBrush(extent);
    },
    updateBrush(extent) {
        d3.selectAll('.points')
          .classed('selected', d => this.isBrushed(extent, d.eduRate, d.income))
        
        let selectedElements = document.getElementsByClassName("selected");
        let selectedIds = [];
        for (let i=0; i < selectedElements.length; i++) {
          selectedIds.push(selectedElements[i].getAttribute("id").replace("_point", "_path"));
        }
        this.changeBrushedState(selectedIds);
    },
    changeBrushedState(selectedStateIds) {
      this.$store.commit("changeBrushedState", selectedStateIds);
    },
    isBrushed(brushCoors, x, y) {
      let xRange = this.xScale(x); 
      let yRange = this.yScale(y);
      let left = brushCoors[0][0], right = brushCoors[1][0],
          bottom = brushCoors[0][1], top = brushCoors[1][1];
      return (left <= xRange && xRange <= right && bottom <= yRange && yRange <= top); 
    },
    roundUpToMultipleOfX(value, x, factor=1.05) {
      return Math.ceil( (factor * value) / x) * x;
    },
    roundDownToMultipleOfX(value, x, factor=0.95) {
      return Math.floor( (factor * value) / x) * x;
    },
    colorIndex(x, y) {
      let xRange = this.xScale(x);
      let yRange = (this.svgHeight - this.svgPadding.top 
                    - this.svgPadding.bottom - this.yScale(y));
      return Math.floor(yRange / this.paletteRect.height) * 3 
             + Math.floor(xRange / this.paletteRect.width);
    },
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
    updateColor() {
      for (let idx in this.paletteColor) {
        d3.select("#rect_"+idx)
          .style("fill", this.paletteColor[idx]);
      }
    },
    highlightSelectedStates() {
      for (let id of this.selectedStates) {
        d3.select('#'+id+"_point")
          .style('stroke-width', 3)
          .style('fill-opacity', 1)
          .style('fill', "yellow");
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
        return this.$store.getters.paletteColor;
      }
    },
    educationRates: {
      get() {
        return this.$store.getters.educationRates;
      }
    },
    personalIncome: {
      get() {
        return this.$store.getters.personalIncome;
      }
    },
    allData: {
      get() {
        return this.personalIncome.map(obj => {
          return {
            state: obj.state, 
            income: +obj.value,
            eduRate: this.educationRates.find(d => d.state == obj.state).value,
          }
        });
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
      return d3.max(this.personalIncome, d => d.value)
    },
    dataMin_income() {
      return d3.min(this.personalIncome, d => d.value)
    },
    dataMax_eduRate() {
      return d3.max(this.educationRates, d => d.value)
    },
    dataMin_eduRate() {
      return d3.min(this.educationRates, d => d.value)
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
    },
    paletteColor: {
      handler() {
        this.updateColor();
      },
      deep: true,
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
    },
  },
}
</script>

<style>
</style>
