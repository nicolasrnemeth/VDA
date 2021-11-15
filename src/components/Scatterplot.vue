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
        <g class="axis axis-x" ref="axisX"></g>
        <g class="axis axis-y" ref="axisY"></g>
        <g class="points-group" ref="pointsGroup">
          <rect class="bg-rects" ref="bgRects"></rect> <!-- colored BG rectangles -->
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
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 20, right: 20, bottom: 20, left: 20,
      },
    }
  },
  mounted() {
  },
  methods: {
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
               .domain([this.dataMin_eduRate > 0 ? 0 : this.dataMin_eduRate, this.dataMax_eduRate])
               .range([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right]);
    },
    yScale() {
      return d3.scaleLinear()
               .domain([this.dataMin_income > 0 ? 0 : this.dataMin_income, this.dataMax_income])
               .range([this.svgHeight - this.svgPadding.top - this.svgPadding.bottom, 0]);
    }
  },
  watch: {
  },
}
</script>

<style>
</style>
