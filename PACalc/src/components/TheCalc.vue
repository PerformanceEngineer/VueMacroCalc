<script setup>
import { ref, computed } from 'vue'
//import carbimage from '../assets/carbs.svg'

const step = ref(1)
const name = ref('')
const age = ref(null)
const weight = ref(null)
const gender = ref(null)
//const bfatestimate = ref(null)
const targetweight = ref(null)
const traininghours = ref(null)
const neat = ref(null)
const teelow = ref(0.0)
const teehigh = ref(0.0)

const low = ref(0.0)
const high = ref(0.0)

// Computed properties for calculating the macronutrient ranges
//const lbm = computed(() => weight.value * (1.0 - bfatestimate.value / 100.0))
//const lowProt = computed(() => Math.round(lbm.value * 1.8))
const lowProt = computed(() => Math.round(weight.value * 1.8))
const lowFat = computed(() => (teelow.value * 0.2) / 9.0)
const lowCarb = computed(() => (teelow.value * 0.8 - lowProt.value * 4.5) / 4.5)

const highProt = computed(() => Math.round(weight.value * 2.2))
//const highProt = computed(() => Math.round(lbm.value * 2.2))
const highFat = computed(() => (teehigh.value * 0.2) / 9.0)
const highCarb = computed(() => (teehigh.value * 0.8 - highProt.value * 4.5) / 4.5)

//let remainingcals = teehigh.value

const proteinperservingprotein = computed(() => (gender.value === 'male' ? 24.0 : 22.0))
const kcalperservingprotein = 145
const protein = computed(() => weight.value * 2.0)
//const protein = computed(() => lbm.value * 2.0)

let proteinservings = 0
let fatservings = 0
let carbservings = 0
let totalcalories = 0
let totalprotein = 0
let totalfats = 0
let totalcarbs = 0
let veggieservings = 0


function calculateNew(){
  // Example usage
  const proteinTarget = 150;
  const fatTarget = 40;

  const proteinRich = {
      protein: 24, // grams of protein per serving
      fat: 3,      // grams of fat per serving
      carbs: 6,    // grams of carbs per serving
      kcal: 145
  };

  const fatRich = {
      protein: 1,  // grams of protein per serving
      fat: 9,      // grams of fat per serving
      carbs: 0,    // grams of carbs per serving
      kcal: 90
  };

  const carbRich = {
      protein: 5,  // grams of protein per serving
      fat: 1,      // grams of fat per serving
      carbs: 19,   // grams of carbs per serving
      kcal: 104
  };

  const veggies = {
      protein: 1.8,  // grams of protein per serving
      fat: 0,       // grams of fat per serving
      carbs: 3.1,   // grams of carbs per serving
      kcal: 33
  };

  try {
      console.log('************');
      const result = solveNutritionalTargets(proteinTarget, fatTarget, proteinRich, fatRich);
      result.fatRichServings = Math.ceil(result.fatRichServings);
      result.proteinRichServings = Math.ceil(result.proteinRichServings);

      console.log(`Protein-rich servings: ${result.proteinRichServings}`);
      console.log(`Fat-rich servings: ${result.fatRichServings}`);
      let kcalfp = result.proteinRichServings * proteinRich.kcal + result.fatRichServings * fatRich.kcal;
      console.log(`Total calories from protein and fat: ${kcalfp}`);
      veggieservings = 7.0;
      let kcalveggies = veggieservings * veggies.kcal;
      let kcalfpv = kcalfp + kcalveggies;
      console.log(`Total calories from protein, fat, and veggies: ${kcalfpv}`);
      let remainingcals = teehigh.value - kcalfpv;
      console.log(`Remaining calories: ${remainingcals}`);
      carbservings = remainingcals / carbRich.kcal;
      carbservings = Math.round(carbservings);
      console.log(`Carb servings: ${carbservings}`);
      let totalcalories = kcalfpv + carbservings * carbRich.kcal;
      console.log(`Total calories: ${totalcalories}`);
      console.log('************');

      let proteinperservingfat = 1.0
      let proteinperservingcarbs = 5.0
      let fatperservingprotein = 3.0
      let fatperservingcarbs = 1.0
      let carbsperservingprotein = 6.0
      let carbsperservingfat = 0.0
      let carbsperservingcarbs = 19.0
      let fatperservingfat = 9.0
      let proteinperservingveggies = 1.8
      let carbsperservingveggies = 3.1
      let fatsperservingveggies = 0.0
      let kcalperservingveggies = 33.0

      let kcalperservingcarbs = 104
      const kcalperservingfat = 90.0

      proteinservings = Math.round(result.proteinRichServings);
      fatservings = Math.round(result.fatRichServings);
      veggieservings = 7.0;
      let macros = calculateResult(proteinservings, fatservings, carbservings, veggieservings, proteinperservingprotein, proteinperservingcarbs, proteinperservingfat, proteinperservingveggies, fatperservingprotein, fatperservingcarbs, fatperservingfat, fatsperservingveggies, carbsperservingprotein, carbsperservingcarbs, carbsperservingfat, carbsperservingveggies, kcalperservingprotein, kcalperservingcarbs, kcalperservingfat, kcalperservingveggies)

      console.log(macros.totalcalories);
    

  } catch (error) {
      console.error(error.message);
  }

  
}

/*function calculateHandSizes() {

  console.info('Calculating hand sizes')
  console.info('Protein: ' + protein.value)
  console.info('Calories' + teehigh.value)

  // proteinservings = protein.value / proteinperservingprotein.value
  // remainingcals -= proteinservings * kcalperservingprotein

  let fatperservingfat = gender.value === 'male' ? 9.0 : 8.0
  // fatservings = highFat.value / fatperservingfat
  const kcalperservingfat = 90.0
  //remainingcals -= fatservings * kcalperservingfat

  let carbsperservingcarbs = gender.value === 'male' ? 25.0 : 22.0
  // carbservings = highCarb.value / carbsperservingcarbs

  veggieservings = gender.value === 'male' ? 8.0 : 6.0

  let proteinperservingfat = 1.0
  let proteinperservingcarbs = 5.0
  let fatperservingprotein = 3.0
  let fatperservingcarbs = 1.0
  let carbsperservingprotein = 6.0
  let carbsperservingfat = 0.0
  //carbsperservingcarbs = 19.0
  //fatperservingfat = 9.0
  let proteinperservingveggies = 1.8
  let carbsperservingveggies = 3.1
  let fatsperservingveggies = 0.0
  let kcalperservingveggies = 33.0

  let kcalperservingcarbs = 104

  let result = solveEquations(
    proteinperservingprotein.value,
    proteinperservingfat,
    proteinperservingcarbs,
    // proteinperservingveggies,
    
    fatperservingprotein,
    fatperservingfat,
    fatperservingcarbs,
    // fatsperservingveggies,
    
    carbsperservingprotein,
    carbsperservingfat,
    carbsperservingcarbs,
    // carbsperservingveggies,
    
    // kcalperservingveggies,
    // kcalperservingprotein,
    // kcalperservingfat,
    // kcalperservingcarbs,

    protein.value,
    highFat.value,
    teehigh.value
  )

  console.log(result)

  // if (gender.value === 'male') {
  //   proteinservings =
  //     0.04369122257053291 * protein.value -
  //     0.02155936207914943 * highFat.value -
  //     0.0035440047253396337 * highCarb.value
  //   carbservings =
  //     -0.0049222287851939358 * protein.value -
  //     0.002067336089781453 * highFat.value +
  //     0.04075605434140578 * highCarb.value
  //   fatservings =
  //     -0.008663122661941327 * protein.value +
  //     0.1163614884819846 * highFat.value -
  //     0.0082693443591258121 * highCarb.value
  // } else {
  //   proteinservings =
  //     0.04768856447688564 * protein.value -
  //     0.02092457420924574 * highFat.value -
  //     0.0024330900243309 * highCarb.value
  //   carbservings =
  //     -0.00608272506082725 * protein.value -
  //     0.0024330900243309 * highFat.value +
  //     0.046228710462287104 * highCarb.value
  //   fatservings =
  //     -0.0024330900243309 * protein.value +
  //     0.116301703163017 * highFat.value -
  //     0.0097323600973236 * highCarb.value
  // }

  proteinservings = result.protein
  fatservings =  result.fat
  carbservings = result.carbs
  //veggieservings = result.veggies

  proteinservings = Math.round(proteinservings)
  carbservings = Math.round(carbservings)
  fatservings = Math.round(fatservings)

  let macros = calculateResult(proteinservings, fatservings, carbservings, veggieservings, proteinperservingprotein, proteinperservingcarbs, proteinperservingfat, proteinperservingveggies, fatperservingprotein, fatperservingcarbs, fatperservingfat, fatsperservingveggies, carbsperservingprotein, carbsperservingcarbs, carbsperservingfat, carbsperservingveggies, kcalperservingprotein, kcalperservingcarbs, kcalperservingfat, kcalperservingveggies)

  while (macros.totalcalories > teehigh.value){
    carbservings--
    macros = calculateResult(proteinservings, fatservings, carbservings, veggieservings, proteinperservingprotein, proteinperservingcarbs, proteinperservingfat, proteinperservingveggies, fatperservingprotein, fatperservingcarbs, fatperservingfat, fatsperservingveggies, carbsperservingprotein, carbsperservingcarbs, carbsperservingfat, carbsperservingveggies, kcalperservingprotein, kcalperservingcarbs, kcalperservingfat, kcalperservingveggies)
  }

  // totalprotein =
  //   proteinservings * proteinperservingprotein.value + carbservings * proteinperservingcarbs + fatservings * proteinperservingfat + veggieservings * proteinperservingveggies
  // totalcarbs =
  //   proteinservings * carbsperservingprotein + carbservings * carbsperservingcarbs + fatservings * carbsperservingfat + veggieservings * carbsperservingveggies
  // totalfats = 
  //   proteinservings * fatperservingprotein + carbservings * fatperservingcarbs + fatservings * fatperservingfat + veggieservings * fatsperservingveggies
  // totalcalories =  proteinservings * kcalperservingprotein + carbservings * kcalperservingcarbs + fatservings * kcalperservingfat + veggieservings * kcalperservingveggies
  // //totalprotein * 4 + totalcarbs * 4 + totalfats * 9.0
  
}*/

function calculateResult(
  proteinservings,
  fatservings,
  carbservings,
  veggieservings,
  proteinperservingprotein,
  proteinperservingcarbs,
  proteinperservingfat,
  proteinperservingveggies,
  fatperservingprotein,
  fatperservingcarbs,
  fatperservingfat,
  fatsperservingveggies,
  carbsperservingprotein,
  carbsperservingcarbs,
  carbsperservingfat,
  carbsperservingveggies,
  kcalperservingprotein,
  kcalperservingcarbs,
  kcalperservingfat,
  kcalperservingveggies 
){
  totalprotein =
    proteinservings * proteinperservingprotein.value + carbservings * proteinperservingcarbs + fatservings * proteinperservingfat + veggieservings * proteinperservingveggies
  totalcarbs =
    proteinservings * carbsperservingprotein + carbservings * carbsperservingcarbs + fatservings * carbsperservingfat + veggieservings * carbsperservingveggies
  totalfats = 
    proteinservings * fatperservingprotein + carbservings * fatperservingcarbs + fatservings * fatperservingfat + veggieservings * fatsperservingveggies
  totalcalories =  proteinservings * kcalperservingprotein + carbservings * kcalperservingcarbs + fatservings * kcalperservingfat + veggieservings * kcalperservingveggies
  return {totalprotein, totalcarbs, totalfats, totalcalories}
}


function nextStep() {
  step.value++
  console.log('step:' + step.value.toString())
  if (step.value == 8) calculateTEE()
  if (step.value == 10) 
  {
    //calculateHandSizes(); 
    calculateNew();
  }
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

/*function solveEquations(pp, pf, pc, fp, ff, fc, cp, cf, cc, PR, FR, TEE) {
  // Coefficients of the system of equations
  let coefficients = [
    [pp, pf, pc],
    [fp, ff, fc],
    [cp, cf, cc]
  ]

  // Right-hand side of the equations
  const CR = (TEE - (PR * 4 + FR * 9)) / 4
  let rhs = [PR, FR, CR]

  // Gaussian elimination
  for (let i = 0; i < 3; i++) {
    // Pivot for column
    let pivot = coefficients[i][i]

    // Divide every element of current row by pivot
    for (let j = i; j < 3; j++) {
      coefficients[i][j] /= pivot
    }
    rhs[i] /= pivot

    // Eliminate all other entries in current column
    for (let k = 0; k < 3; k++) {
      if (k !== i) {
        let factor = coefficients[k][i]
        for (let j = i; j < 3; j++) {
          coefficients[k][j] -= factor * coefficients[i][j]
        }
        rhs[k] -= factor * rhs[i]
      }
    }
  }

  // Return values of x, y, z
  return { protein: Math.ceil(rhs[0]), fat: Math.ceil(rhs[1]), carbs: Math.ceil(rhs[2]), veggies: Math.ceil(rhs[3]) }
}
*/


function solveNutritionalTargets(proteinTarget, fatTarget, proteinRich, fatRich) {
    // Destructure the inputs for easier use
    const { protein: proteinInProteinRich, fat: fatInProteinRich } = proteinRich;
    const { protein: proteinInFatRich, fat: fatInFatRich } = fatRich;

    // Coefficients for the equations
    // Equation 1: proteinInProteinRich * x + proteinInFatRich * y = proteinTarget
    // Equation 2: fatInProteinRich * x + fatInFatRich * y = fatTarget

    const a1 = proteinInProteinRich;
    const b1 = proteinInFatRich;
    const c1 = proteinTarget;

    const a2 = fatInProteinRich;
    const b2 = fatInFatRich;
    const c2 = fatTarget;

    // Solve using substitution or elimination
    // We calculate the determinant to ensure the system has a unique solution
    const determinant = a1 * b2 - a2 * b1;

    if (determinant === 0) {
        throw new Error("The equation system has no unique solution.");
    }

    // Solve for x and y
    const x = (c1 * b2 - c2 * b1) / determinant; // Number of servings of protein-rich food
    const y = (a1 * c2 - a2 * c1) / determinant; // Number of servings of fat-rich food

    // Return the result as an object
    return {
        proteinRichServings: x,
        fatRichServings: y,
    };
}


</script>

<template>
  <div class="container align-middle">
    <div class="text-center">
      <div class="MyLogoDiv">
        <img
          id="responsive-image"
          src="https://lukaspezenka.files.wordpress.com/2018/02/cropped-header-large-bg.png"
        />
      </div>
    </div>

    <div class="container text-center pt-3 pb-3">
      <h2 v-if="step === 1">Wie heißt Du?</h2>
      <h2 v-if="step === 2">Wie alt bist Du?</h2>
      <h2 v-if="step === 3">Wie hoch ist Dein Gewicht (in kg)?</h2>
      <h2 v-if="step === 4">Was ist Dein Geschlecht?</h2>
      <!-- <h2 v-if="step === 5">Wie hoch ist Dein Körperfettanteil (in%)?</h2> -->
      <h2 v-if="step === 5">Was ist Dein Zielgewicht (in kg)?</h2>
      <h2 v-if="step === 6">In der Woche trainierst Du durchschnittlich...?</h2>
      <h2 v-if="step === 7">Dein Aktivitätsniveau abseits vom Training ist...</h2>
      <h2 v-if="step === 8">Dein Energiebedarf</h2>
      <h2 v-if="step === 9">Deine Makronährstoffe</h2>
    </div>

    <div class="container pt-3 pb-3">
      <h3 v-if="step === 6">
        Deine wöchentliche Trainingszeit schlägt sich wesentlich auf deinen Energiebedarf nieder.
        Wie viele Stunden pro Woche trainierst Du durchschnittlich?
      </h3>
    </div>

    <div class="container">
      <form v-if="step === 1" @submit.prevent="nextStep">
        <input class="hugeInput" type="text" v-model="name" placeholder="Dein Name" /><br />
        <input class="button" type="submit" value="OK" :disabled="!name" />
      </form>

      <div v-if="step > 1">
      <form  v-if="step === 2" @submit.prevent="nextStep">
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
      <div v-if="step > 2" class="container">
        <label>Alter: {{ age }}</label>
        </div>
    </div>

    <div v-if="step > 2">
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
      <div v-if="step > 3" class="container">
        <label>Gewicht: {{ weight }}</label>
        </div>
    </div>

      <div v-if="step > 3" class="container">
        <div class="row" v-if="gender===null">
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
        <div v-else class="row">
          <img v-if="gender==='male'"
            src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/man.svg"
            width="10%"/>
          <img v-if="gender==='female'"
              src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/woman.svg"
              width="10%"/>
        </div>
      </div>

      <!-- <form v-if="step === 5" @submit.prevent="nextStep">
        <input
          class="hugeInput"
          type="number"
          v-model="bfatestimate"
          placeholder="Körperfettanteil"
        /><br />
        <input class="button" type="submit" value="OK" :disabled="!bfatestimate" />
      </form> -->

      <div v-if="step > 4">
      <form v-if="step === 5" @submit.prevent="nextStep">
        <input
          class="hugeInput"
          type="number"
          v-model="targetweight"
          placeholder="Zielgewicht"
          min="0"
        /><br />
        <input class="button" type="submit" value="OK" :disabled="!targetweight" />
      </form>
      <div v-if="step > 5" class="container">
        <label>Zielgewicht: {{ targetweight }}</label>
        </div>
      </div>

      <div class="container" v-if="step > 5">
        <div class="container" v-if="step === 6">
        <form v-if="step === 6" @submit.prevent="nextStep">
          <input
            class="hugeInput"
            type="number"
            v-model="traininghours"
            placeholder="Durchschnittliche Trainingsstunden / Woche"/><br />
          <input v-if="step === 6" class="button" type="submit" value="OK" :disabled="!traininghours" />
      </form>
      </div>
      <div class="container" v-if="step > 6">
        <label>Durchschnittliche Trainingsstunden / Woche: {{ traininghours }}</label>
      </div>
    </div>

      <form v-if="step > 6" @submit.prevent="nextStep">
        <div v-if="neat === null" class="container">
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
        <div v-else class="container justify-content-center text-center">
          <img v-if="neat===1"
                src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo1.svg"
                style="width: 20%"/>
          <img v-if="neat===2"
                src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo2.svg"
                style="width: 20%"/>
          <img v-if="neat===3"
                src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo3.svg"
                style="width: 20%"/>
        </div>
      </form>

      <!-- Summary -->
      <div v-if="step > 7" class="container">
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

        <form v-if="step === 8" @submit.prevent="nextStep">
          <input class="button" type="submit" value="OK" :disabled="!traininghours" />
        </form>
      </div>

      <!-- Macronutrient breakdown -->
      <div v-if="step > 8" class="container">
        <div class="row pt-4" style="background-color: white">
          <div class="col text-center">
            <img
              src="/protein.png"
              style="width: 100%"
            /><br />
            Protein: {{ Math.round(lowProt) }} bis {{ highProt }} Gramm / Tag
          </div>

          <div class="col text-center">
            <img src="/carbs.png" style="width: 100%" /><br />
            Kohlenhydrate: {{ Math.round(lowCarb) }} bis {{ Math.round(highCarb) }} Gramm / Tag
          </div>

          <div class="col text-center">
            <img
              src="/fats.png"
              style="width: 100%"
            /><br />
            Fette: {{ Math.round(lowFat) }} bis {{ Math.round(highFat) }} Gramm / Tag
          </div>
        </div>
        <br />
        <form v-if="step === 9" @submit.prevent="nextStep">
          <input type="submit" class="button" value="Verstanden"  />
        </form>
      </div>

      <!-- Hand portion size breakdown -->
      <div v-if="step > 9" class="container">
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
                kommen. {{ fatservings }} daumengroße Portionen dürfen es schon sein.
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
                  src="/protein.png"
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
                <img id="responsive-image" src="/carbs.png" />
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
                  src="/fats.png"
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
