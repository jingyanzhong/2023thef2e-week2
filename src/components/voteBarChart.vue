<script setup>
import * as d3 from 'd3'
import { ref, onMounted, watch } from 'vue'

const voteRate = ref([])
const props = defineProps(['all-data'])
watch(() => props.allData, (n) => {
  voteRate.value = n
  drawVoteBarChart()
}, { deep: true })

onMounted(() => {
  window.onresize = () => {
    drawVoteBarChart()
  }
})

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
    <div class="barChart2">
        <h4>各縣市歷屆投票率變化</h4>
        <div class="flex">
            <div class="barScroll">
                <div class="voteBar"></div>
            </div>
            <div class="voteBarTag">
                <img src="../img/icon1.png" alt="icon2">
                <div class="tag">2012</div>
                <div class="tag">2016</div>
                <div class="tag">2020</div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
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

@media(max-width: 768px) {
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
}
</style>
