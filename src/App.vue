<script setup>
import * as d3 from 'd3'
import { ref, onMounted } from 'vue'
import HeaderComponent from './components/HeaderComponent.vue'
import SearchComponent from './components/searchComponent.vue'
import taiwanMap from './components/TaiwanMap.vue'
import pieChart from './components/PieChart.vue'
import barChart from './components/barChart.vue'
import voteBarChart from './components/voteBarChart.vue'
onMounted(() => {
  getData()
})
const year = ref(2020)
function getEmit (text) {
  year.value = text
  getData()
}
const allData = ref([])
const data = ref([])
const voteRate = ref([])
const heightTotal = ref([])
// 1.取得data
async function getData () {
  const csvData = await d3.csv(`./${year.value}totalData.csv`)
  const voteRateData = await d3.csv('./voteRate.csv')
  allData.value = csvData
  voteRate.value = voteRateData
  data.value.push(100 - parseInt(csvData[0]['投票率']))
  data.value.push(parseInt(csvData[0]['投票率']))

  allData.value.reduce((a, c, i, arr) => {
    if (parseInt((c.no1).split(',').join('')) > parseInt((c.no2).split(',').join('')) && parseInt((c.no1).split(',').join('')) > parseInt((c.no3).split(',').join(''))) {
      heightTotal.value.push({
        city: c['行政區別'].trim(),
        elected: 'no1',
        color: '#08C0BE'
      })
    } else if (parseInt((c.no2).split(',').join('')) > parseInt((c.no1).split(',').join('')) && parseInt((c.no2).split(',').join('')) > parseInt((c.no3).split(',').join(''))) {
      heightTotal.value.push({
        city: c['行政區別'].trim(),
        elected: 'no2',
        color: '#E756B8'
      })
    } else if ((parseInt((c.no3).split(',').join('')) > parseInt((c.no1).split(',').join('')) && parseInt((c.no3).split(',').join('')) > parseInt((c.no2).split(',').join('')))) {
      heightTotal.value.push({
        city: c['行政區別'].trim(),
        elected: 'no3',
        color: '#B4A073'
      })
    }
  })
}

</script>

<template>
  <div class="wrap">
    <HeaderComponent @get-year="getEmit"></HeaderComponent>
    <main>
      <div class="container">
        <SearchComponent></SearchComponent>
        <div class="stackBar">
          <div class="barBox">
            <span>朱筱雀/劉貝<br>7,111,222票</span>
          </div>
          <div class="barBox">
            <span>顏青龍/張妃<br>5,111,222票</span>
          </div>
          <div class="barBox">
            <span>卓白虎/官瑜<br>508,555票</span>
          </div>
        </div>
        <div class="chart">
          <div class="chartContent">
            <div class="icon">
              <p>WE LOVE TW</p>
              <img src="./img/icon2.png" alt="星球">
            </div>
            <pieChart :data="data" :all-data="allData"></pieChart>
            <barChart :all-data="allData"></barChart>
          </div>
          <taiwanMap :colorData="heightTotal"></taiwanMap>
        </div>
        <div class="hr"></div>
        <voteBarChart :all-data="voteRate"></voteBarChart>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.hr {
  width: 100%;
  height: 1px;
  background: #fff;
  margin-top: 64px;
  margin-bottom: 40px;
}

.stackBar {
  display: flex;
  height: 64px;
  width: 100%;
  margin-bottom: 74px;

  .barBox {
    padding: 8px;
    color: #fff;

    &:nth-of-type(1) {
      width: 40%;
      background: linear-gradient(86.8deg, #C857A3 2.93%, rgba(188, 143, 174, 0) 191.01%);
    }

    &:nth-of-type(2) {
      width: 35%;
      background: linear-gradient(86.18deg, #08C0BE 1.78%, rgba(200, 240, 240, 0) 122.05%);
    }

    &:nth-of-type(3) {
      width: 25%;
      background: linear-gradient(89.28deg, #AD8427 0.74%, rgba(252, 238, 207, 0) 162.36%);
    }
  }
}

.chart {
  width: 100%;
  display: flex;
}

.chartContent {
  width: 65%;
  // max-height: 342px;
  display: flex;
  flex-wrap: wrap;

  .icon {
    margin-right: 200px;

    p {
      font-size: 32px;
      font-family: 'Noto Sans TC', sans-serif;
      color: rgba(255, 255, 255, 0.2);
    }

    img {
      width: 230px;
      margin: 0;
    }
  }
}

@media(max-width: 768px) {
  .chartContent {
    .icon {
      display: none;
    }

    .pie {
      width: 100%;
      margin-bottom: 24px;
    }
  }
}

@media(max-width: 767px) {
  .chartContent {
    width: 100%;
  }

  .stackBar {
    flex-direction: column;
    height: auto;
    margin-bottom: 48px;

    .barBox {
      padding: 8px;
      color: #fff;

      &:nth-of-type(1),
      &:nth-of-type(2),
      &:nth-of-type(3) {
        width: 100%;
      }
    }
  }
}
</style>
