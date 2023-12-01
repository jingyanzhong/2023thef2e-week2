<script setup>
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { ref, onMounted } from 'vue'
onMounted(() => {
  getData()
  window.onresize = () => {
    drawTaiwanMap()
  }
})
const props = defineProps(['colorData'])
const mapData = ref([])
async function getData () {
  const getData = await d3.json('./taiwanMap01.json').then((data) => {
    const counties = topojson.feature(data, data.objects.COUNTY_MOI_1090820)
    mapData.value = counties
  })
  drawTaiwanMap()
}
function drawTaiwanMap () {
  d3.select('.taiwanMap').style('position', 'relative')

  const svgW = parseInt(d3.select('.taiwanMap').style('width'))
  const svgH = parseInt(d3.select('.taiwanMap').style('height'))
  const svg = d3.select('.taiwanMap svg').style('width', svgW).style('height', svgH)
  const w = document.body.clientWidth
  const mercatorScale = ref(9000)
  if (w > 1366) {
    mercatorScale.value = 9000
  } else if (w < 1366 && w > 768) {
    mercatorScale.value = 7500
  } else {
    mercatorScale.value = 5500
  }
  const project = d3.geoMercator().center([121, 24.5]).scale(mercatorScale.value)
    .translate([svgW / 2, svgH / 2.5])
  const pathGenerator = d3.geoPath().projection(project)
  const geoPath = svg.selectAll('path')
    .data(mapData.value.features)
    .attr('d', pathGenerator)
    .style('stroke', '#fff')
    .attr('stroke-width', '1px')
    .style('cursor', 'pointer')
    .on('mouseover', function (e, i) {
      d3.select(this).style('opacity', '0.8')
      tooltips.style('visibility', 'visible')
      tooltips.style('left', e.layerX + 20 + 'px')
      tooltips.style('top', e.layerY + 'px')
        .html(`<p>${i.properties.COUNTYNAME}</p>`)
    })
    .on('mouseleave', function (e) {
      d3.select(this).style('opacity', '1')
      tooltips.style('visibility', 'hidden')
    })

  // 新增tooltips
  const tooltips = d3.select('.taiwanMap').append('div')
    .attr('class', 'tooltips')
    .style('position', 'absolute')
    .style('visibility', 'hidden') // 一開始tooltips是隱藏的
    .style('color', '#fff')
    // .style('padding', '12px 16px')
}
// 區域顏色
const areaColor = (city) => {
  const color = ref('')
  props.colorData.forEach(item => {
    if (item.city === city) {
      color.value = item.color
    }
  })
  return color.value
}

</script>
<template>
    <div class="taiwanMap">
        <svg>
            <path v-for="city in mapData.features" :key="city.properties.COUNTYCODE" :class="'county_' + city.properties.COUNTYCODE" :fill='areaColor(city.properties.COUNTYNAME)' ></path>
        </svg>
    </div>
</template>

<style lang="scss" scoped>
.taiwanMap {
    width: 35%;

    img {
        width: 100%;
        max-width: 552px;
        margin: 0;
    }
}

@media(max-width: 767px) {
    .taiwanMap {
        display: none;
    }
}
</style>
