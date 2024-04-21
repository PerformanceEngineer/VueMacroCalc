<script setup>
import { ref } from 'vue'

const step = ref(1)
const name = ref('')
const age = ref(null)
const weight = ref(null)
const gender = ref('')
const bfatestimate = ref(null)
const targetweight = ref(null)
const traininghours = ref(null)
const neat = ref(null)
const teelow = ref(0.0)
const teehigh = ref(0.0)

const low = ref(0.0)
const high = ref(0.0)

function nextStep() {
  step.value++
  console.log('step:' + step.value.toString())
  if (step.value == 9) calculateTEE()
}

function setGender(g) {
  gender.value = g
  nextStep()
}

function setNEAT(n) {
  neat.value = n
  nextStep()
}

function calculateTEE() {
  if (gender.value === 'female') {
    low.value = 7.0
    high.value = 10.0
  } else {
    low.value = 9.0
    high.value = 11.0
  }
  teelow.value = targetweight.value * (low.value + traininghours.value) * 2.2
  teehigh.value = targetweight.value * (high.value + traininghours.value) * 2.2
}

// onMounted(() => {
//   this.calculateTEE()
// })

// calculateTEE()
</script>

<template>
  <div class="centerdiv">
    <div class="logodiv">
      <img
        id="responsive-image"
        src="https://highperformers.fit/wp-content/uploads/2021/02/Logo_HighPerformersTrans_Schriftzug.png"
      />
    </div>
  </div>

  <h2 v-if="step === 1">Wie heißt Du?</h2>
  <h2 v-if="step === 2">Wie alt bist Du?</h2>
  <h2 v-if="step === 3">Wie hoch ist Dein Gewicht (in kg)?</h2>
  <h2 v-if="step === 4">Was ist Dein Geschlecht?</h2>
  <h2 v-if="step === 5">Wie hoch ist Dein Körperfettanteil (in%)?</h2>

  <h2 v-if="step === 6">Was ist Dein Zielgewicht (in kg)?</h2>

  <h2 v-if="step === 7">In der Woche trainierst Du durchschnittlich...?</h2>
  <h2 v-if="step === 8">Dein Aktivitätsniveau abseits vom Training ist...</h2>
  <h2 v-if="step === 9">Dein Energiebedarf</h2>

  <form v-if="step === 1" @submit.prevent="nextStep">
    <input class="hugeInput" type="text" v-model="name" placeholder="Dein Name" /><br />
    <input class="button" type="submit" value="OK" :disabled="!name" />
  </form>

  <form v-if="step === 2" @submit.prevent="nextStep">
    <input
      class="hugeInput"
      type="number"
      v-model="age"
      placeholder="Alter"
      min="18"
      max="120"
    /><br />
    <input class="button" type="submit" value="OK" :disabled="!age" />
  </form>

  <form v-if="step === 3" @submit.prevent="nextStep">
    <input class="hugeInput" type="number" v-model="weight" placeholder="Gewicht" min="0" /><br />
    <input class="button" type="submit" value="OK" :disabled="!weight" />
  </form>

  <div v-if="step === 4" class="arrange-horizontally">
    <div class="arrange-vertically">
      <img
        src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/man.svg"
      /><br />
      <button class="button" @click="setGender('male')">Mann</button>
    </div>
    <div class="arrange-vertically">
      <img
        src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/woman.svg"
      /><br />
      <button class="button" @click="setGender('female')">Frau</button>
    </div>
  </div>

  <form v-if="step === 5" @submit.prevent="nextStep">
    <input
      class="hugeInput"
      type="number"
      v-model="bfatestimate"
      placeholder="Körperfettanteil"
    /><br />
    <input class="button" type="submit" value="OK" :disabled="!bfatestimate" />
  </form>


  <form v-if="step === 6" @submit.prevent="nextStep">
    <input class="hugeInput" type="number" v-model="targetweight" placeholder="Zielgewicht" min="0" /><br />
    <input class="button" type="submit" value="OK" :disabled="!targetweight" />
  </form>

  <form v-if="step === 7" @submit.prevent="nextStep">
    <input
      class="hugeInput"
      type="number"
      v-model="traininghours"
      placeholder="Durchschnittliche Trainingsstunden / Woche"
    /><br />
    <input class="button" type="submit" value="OK" :disabled="!traininghours" />
  </form>

  <form v-if="step === 8" @submit.prevent="nextStep">
    <div class="flex-container">
      <div class="flex-child">
        <img
          src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo1.svg"
          style="width: 100%"
        /><br />
        <button class="button" @click="setNEAT(1)">Niedrig</button>
      </div>
      <div class="flex-child">
        <img
          src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo2.svg"
          style="width: 100%"
        /><br />
        <button class="button" @click="setNEAT(2)">Moderat</button>
      </div>
      <div class="flex-child">
        <img
          src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo2.svg"
          style="width: 100%"
        /><br />
        <button class="button" @click="setNEAT(3)">Hoch</button>
      </div>
    </div>
  </form>

  <div v-if="step === 9" class="flex-container">
    <div class="flex-child" style="border: 0px none"></div>
    <div class="flex-child">Zielgewicht: {{ targetweight }}</div>
    <div class="flex-child">Training: {{ traininghours }} Stunden / Woche</div>
    <div class="flex-child">Kalorienbedarf: {{ teelow }} bis {{ teehigh }} / Tag</div>
    <div class="flex-child" style="border: 0px none"></div>
  </div>

  <div v-if="step === 9" class="flex-container">
    <div class="flex-child" style="border: 0px none"></div>
    <div class="flex-child">
      Aktivität: {{ neat === 1 ? 'Niedrig' : neat === 2 ? 'Moderat' : 'Hoch' }}
    </div>
    <div class="flex-child"></div>
    <div class="flex-child">
      Kalorienbedarf: {{ (targetweight * (low + traininghours + neat - 1) * 2.2).toFixed(2) }} kcal
      / Tag
    </div>
    <div class="flex-child" style="border: 0px none"></div>
  </div>

</template>
