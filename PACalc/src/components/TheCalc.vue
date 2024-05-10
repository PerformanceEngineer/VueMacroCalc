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

  let fatperservingfat = gender.value === 'male' ? 9.0 : 8.0
  fatservings = highFat.value / fatperservingfat
  const kcalperservingfat = 90.0
  remainingcals.value -= fatservings * kcalperservingfat

  let carbsperservingcarbs = gender.value === 'male' ? 25.0 : 22.0
  carbservings = highCarb.value / carbsperservingcarbs

  veggieservings = gender.value === 'male' ? 8.0 : 6.0

  let proteinperservingfat = 1.0
  let proteinperservingcarbs = 5.0
  let fatperservingprotein = 0.0
  let fatperservingcarbs = 1.0
  let carbsperservingprotein = 0.0
  let carbsperservingfat = 0.0
  carbsperservingcarbs = 19.0
  fatperservingfat = 9.0


  let result = solveEquations(
    proteinperservingprotein.value,
    proteinperservingfat.value,
    proteinperservingcarbs.value,
    fatperservingprotein.value,
    fatperservingfat.value,
    fatperservingcarbs.value,
    carbsperservingprotein.value,
    carbsperservingfat.value,
    carbsperservingcarbs.value,
    protein.value,
    highFat.value,
    teehigh.value
  )

  console.log(result)

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

function solveEquations(pp, pf, pc, fp, ff, fc, cp, cf, cc, PR, FR, TEE) {
    // Coefficients of the system of equations
    let coefficients = [
        [pp, pf, pc],
        [fp, ff, fc],
        [cp, cf, cc]
    ];

    // Right-hand side of the equations
    let rhs = [PR, FR, (TEE - (PR * 4 + FR * 9)) / 4];

    // Gaussian elimination
    for (let i = 0; i < 3; i++) {
        // Pivot for column
        let pivot = coefficients[i][i];

        // Divide every element of current row by pivot
        for (let j = i; j < 3; j++) {
            coefficients[i][j] /= pivot;
        }
        rhs[i] /= pivot;

        // Eliminate all other entries in current column
        for (let k = 0; k < 3; k++) {
            if (k !== i) {
                let factor = coefficients[k][i];
                for (let j = i; j < 3; j++) {
                    coefficients[k][j] -= factor * coefficients[i][j];
                }
                rhs[k] -= factor * rhs[i];
            }
        }
    }

    // Return values of x, y, z
    return { x: rhs[0], y: rhs[1], z: rhs[2] };
}

</script>

<template>
  <div class="container">
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

    <div class="container">
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
        <input
          class="hugeInput"
          type="number"
          v-model="weight"
          placeholder="Gewicht"
          min="0"
        /><br />
        <input class="button" type="submit" value="OK" :disabled="!weight" />
      </form>

      <div v-if="step === 4" class="container">
        <div class="row">
          <div class="col text-center">
            <img
              src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/man.svg"
            />
            <br />
            <button class="button" @click="setGender('male')">Mann</button>
          </div>
          <div class="col text-center">
            <img
              src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/woman.svg"
            /><br />
            <button class="button" @click="setGender('female')">Frau</button>
          </div>
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
        <div class="container">
          <div class="row">
            <div class="col">
              <img
                src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo1.svg"
                style="width: 100%"
              /><br />
              <button class="button" @click="setNEAT(1)">Niedrig</button>
            </div>
            <div class="col">
              <img
                src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo2.svg"
                style="width: 100%"
              /><br />
              <button class="button" @click="setNEAT(2)">Moderat</button>
            </div>
            <div class="col">
              <img
                src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo2.svg"
                style="width: 100%"
              /><br />
              <button class="button" @click="setNEAT(3)">Hoch</button>
            </div>
          </div>
        </div>
      </form>

      <!-- Summary -->
      <div v-if="step === 9" class="container">
        <div class="row">
          <div class="col">Zielgewicht: {{ targetweight }}</div>
          <div class="col">Training: {{ traininghours }} Stunden / Woche</div>
          <div class="col">
            Kalorienbedarf: {{ Math.round(teelow) }} bis {{ Math.round(teehigh) }} / Tag
          </div>
        </div>

        <div class="row">
          <div class="col" style="border: 0px none"></div>
          <div class="col">
            Aktivität: {{ neat === 1 ? 'Niedrig' : neat === 2 ? 'Moderat' : 'Hoch' }}
          </div>
          <div class="col"></div>
          <div class="col">
            Kalorienbedarf:
            {{ (targetweight * (low + traininghours + neat - 1) * 2.2).toFixed(2) }} kcal / Tag
          </div>
        </div>

        <form v-if="step === 9" @submit.prevent="nextStep">
          <input class="button" type="submit" value="OK" :disabled="!traininghours" />
        </form>
      </div>

      <!-- Macronutrient breakdown -->
      <div v-if="step === 10" class="container">
        <div class="row pt-4" style="background-color: white">
          <div class="col text-center">
            <img
              src="https://cdn1.iconfinder.com/data/icons/fitness-55/300/protein--gym-fitness-sport-512.png"
              style="width: 100%"
            /><br />
            Protein: {{ Math.round(lowProt) }} bis {{ highProt }} Gramm / Tag
          </div>

          <div class="col text-center">
            <img src="https://img.icons8.com/ios/452/carbohydrates.png" style="width: 100%" /><br />
            Kohlenhydrate: {{ Math.round(lowCarb) }} bis {{ Math.round(highCarb) }} Gramm / Tag
          </div>

          <div class="col text-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVv8gHhj3quy7jDCf_9tboeYiZYJqzpjMLoA&usqp=CAU"
              style="width: 100%"
            /><br />
            Fette: {{ Math.round(lowFat) }} bis {{ Math.round(highFat) }} Gramm / Tag
          </div>
        </div>
        <br />
        <form @submit.prevent="nextStep">
          <input type="submit" class="button" value="Verstanden" />
        </form>
      </div>

      <!-- Hand portion size breakdown -->
      <div v-if="step === 11" class="container">
        <div class="row pt-4">
          <div class="col text-center">
            <div class="row">
              <div class="col text-center">
                <img
                  src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/palm.svg"
                />
              </div>
            </div>
            <div class="row">
              <div class="col text-center">
                Dein täglicher Eiweißbedarf liegt bei {{ proteinservings }} Handtellergroßen
                Portionen.
              </div>
            </div>
          </div>

          <div class="col">
            <div class="row">
              <div class="col text-center">
                <img
                  src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/cupped.svg"
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                Kohlenhydrate befeuern Dein Training und Deine Denkleistung.
                {{ carbservings }} handvoll (verzehrfertig) sind ein guter Startpunkt.
              </div>
            </div>
          </div>

          <div class="col">
            <div class="row">
              <div class="col">
                <img
                  src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/thumb.svg"
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                Gesunde Fette stützen Dein Immunsystem und helfen Dir, mit Entzündungen zurecht zu
                kommen. : {{ fatservings }} daumengroße Portionen dürfen es schon sein.
              </div>
            </div>
          </div>

          <div class="col">
            <div class="row">
              <div class="col">
                <img
                  src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/fist.svg"
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                Eat the Rainbow! Runde Deine Ernährung ab mit {{ veggieservings }} faustgroßen
                Portionen Gemüse.
              </div>
            </div>
          </div>
        </div>

        <div class="row pt-4">
          <div class="col text-center">
            Bei diesen Portionsvorgaben nimmst Du im Schnitt {{ totalcalories }} Kalorien, und die
            folgenden Makronährstoffe zu Dir:
          </div>
        </div>

        <div class="row pt-4">
          <div class="col text-center">
            <div class="row">
              <div class="col">
                <img
                  id="responsive-image"
                  src="https://thumbs.dreamstime.com/z/protein-icon-illustration-white-background-protein-icon-illustration-119365622.jpg"
                />
              </div>
            </div>
            <div class="row">
              <div class="col">{{ totalprotein }} Gramm Eiweiß</div>
            </div>
          </div>

          <div class="col text center">
            <div class="row">
              <div class="col text-center">
                <img id="responsive-image" src="https://img.icons8.com/ios/452/carbohydrates.png" />
              </div>
            </div>
            <div class="row">
              <div class="col text-center">{{ totalcarbs }} Gramm Kohlenhydrate</div>
            </div>
          </div>

          <div class="col text center">
            <div class="row">
              <div class="col text-center">
                <img
                  id="responsive-image"
                  src="https://www.pngitem.com/pimgs/m/163-1631365_trans-fat-no-trans-fat-icon-hd-png.png"
                />
              </div>
            </div>
            <div class="row">
              <div class="col text-center">{{ totalfats }} Gramm Fette</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
