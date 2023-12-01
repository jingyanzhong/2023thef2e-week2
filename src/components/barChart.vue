<script setup>
import * as d3 from 'd3'
import { ref, onMounted, watch } from 'vue'

const allData = ref([])
const props = defineProps(['all-data'])
watch(() => props.allData, (n) => {
  allData.value = n
  drawBarChart()
}, { deep: true })

onMounted(() => {
  window.onresize = () => {
    drawBarChart()
  }
})
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
</script>
<template>
    <div class="barChart">
        <div class="barTag">
            <div class="tagGroups">
                <div class="tag"><img src="../img/01.png" alt="">新世代改革黨</div>
                <div class="tag"><img src="../img/02.png" alt="">未來前進黨</div>
                <div class="tag"><img src="../img/03.png" alt="">星際和平黨</div>
            </div>
            <img src="../img/icon1.png" alt="icon2">
        </div>
        <h4>各縣市政黨得票數</h4>
        <div class="barScroll">
            <div class="bar"></div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
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
}
</style>
