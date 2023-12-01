<script setup>
import { ref } from 'vue'
const text = ref(15)
const year = ref(2020)
const emit = defineEmits(['get-year'])
function yearEmits (t, y) {
  text.value = t
  year.value = y
  emit('get-year', y)
}
</script>

<template>
    <header>
        <div class="container d-flex align-items-center">
            <h1>
                <RouterLink to="/">
                    總統即時開票全台地圖
                </RouterLink>
            </h1>
            <nav class="position-relative">
                <div class="line bg-primary"></div>
                <a href="#" class="circle circle1 active position-absolute" @click="yearEmits(15, 2020)">
                    <div class="text position-absolute d-flex">
                        <span>2020</span>
                        <span class="text-m active-none moblie-none"
                            :class="{ 'active-show': text === 15 }">第15任總統副總選舉</span>
                    </div>
                </a>
                <a href="#" class="circle circle2 position-absolute start-50" @click="yearEmits(14, 2016)">
                    <div class="text position-absolute d-flex">
                        <span>2016</span>
                        <span class="text-m active-none moblie-none"
                            :class="{ 'active-show': text === 14 }">第14任總統副總選舉</span>
                    </div>
                </a>
                <a href="#" class="circle circle3 position-absolute" @click="text=13">
                    <div class="text position-absolute d-flex">
                        <span>2012</span>
                        <span class="text-m active-none moblie-none"
                            :class="{ 'active-show': text === 13 }">第13任總統副總選舉</span>
                    </div>
                </a>
                <div class="moblie-text">
                    <span>第{{ text }}任總統副總選舉</span>
                </div>
            </nav>
        </div>
    </header>
</template>
<style lang="scss" scoped>
.active-none {
    display: none;
}

.active-show {
    display: block;
}

.moblie-text {
    display: none;
}

header {
    margin-bottom: 40px;
    padding: 50px 0;
    background: linear-gradient(175deg, rgba(217, 217, 217, 1), rgba(217, 217, 217, 0));
}

h1 {
    margin-right: 90px;

    a {
        display: block;
        background: url(../img/logo.png);
        width: 100px;
        height: 100px;
        overflow: hidden;
        text-wrap: nowrap;
        text-indent: 101%;
    }
}

nav {
    width: 100%;
}

.line {
    width: 100%;
    height: 8px;
    margin-top: 47px;
    border-radius: 5px;
}

.circle {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    top: 30px;
    transition: all .5s;
    background: rgba(78, 67, 118, 1);

    &:hover {
        background: rgba(133, 97, 139, 1);

        span {
            color: rgba(133, 97, 139, 1);
        }
    }

    .text {
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 32px;
    }

    span {
        color: rgba(78, 67, 118, 1);
        text-wrap: nowrap;
        transition: all .5s;
    }
}

.circle1 {
    left: 15%;
}

.circle2 {
    transform: translateX(-50%);
}

.circle3 {
    right: 15%;
}

@media(max-width: 1280px) {
    .circle {
        .text {
            font-size: 24px;
        }
    }

    .circle1 {
        left: 18%;
    }

    .circle3 {
        right: 18%;
    }
}

@media(max-width: 768px) {
    .moblie-none {
        display: none;
    }

    .moblie-text {
        display: block;
        position: absolute;
        bottom: -60px;
        font-size: 24px;
        color: rgba(78, 67, 118, 1);
    }

    header {
        padding: 40px 0;
    }

    h1 {
        margin-right: 16px;

        a {
            width: 60px;
            height: 60px;
            background-size: cover;
        }
    }

    .line {
        margin-top: 0px;
        border-radius: 5px 0 0 5px;
    }

    .circle {
        top: -16px;

        .text {
            font-size: 24px;
            top: -36px;
        }

        .text-m {
            position: absolute;
            bottom: -81px;
        }
    }

    .circle1 {
        left: 10%;
    }

    .circle3 {
        right: 10%;
    }
}</style>
