<script setup>
import * as d3 from 'd3'
import { ref, onMounted, watch } from 'vue'

const pieData = ref([])
const allData = ref([])
const textContent = ref([])

const props = defineProps(['data', 'all-data'])
watch(() => props.data, (n) => {
  pieData.value = n
}, { deep: true })

watch(() => props.allData, (n) => {
  allData.value = n
  getData()
}, { deep: true })

onMounted(() => {
  window.onresize = () => {
    drawPieChart()
  }
})

function getData () {
  textContent.value = {
    voteRate: allData.value[0]['投票率'],
    voteTotal: allData.value[0]['投票數'],
    valid: allData.value[0]['有效票數'],
    invalid: allData.value[0]['無效票數']
  }
  drawPieChart()
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
  const data_ready = piechart(pieData.value)
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
}
</script>
<template>
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
</template>

<style lang="scss" scoped>
.pie {
    width: 55%;

    .pieChart {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 48px;
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

@media (max-width: 767px) {
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
</style>
