<template>
  <div class="vis-component" ref="chart">
    <svg class="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="choropleth-map" ref="choroplethMap"></g>
    </svg>
  </div>
</template>

<script>

//import mapStatesUSA from '@/assets/us-states-geo.json';

export default {
  name: 'ChoroplethMap',
  props: {
  },
  data() {
    return {
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 40, right: 40, bottom: 40, left: 40,
      },
    }
  },
  mounted() {
    /*
    this.createMap();
    */
  },
  methods: {
    // createMap() {

    // },
    
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
