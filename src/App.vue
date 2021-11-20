<template>
  <div id="app" ref="APP">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <YearSlider/>
        </div>
      </div>
      <div id="color-selection" ref="colorSelection">
        <!-- Dropdown selection of bivariate color scheme -->
        <label for="colorInput">Color scheme: </label>
        <span class="spacing_">___</span>
        <select name="palette" id="colorInput">
            <option>RedBlue</option>
            <option>RedBlueIntensive</option>
            <option>GreenBlue</option>
            <option>BluePurple</option>
            <option>PurpleYellow</option>
        </select>
        <!-- Checkbox selection of whether to saturate color or not -->
        <label class="switch">
          Increase color saturation:
          <span class="spacing_">_</span>
          <input type="checkbox" id="saturateInput">
        </label>
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
    this.listenSaturateInput();
  },
  methods: {
    // Listen to selection of bivariate color scheme
    listenColorInput() {
      d3.select('#colorInput').on('change', this.handleColorInput);
    },
    handleColorInput(event) {
      this.$store.commit('changeColorInput', event.target.value);
    },
    // Listen whether to increase color saturation or not
    listenSaturateInput() {
      d3.select('#saturateInput').on('change', this.handleSaturateInput);
    },
    handleSaturateInput(event) {
      this.$store.commit('changeSaturateColor', event.target.checked);
    },
  },
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
.spacing_ {
  color: white;
}
#color-selection {
  text-align: start;
  transform: translate(70px, 90%);
  margin-bottom: 25px;
  font-size: 18px;
}
#choropleth-map {
  transform: translate(0px,-10px);
}
#empty-area{
  fill: rgb(250, 250, 250);
}
.axis {
  font-size: 12px;
}
.year-slider {
  font-size: 22px;
}
.selected.points {
  fill: white !important;
  stroke-width: 1.75 !important;
  fill-opacity: 1 !important;
}
.switch {
  transform: translate(36vw, 0px);
}
</style>
