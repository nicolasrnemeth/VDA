<template>
  <div class="vis-component" ref="chart">
    <svg class="main-svg" :width="svgWidth" :height="svgHeight" ref="mainSvg">
      <rect id="empty-area" ref="emptyArea"></rect>
      <g id="choropleth-map" ref="choroplethMap"></g>
    </svg>
  </div>
</template>

<script>

import mapStatesUSA from '@/assets/us-states-geo.json';
import * as d3 from 'd3';

export default {
  name: 'ChoroplethMap',
  props: {
  },
  data() {
    return {
      svgWidth: 570,
      svgHeight: 570,
      svgPadding: {
        top: 40, right: 40, bottom: 40, left: 40,
      },
    }
  },
  mounted() {
    this.createMap();
    this.createEmptyArea();
  },
  methods: {
    createMap() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;
      let projection = d3.geoAlbersUsa()
                         .scale(this.svgWidth*1.25)
                         .translate([this.svgWidth/2*1.07,this.svgHeight/2]);
      let path_generator = d3.geoPath().projection(projection);
      let usaMap = d3.select(this.$refs.choroplethMap)
      
      usaMap.selectAll('path')
            .data(mapStatesUSA.features)
            .join('path')
            .attr('class', 'paths')
            .attr('d', path_generator)
            .attr('id', d => d.properties.name.replaceAll(" ", "")+"_path")
            .on("click", (_, d) => this.handleStateClick(d.properties.name))
            .style('fill', 'white')
            .style('stroke', 'black')
            .style('cursor', 'pointer')
            .append('title')
            .text(d => d.properties.name);
      
      this.updateColor();
    },
    handleStateClick(stateId) {
      this.$store.commit("changeSelectedState", stateId.replaceAll(" ", ""));
    },
    updateColor() {
      for (let state of this.stateColorIndexPairs) {
        d3.select("#"+state.id)
          .style("fill", this.paletteColor[state.colorIndex]);
      }
    },
    createEmptyArea() {
      let emptyArea = d3.select(this.$refs.emptyArea)
      emptyArea.attr("height", this.svgHeight-79)
               .attr("width", this.svgWidth)
               .on("click", this.handleEmptyAreaClick)
               .style('cursor', "pointer")
               .append('title')
               .text("undo highlighting");
    },
    handleEmptyAreaClick() {
      this.$store.commit("clearSelectedState");
    },
  },
  computed: {
    colorInput: {
      get() {
        return this.$store.colorInput;
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
    selectedStates: {
      get() {
        return this.$store.getters.selectedStates;
      }
    },
    stateColorIndexPairs: {
      get() {
        return this.$store.getters.stateColorIndexPairs;
      }
    },
    paletteColor: {
      get() {
        return this.$store.getters.paletteColor;
      }
    }
  },
  watch: {
    stateColorIndexPairs: {
      handler() {
        this.updateColor();
      },
    },
    paletteColor: {
      handler() {
        this.updateColor();
      },
      deep: true,
    },
  },
}
</script>

<style>
</style>
