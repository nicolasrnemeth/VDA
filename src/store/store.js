import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedYear: 2006,
    selectedStates: [],
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
      }
    ],
    stateColorIndexPairs: [],
    colorInput: "RedBlue",
  },
  mutations: {
    changeSelectedYear (state, year) {
      state.selectedYear = year;
    },
    changeSelectedState(state, val) {
      state.selectedStates.push(val);
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
    paletteColor: (state) => state.paletteColors.find(d => d.name == state.colorInput).colors,
    stateColorIndexPairs: (state) => state.stateColorIndexPairs,
    colorInput: (state) => state.colorInput,
    educationRates (state) {
      let result = [];
      for (let i = 0; i < state.educationRates.length; i++) {
        if (state.selectedYear in state.educationRates[i]) {
          result.push({
            state: state.educationRates[i].State,
            value: +state.educationRates[i][state.selectedYear]
          })
        }
      }
      return result;
    },
    personalIncome (state) {
      let result = [];
      for (let i = 0; i < state.personalIncome.length; i++) {
        if (state.selectedYear in state.personalIncome[i]) {
          result.push({
            state: state.personalIncome[i].State,
            value: +state.personalIncome[i][state.selectedYear]
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
