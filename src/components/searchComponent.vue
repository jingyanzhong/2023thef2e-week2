<script setup>
import { ref, watch } from 'vue'
const searchValue = ref('all')
const county = ref('縣市')
const countyShow = ref(false)
const town = ref('鄉鎮')
const townShow = ref(false)
const props = defineProps(['cityData'])
const cityData = ref([])
watch(() => props.cityData, (n) => {
  cityData.value = n
}, { deep: true })
function searchContentShow (val) {
  if (val === 'county') {
    countyShow.value = !countyShow.value
    townShow.value = false
  } else if (val === 'town') {
    townShow.value = !townShow.value
    countyShow.value = false
  }
}
function searchChange (val) {
  if (val === 'all') {
    searchValue.value = 'all'
    county.value = '縣市'
    town.value = '鄉鎮'
    countyShow.value = false
    townShow.value = false
  } else if (val === 'county') {
    countyShow.value = false
    searchValue.value = ''
  } else if (val === 'town') {
    townShow.value = false
  }
}
</script>

<template>
    <div class="search d-flex">
        <button type="button" class="btn allBtn btn-outline-white" :class="{ 'active': searchValue === 'all' }"
            @click="searchChange('all')">全國</button>
        <div class="countyBox">
            <button type="button" class="county btn btn-outline-white" @click="searchContentShow('county')">{{ county
            }}</button>
            <div class="countyBtnContent" :class="{ 'show': countyShow === true, 'none': countyShow === false }">
                <label v-for="item in cityData" :key="item.city" @click="searchChange('county')">
                    <input type="radio" name="county" :value="item.city" v-model="county">
                    <span>{{item.city}}</span>
                </label>
            </div>
        </div>
        <div class="townBox">
            <button type="button" class="town btn btn-outline-white" @click="searchContentShow('town')">{{ town
            }}</button>
            <div class="townBtnContent" :class="{ 'show': townShow === true, 'none': townShow === false }">
                <label @click="searchChange('town')">
                    <input type="radio" name="town" value="中正區" v-model="town">
                    <span>中正區</span>
                </label>
                <label @click="searchChange('town')">
                    <input type="radio" name="town" value="大安區" v-model="town">
                    <span>大安區</span>
                </label>
            </div>
        </div>
        <input type="search" class="searchText btn btn-outline-white" placeholder="找地區">
    </div>
</template>
<style lang="scss" scoped>
.search {
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 54px;
}

.allBtn {
    margin-right: 40px;
}

.countyBox,
.townBox {
    max-width: 255px;
    width: 100%;
    margin-right: 40px;
    position: relative;
}

.countyBtnContent,
.townBtnContent {
    max-width: 255px;
    width: 100%;
    max-height: 500px;
    overflow-y: auto;
    border: 3px solid #fff;
    border-radius: 16px;
    color: #fff;
    background: rgba(43, 88, 118, 1);
    font-size: 24px;
    padding: 16px 0;
    position: absolute;
    top: 80px;
    left: 0;
    z-index: 5;

    input {
        display: none;
    }

    label {
        display: block;
        text-align: center;
        padding: 8px 0;
        cursor: pointer;
        transition: all .5s;

        &:hover {
            background: rgba(255, 255, 255, .5);
        }
    }
    &::-webkit-scrollbar {
      width: 5px;
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
      background-color: rgb(77, 131, 167);
      position: relative;
    }

    &::-webkit-scrollbar-track {
      box-shadow: transparent;
    }
}

.searchText {
    width: calc(100% - (255px * 3 + 160px));
    min-width: 255px;
}

@media(max-width: 768px) {
    .search {
        justify-content: space-between;

    }

    .allBtn,
    .countyBox,
    .townBox {
        width: calc(33.3333% - 20px);
        margin-right: 0;

        button {
            width: 100%;
        }
    }

    .searchText {
        width: 100%;
        margin: 0;
    }
}

@media(max-width:767px) {

    .countyBtnContent,
    .townBtnContent {
        max-height: 250px;
        border: 1px solid #fff;
        font-size: 16px;
        padding: 8px 0;
        top: 66px;
    }

    .allBtn,
    .countyBox,
    .townBox {
        width: calc(33.3333% - 8px);
        font-size: 16px;

        button {
            font-size: 16px;
        }
    }
}
</style>
