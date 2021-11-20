import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedYear: 2006,
    scatterPlotHeight: 570,
    scatterPlotIsBrushed: false,
    selectedStates: [],
    brushedStates: [],
    educationRates: [],
    personalIncome: [],
    paletteColors: [
      {
        name: "RedBlue",
        colors: [
          "#e8e8e8", "#e4acac", "#c85a5a",
          "#b0d5df", "#ad9ea5", "#985356",
          "#64acbe", "#627f8c", "#574249"
        ]
      },
      {
        name: "GreenBlue",
        colors: [
          "#e8e8e8", "#b5c0da", "#6c83b5",
          "#b8d6be", "#90b2b3", "#567994",
          "#73ae80", "#5a9178", "#2a5a5b"
        ]
      },
      {
        name: "BluePurple",
        colors: [
          "#e8e8e8", "#ace4e4", "#5ac8c8",
          "#dfb0d6", "#a5add3", "#5698b9", 
          "#be64ac", "#8c62aa", "#3b4994"
        ]
      },
      {
        name: "PurpleYellow",
        colors: [
          "#e8e8e8", "#e4d9ac", "#c8b35a",
          "#cbb8d7", "#c8ada0", "#af8e53",
          "#9972af", "#976b82", "#804d36"
        ]
      },
      {
        name: "RedBlueIntensive",
        colors: [
          "#e8e8e8", "#7bb3d1", "#016eae",
          "#dd7c8a", "#8d6c8f", "#4a4779",
          "#cc0024", "#8a274a", "#4b264d"
        ]
      }
    ],
    stateColorIndexPairs: [],
    colorInput: "RedBlue",
    saturateColor: false,
  },
  mutations: {
    changeScatterPlotIsBrushed(state, val) {
      state.scatterPlotIsBrushed = val;
    }, 
    changeScatterPlotHeight(state, height) {
      state.scatterPlotHeight = height;
    },
    changeSelectedYear(state, year) {
      state.selectedYear = year;
    },
    changeSelectedState(state, val) {
      if (!(state.selectedStates.includes(val))) {
        state.selectedStates.push(val);
      }
    },
    changeSaturateColor (state, val) {
      state.saturateColor = val;
    },
    changeBrushedState(state, val) {
      state.brushedStates = val;
    },
    clearSelectedState(state) {
      state.selectedStates = [];
    },
    changeStateColorIndexPairs(state, obj) {
      state.stateColorIndexPairs.push(obj);
    },
    clearStateColorIndexPairs(state) {
      state.stateColorIndexPairs = [];
    },
    changeColorInput(state, val) {
      state.colorInput = val;
    }
  },
  getters: {
    selectedYear: (state) => state.selectedYear,
    selectedStates: (state) => state.selectedStates,
    // all states that are brushed
    brushedStates: (state) => state.brushedStates,
    // scatterplot height is tracked in vuex store communicate
    // it to the choroplethMap component, because the scatterplot height
    // is chosen in accordance with the clientWidth of the div element
    // the scatterplot svg element is inside of
    scatterPlotHeight: (state) => state.scatterPlotHeight,
    // boolean value to track checkbox whether to saturate color or not
    saturateColor: (state) => state.saturateColor,
    scatterPlotIsBrushed: (state) => state.scatterPlotIsBrushed,
    // return the right bivariate color scheme depending on the selection
    // in the dropdown menu
    paletteColor: (state) => state.paletteColors.find(d => d.name == state.colorInput).colors,
    // assign the index of the color in the array that gets assigned to each state
    stateColorIndexPairs: (state) => state.stateColorIndexPairs,
    // track the color scheme selected in the dropdown selection
    colorInput: (state) => state.colorInput,
    allData (state) {
      let result = [];
      for (let i = 0; i < state.personalIncome.length && i < state.educationRates.length; i++) {
        if (state.selectedYear in state.personalIncome[i]
            && state.selectedYear in state.educationRates[i]) {
          let State = state.educationRates[i].State;
          result.push({
            state: State,
            eduRate: +state.educationRates[i][state.selectedYear],
            income: +state.personalIncome.find(d => d.State == State)[state.selectedYear],
          })
        }
      }
      return result;
    },
  },
  actions: {
    loadData({state}) {
      d3.csv('./usa_ba-degree-or-higher_2006-2019.csv').then((data) => { 
        state.educationRates = data;
      })

      d3.csv('./usa_personal-income-by-state_2006-2019.csv').then((data) => { 
        state.personalIncome = data;
      })
    },
  }
})

export default store;
