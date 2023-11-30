<script setup>
import * as d3 from 'd3'
import { ref, onMounted } from 'vue'
import HeaderComponent from './components/HeaderComponent.vue'
import SearchComponent from './components/searchComponent.vue'
import taiwanMap from './components/TaiwanMap.vue'
onMounted(() => {
  getData()
  window.onresize = () => {
    drawPieChart()
    drawBarChart()
    drawVoteBarChart()
  }
})
const year = ref(2020)
const textContent = ref({})
function getEmit (text) {
  year.value = text
  getData()
}
const allData = ref([])
const data = ref([])
const voteRate = ref([])
const heightTotal = ref([])
// 圓餅圖
// 1.取得data
async function getData () {
  data.value = []
  const csvData = await d3.csv(`./${year.value}totalData.csv`)
  const voteRateData = await d3.csv('./voteRate.csv')
  allData.value = csvData
  voteRate.value = voteRateData
  data.value.push(100 - parseInt(csvData[0]['投票率']))
  data.value.push(parseInt(csvData[0]['投票率']))
  textContent.value = {
    voteRate: csvData[0]['投票率'],
    voteTotal: csvData[0]['投票數'],
    valid: csvData[0]['有效票數'],
    invalid: csvData[0]['無效票數']
  }
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
  drawPieChart()
  drawBarChart()
  drawVoteBarChart()
}
// 2.畫圓餅圖
function drawPieChart () {
  d3.select('.pieChart svg').remove()
  const svgWidth = parseInt(d3.select('.pieChart').style('width')) / 2
  const svgHeight = svgWidth * 0.8
  // const margin = 60
  const svg = d3.select('.pieChart').append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
  svg.append('g')
    .attr('class', 'slices')
    .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`)
  // 設定顏色
  const color = d3.scaleOrdinal()
    .range(['#635692', '#4e4376'])
  const radius = Math.min(svgWidth, svgHeight) / 2

  // 設定每個資料在圓餅圖上:
  const piechart = d3.pie()
    .value(d => d)

  // innerRadius 跟 outerRadius 決定圓餅內圈外圈的大小 radius
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
  const outerArc = d3.arc()
    .outerRadius(radius * 0.9)
    .innerRadius(radius * 0.9)
  const data_ready = piechart(data.value)
  // 建立pie
  const cutePie = svg.select('.slices')
    .selectAll('g')
    .data(data_ready)
    .enter()
    .append('g')
    .attr('class', 'arc')

  cutePie.append('path')
    .attr('d', arc)
    .attr('fill', color)
    .style('opacity', 1)
    .transition()
    .duration(2000)
    .attrTween('d', b => {
      b.innerRadius = 0
      const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, b)
      return function (t) { return arc(i(t)) }
    })
  // .transition()
}

// 3.複數長條圖
function drawBarChart () {
  d3.select('.bar svg').remove()
  d3.select('.bar .tooltips').remove()
  d3.select('.bar').style('position', 'relative')
  // 設定rwd寬高
  const svgW = parseInt(d3.select('.bar').style('width'))
  const svgH = parseInt(d3.select('.bar').style('height'))
  const margin = 35
  const marginB = 40
  const svg = d3.select('.bar').append('svg')
    .attr('width', svgW)
    .attr('height', svgH)

  // 製作XY軸
  // 1.去除總計項目
  const dataFilter = allData.value.filter((i) => {
    if (i['行政區別'] !== '總　計') {
      return i
    }
  })
  const xData = dataFilter.map(i => (i['行政區別']).trim())
  const xScale = d3.scaleBand()
    .domain(xData)
    .range([(margin * 2), (svgW - margin)])
    .padding(0.05)
  const xAxis = d3.axisBottom(xScale)
  const xAxisGroup = svg.append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${svgH - marginB})`)
    .attr('color', '#fff')
  const yData = []
  dataFilter.forEach(item => {
    yData.push(parseInt(item.no1.split(',').join('')))
    yData.push(parseInt(item.no2.split(',').join('')))
    yData.push(parseInt(item.no3.split(',').join('')))
  })
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(yData)])
    .range([svgH - marginB, margin])
    .nice()
  const yAxis = d3.axisLeft(yScale).ticks(7)
  const yAxisGroup = svg.append('g').call(yAxis)
    .attr('transform', `translate(${margin * 2}, 0)`)
    .attr('color', '#fff')
  const subgroups = Object.keys(allData.value[0]).slice(1)
  const subgroupsFilter = subgroups.filter(i => {
    if (i === 'no1' || i === 'no2' || i === 'no3') {
      return i
    }
  })
  const xSubgroups = d3.scaleBand()
    .domain(subgroupsFilter)
    .range([0, xScale.bandwidth()])
    .padding([0.1])
  const color = d3.scaleOrdinal()
    .domain(subgroupsFilter)
    .range(['#08C0BE', '#E756B8', '#B4A073'])
  const bar = svg.append('g')
    .selectAll('g')
    .data(dataFilter)
    .join('g')
    .attr('transform', d => `translate(${xScale(d['行政區別'].trim())}, 0)`)

  bar.selectAll('rect')
    .data(d => {
      return subgroupsFilter.map(i => {
        return { key: i, value: d[i] }
      })
    })
    .join('rect')
    .attr('x', d => xSubgroups(d.key))
    .attr('y', yScale(0))
    .attr('width', xSubgroups.bandwidth())
    .transition()
    .duration(1000)
    .delay((d, i) => i * 100)
    .attr('y', d => yScale(d.value.split(',').join('')))
    .attr('height', d => {
      return (svgH - marginB) - yScale(parseInt(d.value.split(',').join('')))
    })
    .attr('fill', d => color(d.key))
    .style('cursor', 'pointer')

  const text = d3.selectAll('text')
    .style('font-size', '14px')
  // 新增tooltips
  const tooltips = d3.select('.bar').append('div')
    .attr('class', 'tooltips')
    .style('position', 'absolute')
    .style('visibility', 'hidden') // 一開始tooltips是隱藏的
    .style('background-color', 'rgba(78, 67, 118, 1)')
    .style('color', '#fff')
    .style('padding', '12px 16px')
    .style('z-index', '10')
  bar.on('mouseover', handleMouseOver)
    .on('mouseleave', handleMouseLeave)

  function handleMouseOver (d, i) {
    d3.select(this).style('opacity', '0.7')
    tooltips.style('visibility', 'visible')
      .style('bottom', 100 + 'px')
      .style('left', xScale(i['行政區別'].trim()) - 40 + 'px')
      .html(`<p>${i['行政區別'].trim()}得票數</p>
             <p>新世代改革黨　${i.no1}票</p>
             <p>未來前進黨　　${i.no2}票</p>
             <p>星際和平黨　　${i.no3}票</p>
            `)
    d3.selectAll('.tooltips p')
      .style('font-size', '14px')
      .style('margin', '4px')
  }

  function handleMouseLeave () {
    // 移除文字
    d3.select(this).style('opacity', '1')
    d3.select('.tooltips').style('visibility', 'hidden')
  }
}

// 4.投票率長條圖
function drawVoteBarChart () {
  d3.select('.voteBar svg').remove()
  d3.select('.voteBar .tooltip2').remove()
  d3.select('.voteBar').style('position', 'relative')
  // 設定rwd寬高
  const svgW = parseInt(d3.select('.voteBar').style('width'))
  const svgH = parseInt(d3.select('.voteBar').style('height'))
  const margin = 35
  const marginB = 40
  const svg = d3.select('.voteBar').append('svg')
    .attr('width', svgW)
    .attr('height', svgH)

  // 製作XY軸
  const xData = voteRate.value.map(i => i.city)
  const xScale = d3.scaleBand()
    .domain(xData)
    .range([(margin * 2), (svgW - margin)])
    .padding(0.1)
  const xAxis = d3.axisBottom(xScale)
  const xAxisGroup = svg.append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${svgH - marginB})`)
    .attr('color', '#fff')

  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([svgH - marginB, margin])
    .nice()
  const yAxis = d3.axisLeft(yScale).ticks(5)
    .tickFormat(function (d) { return d + '%' })
  const yAxisGroup = svg.append('g').call(yAxis)
    .attr('transform', `translate(${margin * 2}, 0)`)
    .attr('color', '#fff')
  const subgroups = Object.keys(voteRate.value[0]).slice(1)
  const xSubgroups = d3.scaleBand()
    .domain(subgroups)
    .range([0, xScale.bandwidth()])
    .padding([0.1])
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#65a5d0', '#85618b', '#9b8dcd'])
  const bar = svg.append('g')
    .selectAll('g')
    .data(voteRate.value)
    .join('g')
    .attr('transform', d => `translate(${xScale(d.city)}, 0)`)

  bar.selectAll('rect')
    .data(d => {
      return subgroups.map(i => {
        return { key: i, value: d[i] }
      })
    })
    .join('rect')
    .attr('x', d => xSubgroups(d.key))
    .attr('y', yScale(0))
    .attr('width', xSubgroups.bandwidth())
    .transition()
    .duration(1000)
    .delay((d, i) => i * 100)
    .attr('y', d => yScale(d.value.split(',').join('')))
    .attr('height', d => {
      return (svgH - marginB) - yScale(parseInt(d.value))
    })
    .attr('fill', d => color(d.key))
    .style('cursor', 'pointer')

  const text = d3.selectAll('text')
    .style('font-size', '14px')
  // 新增tooltips
  const tooltips = d3.select('.voteBar').append('div')
    .attr('class', 'tooltip2')
    .style('position', 'absolute')
    .style('visibility', 'hidden') // 一開始tooltips是隱藏的
    .style('background-color', 'rgba(78, 67, 118, 1)')
    .style('color', '#fff')
    .style('padding', '12px 16px')
  bar.on('mouseover', handleMouseOver)
    .on('mouseleave', handleMouseLeave)

  function handleMouseOver (d, i) {
    d3.select(this).style('opacity', '0.7')
    tooltips.style('visibility', 'visible')
      .style('bottom', 100 + 'px')
      .style('left', xScale(i.city.trim()) - 40 + 'px')
      .html(`<p>${i.city.trim()}投票率</p>
             <p>2012　　${i['2012voterate']}%</p>
             <p>2016　　${i['2016voterate']}%</p>
             <p>2020　　${i['2020voterate']}%</p>
            `)
    d3.selectAll('.tooltip2 p')
      .style('font-size', '14px')
      .style('margin', '4px')
  }

  function handleMouseLeave () {
    // 移除文字
    d3.select(this).style('opacity', '1')
    d3.select('.tooltip2').style('visibility', 'hidden')
  }
}
</script>

<template>
  <div class="wrap">
    <!-- <RouterLink to="/">首頁</RouterLink> -->
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
            <div class="pie">
              <h4>選舉概況</h4>
              <div class="pieChart">
                <div class="pieText">
                  <div class="title">
                    <p>投票率</p>
                    <p>投票數</p>
                    <p>有效票數</p>
                    <p>無效票數</p>
                  </div>
                  <div class="value">
                    <p>{{ textContent.voteRate }} %</p>
                    <p>{{ textContent.voteTotal }}</p>
                    <p>{{ textContent.valid }}</p>
                    <p>{{ textContent.invalid }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="barChart">
              <div class="barTag">
                <div class="tagGroups">
                  <div class="tag"><img src="./img/01.png" alt="">新世代改革黨</div>
                  <div class="tag"><img src="./img/02.png" alt="">未來前進黨</div>
                  <div class="tag"><img src="./img/03.png" alt="">星際和平黨</div>
                </div>
                <img src="./img/icon1.png" alt="icon2">
              </div>
              <h4>各縣市政黨得票數</h4>
              <div class="barScroll">
                <div class="bar"></div>
              </div>
            </div>
          </div>
          <taiwanMap :colorData="heightTotal"></taiwanMap>
        </div>
        <div class="hr"></div>
        <div class="barChart2">
          <h4>各縣市歷屆投票率變化</h4>
          <div class="flex">
            <div class="barScroll">
              <div class="voteBar"></div>
            </div>
            <div class="voteBarTag">
              <img src="./img/icon1.png" alt="icon2">
              <div class="tag">2012</div>
              <div class="tag">2016</div>
              <div class="tag">2020</div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- <RouterView /> -->
  </div>
</template>

<style lang="scss" scoped>
h4 {
  font-size: 32px;
  color: #fff;
  margin-bottom: 40px;
}

.barScroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-button {
    background: transparent;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track-piece {
    background: rgba(217, 217, 217, 1);
    border-radius: 20px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 16px;
    background-color: rgba(78, 67, 118, 1);
    position: relative;
  }

  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
}

.hr {
  width: 100%;
  height: 1px;
  background: #fff;
  margin-top: 64px;
  margin-bottom: 40px;
}

.barChart {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  h4 {
    display: flex;
    align-items: end;
    margin: 0;
  }

  .barTag {
    display: flex;
    max-width: 170px;
    width: 100%;
    margin-right: 75px;

    &>img {
      display: none;
    }

    .tag {
      display: flex;
      align-items: center;
      height: 40px;
      color: #fff;
      margin-bottom: 8px;
      font-size: 20px;
      padding: 8px;

      img {
        display: inline;
        margin: 0;
        margin-right: 8px;
      }

      &:nth-of-type(1) {
        background: linear-gradient(86.18deg, #08C0BE 1.78%, rgba(200, 240, 240, 0) 122.05%);
      }

      &:nth-of-type(2) {
        background: linear-gradient(86.8deg, #C857A3 2.93%, rgba(188, 143, 174, 0) 191.01%);
      }

      &:nth-of-type(3) {
        background: linear-gradient(89.28deg, #AD8427 0.74%, rgba(252, 238, 207, 0) 162.36%);
        margin-bottom: 0;
      }
    }
  }

  .bar {
    width: 200%;
    height: 312px;
  }
}

.barChart2 {
  width: 100%;
  padding-bottom: 60px;

  .flex {
    display: flex;
    align-items: end;
  }

  .barScroll {
    width: 80%;
    overflow-y: hidden;
  }

  .voteBar {
    width: 200%;
    height: 442px;
  }

  h4 {
    margin-left: 240px;
  }

  .voteBarTag {
    margin-left: 60px;
    margin-bottom: 60px;

    img {
      margin: 0;
      margin-bottom: 100px;
      margin-left: 96px;
    }

    .tag {
      max-width: 108px;
      width: 100%;
      text-align: center;
      padding: 8px 36px;
      color: #fff;
      margin-top: 16px;

      &:nth-of-type(1) {
        background: #65a5d0;
      }

      &:nth-of-type(2) {
        background: #85618b;
      }

      &:nth-of-type(3) {
        background: #9b8dcd;
      }
    }
  }
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

  .pie {
    width: 55%;

    .pieChart {
      width: 100%;
      display: flex;
      align-items: center;

      .pieText {
        order: 2;
        display: flex;
        color: #fff;

        p {
          margin: 8px;
        }
      }
    }
  }
}

@media(max-width: 768px) {
  .barChart {
    .bar {
      width: 300%;
      height: 312px;
    }

    .barTag {
      margin-right: 48px;
    }
  }

  .chartContent {
    .icon {
      display: none;
    }

    .pie {
      width: 100%;
      margin-bottom: 24px;
    }
  }

  .barChart2 {

    .barScroll {
      width: 85%;
    }

    .voteBar {
      width: 400%;
    }

    h4 {
      text-align: center;
      margin-left: 0;
    }

    .voteBarTag {
      margin-left: 60px;
      margin-bottom: 60px;

      img {
        width: 150px;
        margin-bottom: 100px;
        margin-left: 36px;
      }

      .tag {
        padding: 8px 16px;
      }
    }
  }
}

@media(max-width: 767px) {
  .barChart {
    justify-content: center;

    .barTag {
      max-width: 100%;
      margin-right: 0;
      justify-content: space-between;
      align-items: center;

      &>img {
        width: 120px;
        height: 120px;
        display: block;
        margin: 0;
      }
    }

    h4 {
      margin-top: 24px;
    }
  }

  .chartContent {
    width: 100%;

    .pie {
      h4 {
        text-align: center;
      }

      .pieChart {
        flex-direction: column;

        .pieText {
          margin-top: 16px;
        }
      }
    }
  }

  .barChart2 {
    .flex {
      flex-direction: column;
      align-items: start;
    }

    .barScroll {
      width: 100%;
    }

    .voteBar {
      width: 500%;
    }

    h4 {
      text-align: center;
      margin-left: 0;
      margin-bottom: 24px;
    }

    .voteBarTag {
      display: flex;
      margin: 0;
      margin-top: 24px;

      img {
        display: none;
      }

      .tag {
        margin-right: 16px;
      }
    }
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
