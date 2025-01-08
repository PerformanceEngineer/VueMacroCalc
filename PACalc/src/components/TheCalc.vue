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
//const protein = computed(() => weight.value * 2.0)
//const protein = computed(() => lbm.value * 2.0)

let proteinservings = 0
let fatservings = 0
let carbservings = 0
let totalcalories = 0
let totalprotein = 0
let totalfats = 0
let totalcarbs = 0
let veggieservings = 0


function calculateNew() {
  // Example usage
  const proteinTarget = lowProt.value * 0.75;
  const fatTarget = lowFat.value;

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
    //console.log('************');
    const result = solveNutritionalTargets(proteinTarget, fatTarget, proteinRich, fatRich);
    result.fatRichServings = Math.ceil(result.fatRichServings);
    result.proteinRichServings = Math.ceil(result.proteinRichServings);

    let kcalfp = result.proteinRichServings * proteinRich.kcal + result.fatRichServings * fatRich.kcal;
    veggieservings = 7.0;
    let kcalveggies = veggieservings * veggies.kcal;
    let kcalfpv = kcalfp + kcalveggies;
    let remainingcals = teehigh.value - kcalfpv;
    carbservings = remainingcals / carbRich.kcal;
    carbservings = Math.round(carbservings) - 1;

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
    veggieservings = 5.0;
    let macros = calculateResult(proteinservings, fatservings, carbservings, veggieservings, proteinperservingprotein, proteinperservingcarbs, proteinperservingfat, proteinperservingveggies, fatperservingprotein, fatperservingcarbs, fatperservingfat, fatsperservingveggies, carbsperservingprotein, carbsperservingcarbs, carbsperservingfat, carbsperservingveggies, kcalperservingprotein, kcalperservingcarbs, kcalperservingfat, kcalperservingveggies)

    console.log(macros.totalcalories);


  } catch (error) {
    console.error(error.message);
  }


}

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
) {
  totalprotein =
    proteinservings * proteinperservingprotein.value + carbservings * proteinperservingcarbs + fatservings * proteinperservingfat + veggieservings * proteinperservingveggies
  totalcarbs =
    proteinservings * carbsperservingprotein + carbservings * carbsperservingcarbs + fatservings * carbsperservingfat + veggieservings * carbsperservingveggies
  totalfats =
    proteinservings * fatperservingprotein + carbservings * fatperservingcarbs + fatservings * fatperservingfat + veggieservings * fatsperservingveggies
  totalcalories = proteinservings * kcalperservingprotein + carbservings * kcalperservingcarbs + fatservings * kcalperservingfat + veggieservings * kcalperservingveggies
  return { totalprotein, totalcarbs, totalfats, totalcalories }
}


function nextStep() {
  step.value++
  console.log('step:' + step.value.toString())
  if (step.value == 8) calculateTEE()
  if (step.value == 10) {
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
        <img id="responsive-image" src="/pa-logo.png" />
      </div>
    </div>

    <div class="summary-container text-center pt-3 pb-3" v-if="step>1">
      <div class="summary-title">Zusammenfassung</div>
      
      <div class="summary-item"  v-if="step > 1">
        <span class="summary-label">Name:</span>
        <span class="summary-value">{{ name }}</span>
      </div>

        <div v-if="step > 2" class="summary-item">
          <span class="summary-label">Alter:</span>
          <span class="summary-value">Alter: {{ age }}</span>
        </div>

        <div v-if="step > 3" class="summary-item">
          <span class="summary-label">Gewicht:</span>
          <span class="summary-value">Gewicht: {{ weight }}</span>
        </div>

        <div v-if="gender != null" class="summary-item">
          <span class="summary-label">Geschlecht:</span>
          <span class="summary-value" v-if="gender === 'male'">Männlich</span>
          <span class="summary-value" v-if="gender === 'female'">Weiblich</span>
        </div>

        <div v-if="step > 5" class="summary-item">
          <span class="summary-label">Zielgewicht:</span>
          <span class="summary-value">{{ targetweight }}</span>
        </div>

        <div class="summary-item" v-if="step > 6">
          <span class="summary-label">Wöchentliche Trainingsstunden:</span>
          <span class="summary-value">{{ traininghours }}</span>
        </div>

        <div v-if="neat != null" class="container justify-content-center text-center">
          <img v-if="neat === 1"
            src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo1.svg"
            style="width: 20%" />
          <img v-if="neat === 2"
            src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo2.svg"
            style="width: 20%" />
          <img v-if="neat === 3"
            src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo3.svg"
            style="width: 20%" />
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

    <div class="container">
      <h3 v-if="step === 1">
        Keine Sorge, wir speichern keine Daten. Die Infomation wird nur für die Zusammenfassung verwendet.
      </h3>
      <h3 v-if="step === 2">
        Wir sagen es nicht weiter. Versprochen.
      </h3>
      <h3 v-if="step === 3">
        Diese Information hilft uns, venünftige Ziele für Deine Eiweiß- und Fettaufnahme vorzuschlagen.
      </h3>
      <h3 v-if="step === 6">
        Deine wöchentliche Trainingszeit schlägt sich wesentlich auf deinen Energiebedarf nieder.
        Wie viele Stunden pro Woche trainierst Du durchschnittlich?
      </h3>
    </div>

    <div class="container">
      <div v-if="step > 0">
        <form v-if="step === 1" @submit.prevent="nextStep">
          <input class="hugeInput" type="text" v-model="name" placeholder="Dein Name" /><br />
          <input class="button" type="submit" value="OK" :disabled="!name" />
        </form>
      </div>

      <div v-if="step > 1">
        <form v-if="step === 2" @submit.prevent="nextStep">
          <input class="hugeInput" type="number" v-model="age" placeholder="Alter" min="18" max="120" /><br />
          <input class="button" type="submit" value="OK" :disabled="!age" />
        </form>

      </div>

      <div v-if="step > 2">
        <form v-if="step === 3" @submit.prevent="nextStep">
          <input class="hugeInput" type="number" v-model="weight" placeholder="Gewicht" min="0" /><br />
          <input class="button" type="submit" value="OK" :disabled="!weight" />
        </form>

      </div>

      <div v-if="step > 3" class="container">
        <div class="row" v-if="gender === null">
          <div class="col text-center">
            <img src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/man.svg" />
            <br />
            <button class="button" @click="setGender('male')">Mann</button>
          </div>
          <div class="col text-center">
            <img src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/woman.svg" /><br />
            <button class="button" @click="setGender('female')">Frau</button>
          </div>
        </div>

      </div>

      <div v-if="step > 4">
        <form v-if="step === 5" @submit.prevent="nextStep">
          <input class="hugeInput" type="number" v-model="targetweight" placeholder="Zielgewicht" min="0" /><br />
          <input class="button" type="submit" value="OK" :disabled="!targetweight" />
        </form>

      </div>

      <div class="container" v-if="step > 5">
        <div class="container" v-if="step === 6">
          <form v-if="step === 6" @submit.prevent="nextStep">
            <input class="hugeInput" type="number" v-model="traininghours"
              placeholder="Durchschnittliche Trainingsstunden / Woche" /><br />
            <input v-if="step === 6" class="button" type="submit" value="OK" :disabled="!traininghours" />
          </form>
        </div>

      </div>

      <form v-if="step > 6" @submit.prevent="nextStep">
        <div v-if="neat === null" class="container">
          <div class="row">
            <div class="col-3">
              <img src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo1.svg"
                style="width: 100%" /><br />
              <button class="button" @click="setNEAT(1)">Niedrig</button>
            </div>
            <div class="col-3">
              <img src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo2.svg"
                style="width: 100%" /><br />
              <button class="button" @click="setNEAT(2)">Moderat</button>
            </div>
            <div class="col-3">
              <img src="https://www.precisionnutrition.com/hand_portion_calculator/assets/images/speedo2.svg"
                style="width: 100%" /><br />
              <button class="button" @click="setNEAT(3)">Hoch</button>
            </div>
          </div>
        </div>

      </form>

      <!-- Summary -->
      <div v-if="step > 7" class="container">
        <div class="row">
          <!--<div class="col">Zielgewicht: {{ targetweight }}</div>
          <div class="col">Training: {{ traininghours }} Stunden / Woche</div>-->
          <div class="col-12">
            <h3>
            Kalorienbedarf: {{ Math.round(teelow) }} bis {{ Math.round(teehigh) }} / Tag
            </h3>
          </div>
        </div>

        <form v-if="step === 8" @submit.prevent="nextStep">
          <input class="button" type="submit" value="OK" :disabled="!traininghours" />
        </form>
      </div>

      <!-- Macronutrient breakdown -->
      <div v-if="step > 8" class="container">
        <div class="row" style="background-color: white">
          <div class="col-4 text-center">
            <img src="/PA-Protein.svg" style="width: 100%" /><br />
            Protein: {{ Math.round(lowProt) }} bis {{ highProt }} Gramm / Tag
          </div>

          <div class="col-4 text-center">
            <img src="/PA-Carbs.svg" style="width: 100%" /><br />
            Kohlenhydrate: {{ Math.round(lowCarb) }} bis {{ Math.round(highCarb) }} Gramm / Tag
          </div>

          <div class="col-4 text-center">
            <img src="/PA-Fat.svg" style="width: 100%" /><br />
            Fette: {{ Math.round(lowFat) }} bis {{ Math.round(highFat) }} Gramm / Tag
          </div>
        </div>
        <br />
        <form v-if="step === 9" @submit.prevent="nextStep">
          <input type="submit" class="button" value="Verstanden" />
        </form>
      </div>

      <!-- Hand portion size breakdown -->
      <div v-if="step > 9" class="container">
        <div class="row pt-4">
          <div class="col text-center">
            <div class="row">
              <div class="col text-center">
                <img src="/PA-Handteller.svg" />
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
                <img src="/PA-Handvoll.svg" />
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
                <img src="/PA-Daumen.svg" />
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
                <img src="/PA-Faust.svg" />
              </div>
            </div>
            <div class="row">
              <div class="col">
                Eat the Rainbow! Runde Deine Ernährung ab mit zumindest {{ veggieservings }} faustgroßen
                Portionen Gemüse. Hier gilt - mehr ist besser!
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
                <img id="responsive-image" src="/PA-Protein.svg" />
              </div>
            </div>
            <div class="row">
              <div class="col">{{ totalprotein }} Gramm Eiweiß</div>
            </div>
          </div>

          <div class="col text center">
            <div class="row">
              <div class="col text-center">
                <img id="responsive-image" src="/PA-Carbs.svg" />
              </div>
            </div>
            <div class="row">
              <div class="col text-center">{{ totalcarbs }} Gramm Kohlenhydrate</div>
            </div>
          </div>

          <div class="col text center">
            <div class="row">
              <div class="col text-center">
                <img id="responsive-image" src="/PA-Fat.svg" />
              </div>
            </div>
            <div class="row">
              <div class="col text-center">{{ totalfats }} Gramm Fette</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="step > 9" class="container">
        <h2>Beispielhafte Lebensmittel</h2>
        <img src="/Sample-Macros.png" style="width:100%"/>
      </div>
    </div>
  </div>
</template>
