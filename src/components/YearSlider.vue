<template>
  <div>
    <label for="range-year" class="year-slider">Year Selection</label>
    <b-form-input id="range-year" v-model="selectedYear" type="range" min="2006" max="2019"></b-form-input>
    <div class="mt-2 year-slider">Selected Year: {{ selectedYear }}</div>
  </div>
</template>

<script>
export default {
  name: 'YearSlider',
  props: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    selectedYear: {
      get() {
        return this.$store.getters.selectedYear;
      },
      set(val) {
        this.$store.commit('changeSelectedYear', val);
      },
    },
  },
  watch: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
