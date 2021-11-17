<template>
  <div id="app" ref="APP">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <YearSlider/>
        </div>
      </div>
      <div id="color-selection" ref="colorSelection">
        <form action="/action_page.php">
          <label for="colorInput">Color scheme: </label>
          <span id="spacing">____</span>
          <select name="palette" id="colorInput">
            <option value="redBlue">RedBlue</option>
            <option value="greenBlue">GreenBlue</option>
            <option value="bluePurple">BluePurple</option>
          </select>
        </form>
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
  },
}
</script>

<style>
#appTitle {
  text-align: center;
  text-anchor: middle;
  font-family: Baskerville;
  font-size: 39px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  transform: translate(0px,10px);
}
#spacing {
  color: white;
}
#color-selection {
  text-align: start;
  transform: translate(40px, 30px);
  margin-bottom: 25px;
}
#chartsRow {
  transform: translate(0px, 0px);
}
#choroplethMap {
  transform: translate(0px, -20px);
}
</style>
