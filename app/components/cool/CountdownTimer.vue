<template>
  <div class="countdown flex justify-center gap-4 flex-wrap">
    <UPageCard spotlight v-for="unit in units" :key="unit.label" class="slide-unit flex flex-col items-center ">
      <div class="overflow-hidden relative h-[3rem] w-[3rem]">
        <div
          class="absolute w-full flex flex-col transition-transform duration-700 ease-out"
          :style="{ transform: `translateY(-${unit.offset}px)` }"
        >
          <div
            v-for="num in unit.numbers"
            :key="num + '-' + unit.label"
            class="flex items-center justify-center h-[3rem] text-2xl font-bold dark:text-white"
          >
            {{ num }}
          </div>
        </div>
      </div>
      <div class="dark:text-white text-xs mt-1 font-semibold tracking-widest">{{ unit.label }}</div>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'

interface Props {
  targetDate: string | Date
}
const props = defineProps<Props>()

const formatNumber = (num: number) => num.toString().padStart(2, '0')

const NUMBER_HEIGHT = 48 // height in px (3rem)

function generateNumbers(max: number) {
  const arr = []
  for (let i = 0; i <= max; i++) arr.push(formatNumber(i))
  return arr
}

const units = reactive([
  { label: 'DAYS', value: '00', numbers: generateNumbers(365), offset: 0 },
  { label: 'HOURS', value: '00', numbers: generateNumbers(23), offset: 0 },
  { label: 'MINUTES', value: '00', numbers: generateNumbers(59), offset: 0 },
  { label: 'SECONDS', value: '00', numbers: generateNumbers(59), offset: 0 },
])

let interval: number

function updateCountdown() {
  const now = new Date().getTime()
  const target = new Date(props.targetDate).getTime()
  let diff = target - now

  if (diff <= 0) {
    units.forEach(u => scrollToNumber(u, '00'))
    clearInterval(interval)
    return
  }

  let days = Math.floor(diff / (1000 * 60 * 60 * 24))
  let hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  let minutes = Math.floor((diff / (1000 * 60)) % 60)
  let seconds = Math.floor((diff / 1000) % 60)

  scrollToNumber(units[0], formatNumber(days))
  scrollToNumber(units[1], formatNumber(hours))
  scrollToNumber(units[2], formatNumber(minutes))
  scrollToNumber(units[3], formatNumber(seconds))
}

function scrollToNumber(unit: any, newVal: string) {
  unit.value = newVal
  const index = unit.numbers.indexOf(newVal)
  if (index === -1) return
  unit.offset = index * NUMBER_HEIGHT
}

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.slide-unit {
  perspective: 400px;
}

.transition-transform {
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>