<template>
  <div class="vis-component" ref="chart">
    <svg class="main-svg" :width="svgWidth" :height="svgHeight" ref="mainSvg">
      <g class="choropleth-map" ref="choroplethMap"></g>
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
    this.createMap()
    d3.select(this.$refs.mainSvg)
      .attr("transform", "translate(0,"+this.svgPadding.top+")");
  },
  methods: {
    createMap() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;
      let projection = d3.geoAlbersUsa()
                         .scale(this.svgWidth*1.27)
                         .translate([this.svgWidth/2*1.07,this.svgHeight/2]);
      let path_generator = d3.geoPath().projection(projection);
      let usaMap = d3.select(this.$refs.choroplethMap)
      
      usaMap.selectAll('path')
            .data(mapStatesUSA.features)
            .join('path')
            .attr('class', 'paths')
            .attr('d', path_generator)
            .attr('id', d => d.properties.name.replaceAll(" ", "")+"_path")
            .style('fill', 'white')
            .style('stroke', 'black');
    },
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
    selectedStates: {
      get() {
        return this.$store.getters.selectedStates;
      }
    },
  },
  watch: {
  },
}
</script>

<style>
</style>
