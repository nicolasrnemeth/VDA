<template>
  <div class="vis-component" ref="chart">
    <!--
    <div class="placeholder">
      <b>Here comes the scatterplot</b>.
      <p>Education Attainment Rate for the Selected Year: {{ educationRates }}</p>
    </div>
    -->
    <svg class="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="chart-group" ref="chartGroup">
        <g class="axis axis-x" ref="xAxis"></g>
        <g class="axis axis-y" ref="yAxis"></g>
        <g class="points-group" ref="pointsGroup">
          <g class="bg-rect" ref="bgRect"></g> <!-- colored BG rectangles -->
        </g> 
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
      svgWidth: 0,
      svgHeight: 500,
      svgPadding: {
        top: 25, right: 20, bottom: 70, left: 40,
      },
      mounted: false,
      rectColors: [
        "#e8e8e8", "#e4acac", "#c85a5a",
        "#b0d5df", "#ad9ea5", "#985356",
        "#64acbe", "#627f8c", "#574249"
      ]
    }
  },
  mounted() {
    this.createChart();
    this.mounted = true;
  },
  methods: {
    createChart() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;
      d3.select(this.$refs.chartGroup)
        .attr("transform", `translate(${this.svgPadding.left}, ${this.svgPadding.top})`);
      this.createXAxis();
      this.createYAxis();
      this.createPoints();
    },
    createXAxis() {
      let XAxis = d3.select(this.$refs.xAxis)
      XAxis.attr('transform', `translate(0, ${this.svgHeight - this.svgPadding.top - this.svgPadding.bottom})`)
           .call(d3.axisBottom(this.xScale).tickFormat(d => d + " %"))
      if (!this.mounted) {
        XAxis.append('text')
             .attr('x', this.svgWidth - this.svgPadding.left - this.svgPadding.right)
             .attr('dy', '-.75em')
             .style('fill', 'black')
             .style('text-anchor', 'end')
             .text("Educational Attainment: Bachelor's Degree or Higher (%)");
      }
    },
    createYAxis() {
      let YAxis = d3.select(this.$refs.yAxis)
      YAxis.call(d3.axisLeft(this.yScale).tickFormat(d => (d3.format(".1f")(d/1e03) + " k")))
      if (!this.mounted) {
        YAxis.append('text')
             .text("Average Yearly Personal Income (in $)")
             .attr('transform', 'rotate(-90)')
             .attr('dy', '1.5em')
             .style('text-anchor', 'end')
             .style('fill', 'black');
      }
    },
    createPoints() {
      const pointsGroup = d3.select(this.$refs.pointsGroup)
      pointsGroup.selectAll('.points')
                 .data(this.allData)
                 .join('circle')
                 .attr('class', 'points')
                 .attr('cx', d => this.xScale(d.eduRate))
                 .attr('cy', d => this.yScale(d.income))
                 .attr('r', 5)
                 .style('fill-opacity', 0)
                 .style('stroke', 'black')
                 .style('stroke-width', 1.2);
    },
    bgRects() {
      const bgRects = d3.select(this.$refs.bgRect)
      bgRects.selectAll('.colRects')
            .data(this.rectColors)
            .join('rect')
            .attr('class', 'colRects')
    }
  },
  computed: {
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
        let result = [];
        for (let i = 0; i < this.personalIncome.length; i++) {
          let stateName = this.personalIncome[i].state;
          result.push({
            state: stateName,
            income: this.personalIncome[i].value,
            eduRate: this.educationRates.filter(d => d.state == stateName)[0].value,
          })
        }
      return result;
      },
    },
    // To avoid having to watch two properties individually
    dataChart: {
      get() {
        return `${this.personalIncome},${this.educationRates}`;
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
               .domain([0.9*this.dataMin_eduRate, 1.05*this.dataMax_eduRate])
               .range([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right]);
    },
    yScale() {
      return d3.scaleLinear()
               .domain([0.9*this.dataMin_income, 1.05*this.dataMax_income])
               .range([this.svgHeight - this.svgPadding.top - this.svgPadding.bottom, 0]);
    }
  },
  watch: {
    dataChart: {
      handler() {
        this.createChart();
      },
      deep: true,
    },
  },
}
</script>

<style>
</style>
