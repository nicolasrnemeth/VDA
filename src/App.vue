<template>
  <div id="app" ref="APP">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <YearSlider/>
        </div>
      </div>
      <div id="color-selection" ref="colorSelection">
        <label for="colorInput">Color scheme: </label>
        <span id="spacing">___</span>
        <select name="palette" id="colorInput">
            <option>RedBlue</option>
            <option>GreenBlue</option>
            <option>BluePurple</option>
        </select>
      </div>
      <div class="row" id="chartsRow">
        <div class="col-md-5">
          <Scatterplot/>
        </div>
        <div class="col-md-7">
          <ChoroplethMap/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

import ChoroplethMap from './components/ChoroplethMap.vue';
import Scatterplot from './components/Scatterplot.vue';
import YearSlider from './components/YearSlider.vue';

export default {
  name: 'App',
  components: {
    Scatterplot, ChoroplethMap, YearSlider
  },
  mounted() {
    this.$store.dispatch('loadData');
    this.listenColorInput();
  },
  methods: {
    listenColorInput() {
      d3.select('#colorInput').on('change', this.handleColorInput);
    },
    handleColorInput(event) {
      this.$store.commit('changeColorInput', event.target.value);
    }
  }
}
</script>

<style>
#appTitle {
  text-align: center;
  text-anchor: middle;
  font-weight: bold;
  font-family: Baskerville;
  font-size: 32px;
}
#app {
  font-family: Baskerville;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  transform: translate(0px,10px);
  padding-left: 35px;
  padding-right: 35px;
}
#spacing {
  color: white;
}
#color-selection {
  text-align: start;
  transform: translate(50px, 85%);
  margin-bottom: 25px;
  font-size: 18px;
}
#choropleth-map {
  transform: translate(0px,-10px);
}
#empty-area{
  stroke: black;
  stroke-width: 0.25;
  fill: rgba(250, 250, 250, 0.75);
}
.axis {
  font-size: 12px;
}
.year-slider {
  font-size: 22px;
}
.selected {
  fill: red !important;
  fill-opacity: 1 !important;
}
</style>
