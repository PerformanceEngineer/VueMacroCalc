<script setup>
import { ref, computed } from 'vue'

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

// Computed properties for calculating the macronutrient ranges
const lbm = computed(() => weight.value * (1.0 - bfatestimate.value / 100.0))
const lowProt = computed(() => Math.round(lbm.value * 1.8))
const lowFat = computed(() => (teelow.value * 0.2) / 9.0)
const lowCarb = computed(() => (teelow.value * 0.8 - lowProt.value * 4.5) / 4.5)

const highProt = computed(() => Math.round(lbm.value * 2.2))
const highFat = computed(() => (teehigh.value * 0.2) / 9.0)
const highCarb = computed(() => (teehigh.value * 0.8 - highProt.value * 4.5) / 4.5)

let remainingcals = teehigh

const proteinperservingprotein = computed(() => (gender.value === 'male' ? 24.0 : 22.0))
const kcalperservingprotein = 145
const protein = computed(() => lbm.value * 2.0)

let proteinservings = 0
let fatservings = 0
let carbservings = 0
let totalcalories = 0
let totalprotein = 0
let totalfats = 0
let totalcarbs = 0
let veggieservings = 0

function calculateHandSizes() {
  proteinservings = protein.value / proteinperservingprotein.value
  remainingcals.value -= proteinservings * kcalperservingprotein

  const fatperservingfat = gender.value === 'male' ? 9.0 : 8.0
  fatservings = highFat.value / fatperservingfat
  const kcalperservingfat = 90.0
  remainingcals.value -= fatservings * kcalperservingfat

  const carbsperservingcarbs = gender.value === 'male' ? 25.0 : 22.0
  carbservings = highCarb.value / carbsperservingcarbs

  veggieservings = gender.value === 'male' ? 8.0 : 6.0

  if (gender.value === 'male') {
    proteinservings =
      0.04369122257053291 * protein.value -
      0.02155936207914943 * highFat.value -
      0.0035440047253396337 * highCarb.value
    carbservings =
      -0.0049222287851939358 * protein.value -
      0.002067336089781453 * highFat.value +
      0.04075605434140578 * highCarb.value
    fatservings =
      -0.008663122661941327 * protein.value +
      0.1163614884819846 * highFat.value -
      0.0082693443591258121 * highCarb.value
  } else {
    proteinservings =
      0.04768856447688564 * protein.value -
      0.02092457420924574 * highFat.value -
      0.0024330900243309 * highCarb.value
    carbservings =
      -0.00608272506082725 * protein.value -
      0.0024330900243309 * highFat.value +
      0.046228710462287104 * highCarb.value
    fatservings =
      -0.0024330900243309 * protein.value +
      0.116301703163017 * highFat.value -
      0.0097323600973236 * highCarb.value
  }

  proteinservings = Math.round(proteinservings)
  carbservings = Math.round(carbservings)
  fatservings = Math.round(fatservings)

  totalprotein =
    proteinservings * 24.0 + carbservings * 3.0 + fatservings * 2.0 + veggieservings * 1.5
  totalcarbs =
    proteinservings * 2.0 + carbservings * 22.0 + fatservings * 2.0 + veggieservings * 5.0
  totalfats = proteinservings * 4.5 + carbservings * 1.0 + fatservings * 8.0
  totalcalories = totalprotein * 4.5 + totalcarbs * 4.5 + totalfats * 9.0
}

function nextStep() {
  step.value++
  console.log('step:' + step.value.toString())
  if (step.value == 9) calculateTEE()
  if (step.value == 11) calculateHandSizes()
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
    <div class="MyLogoDiv">
      <img
        id="responsive-image"
        src="https://lukaspezenka.files.wordpress.com/2018/02/cropped-header-large-bg.png"
      />
    </div>
  </div>

  <div class="centerdiv">
    <h2 v-if="step === 1">Wie heißt Du?</h2>
    <h2 v-if="step === 2">Wie alt bist Du?</h2>
    <h2 v-if="step === 3">Wie hoch ist Dein Gewicht (in kg)?</h2>
    <h2 v-if="step === 4">Was ist Dein Geschlecht?</h2>
    <h2 v-if="step === 5">Wie hoch ist Dein Körperfettanteil (in%)?</h2>
    <h2 v-if="step === 6">Was ist Dein Zielgewicht (in kg)?</h2>
    <h2 v-if="step === 7">In der Woche trainierst Du durchschnittlich...?</h2>
    <h2 v-if="step === 8">Dein Aktivitätsniveau abseits vom Training ist...</h2>
    <h2 v-if="step === 9">Dein Energiebedarf</h2>
    <h2 v-if="step === 10">Deine Makronährstoffe</h2>
  </div>

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
    <input
      class="hugeInput"
      type="number"
      v-model="targetweight"
      placeholder="Zielgewicht"
      min="0"
    /><br />
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

  <div v-if="step === 9" class="centerdiv">
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
        Kalorienbedarf:
        {{ (targetweight * (low + traininghours + neat - 1) * 2.2).toFixed(2) }} kcal / Tag
      </div>
      <div class="flex-child" style="border: 0px none"></div>
    </div>

    <form v-if="step === 9" @submit.prevent="nextStep">
      <input class="button" type="submit" value="OK" :disabled="!traininghours" />
    </form>
  </div>

  <div v-if="step === 10" class="centerdiv">
    <form @submit.prevent="nextStep">
      <div class="flex-container" style="background-color: white">
        <div class="flex-child" style="border: 0px none"></div>
        <div class="flex-child">
          <img
            src="https://cdn1.iconfinder.com/data/icons/fitness-55/300/protein--gym-fitness-sport-512.png"
            style="width: 100%"
          /><br />
          Protein: {{ lowProt }} bis {{ highProt }} Gramm / Tag
        </div>

        <div class="flex-child">
          <img src="https://img.icons8.com/ios/452/carbohydrates.png" style="width: 100%" /><br />
          Kohlenhydrate: {{ lowCarb }} bis {{ highCarb }} Gramm / Tag
        </div>

        <div class="flex-child">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVv8gHhj3quy7jDCf_9tboeYiZYJqzpjMLoA&usqp=CAU"
            style="width: 100%"
          /><br />
          Fette: {{ lowFat }} bis {{ highFat }} Gramm / Tag
        </div>
        <div class="flex-child" style="border: 0px none"></div>
      </div>
      <br />
      <input type="submit" class="button" value="Verstanden" />
    </form>
  </div>

  <div v-if="step === 11" class="centerdiv">
    <div class="flex-container" style="margin-bottom: 10px; justify-content: center">
      <div class="flex-child" style="border: 0px none"></div>

      <div class="flex-child">
        <div class="arrange-vertically">
          <div class="flex-container">
            <div class="flex-child">
              <img
                src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/palm.svg"
              />
            </div>
            <div class="flex-child">
              Dein täglicher Eiweißbedarf liegt bei {{ proteinservings }} Handtellergroßen
              Portionen.
            </div>
          </div>

          <div class="flex-container">
            <div class="flex-child">
              <img
                src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/cupped.svg"
              />
            </div>
            <div class="flex-child">
              Kohlenhydrate befeuern Dein Training und Deine Denkleistung.
              {{ carbservings }} handvoll (verzehrfertig) sind ein guter Startpunkt.
            </div>
          </div>

          <div class="flex-container">
            <div class="flex-child">
              <img
                src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/thumb.svg"
              />
            </div>
            <div class="flex-child">
              Gesunde Fette stützen Dein Immunsystem und helfen Dir, mit Entzündungen zurecht zu
              kommen. : {{ fatservings }} daumengroße Portionen dürfen es schon sein.
            </div>
          </div>

          <div class="flex-container">
            <div class="flex-child">
              <img
                src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/fist.svg"
              />
            </div>
            <div class="flex-child">
              Eat the Rainbow! Runde Deine Ernährung ab mit {{ veggieservings }} faustgroßen
              Portionen Gemüse.
            </div>
          </div>
        </div>
      </div>

      <div class="flex-child" style="border: 0px none"></div>
    </div>

    <div class="flex-container" style="margin-bottom: 10px">
      <div class="flex-child" style="border: 0px none"></div>
      <div class="flex-child" style="border: 0px none">
        <div class="arrange-vertically">
          <div style="margin-bottom: 10px">
            Bei diesen Portionsvorgaben nimmst Du im Schnitt die folgenden Makronährstoffe zu Dir:
          </div>
          <div class="flex-container">
            <div class="flex-child">
              <img
                id="responsive-image"
                src="https://thumbs.dreamstime.com/z/protein-icon-illustration-white-background-protein-icon-illustration-119365622.jpg"
              />
            </div>
            <div class="flex-child">{{ totalprotein }} Gramm Eiweiß</div>
          </div>

          <div class="flex-container">
            <div class="flex-child">
              <img id="responsive-image" src="https://img.icons8.com/ios/452/carbohydrates.png" />
            </div>
            <div class="flex-child">{{ totalcarbs }} Gramm Kohlenhydrate</div>
          </div>

          <div class="flex-container">
            <div class="flex-child">
              <img
                id="responsive-image"
                src="https://www.pngitem.com/pimgs/m/163-1631365_trans-fat-no-trans-fat-icon-hd-png.png"
              />
            </div>
            <div class="flex-child">{{ totalfats }} Gramm Fett</div>
          </div>
        </div>
      </div>
      <div class="flex-child" style="border: 0px none"></div>
    </div>
  </div>
</template>
