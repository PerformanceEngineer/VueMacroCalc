<script setup>
import { ref, computed } from 'vue'
//import carbimage from '../assets/carbs.svg'

const step = ref(0)
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

function  convertToFloat() {
      this.floatValue = parseFloat(this.rawValue) || 0.0;
    }

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
  if (step.value == 6) calculateTEE()
  if (step.value == 7) {
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
        <img id="responsive-image" src="/PA-Schriftzug.svg" />
      </div>
      <p><b>_____</b></p>
    </div>



    <div class="container text-start pt-1">
      <h3 v-if="step === 0">Herzlich Willkommen!</h3>
      <h3 v-if="step === 1">1. Wie heißt Du?</h3>
      <h3 v-if="step === 2">2. Wie alt bist Du?</h3>
      <h3 v-if="step === 3">3. Wie viel wiegst Du?</h3>
      <h3 v-if="step === 4">4. Was ist Dein Geschlecht?</h3>
      <!-- <h2 v-if="step === 5">Wie hoch ist Dein Körperfettanteil (in%)?</h2> -->
      <h3 v-if="step === 5">5. Was ist Dein Zielgewicht?</h3>
      <h3 v-if="step === 6">6. In der Woche trainierst Du durchschnittlich...?</h3>
      <h3 v-if="step === 7">7. Dein Aktivitätsniveau abseits vom Training ist...</h3>
      <h3 v-if="step === 8">8. Dein Ergebnis</h3>
      <h3 v-if="step === 9">Deine Makronährstoffe</h3>

    </div>


    <div class="container">
      <div class="container-fluid" v-if="step === 0">
        <p>Der Transformation Calculator unterstützt Dich dabei, Deine
          Nahrungsaufnahme entsprechend Deiner Ziele zu optimieren.
          Auf Basis Deiner Angaben wird Dein täglicher Kalorienbedarf
          sowie die Verteilung der Makronährstoffe ermittelt.</p>
        <p>Deine Eingaben werden nicht gespeichert.</p>
      </div>
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
        Deine wöchentliche Trainingszeit schlägt sich wesentlich auf deinen Energiebedarf nieder und ist daher essentiell.
      </h3>
      <h3 v-if="step === 7">
        Dein Aktivitätsniveau abseits des Trainings beeinflusst Deinen täglichen Kalorienbedarf.
        </h3>
    </div>

    <div class="container">

      <div v-if="step === 0">
        <form v-if="step === 0" @submit.prevent="nextStep">
          <input class="button" type="submit" value="Weiter" />
        </form>
      </div>

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
          <input class="hugeInput" type="number" v-model.number="weight" placeholder="Gewicht in kg" min="0.0" step="0.01" /><br />
          <input class="button" type="submit" value="OK" :disabled="!weight" />
        </form>

      </div>

      <div v-if="step > 3" class="container">
        <div class="row" v-if="gender === null">
          <div class="col text-center">
            <img src="/PA-Male.svg" />
            <br />
            <button class="button" @click="setGender('male')">Mann</button>
          </div>
          <div class="col text-center">
            <img src="/PA-Female.svg" /><br />
            <button class="button" @click="setGender('female')">Frau</button>
          </div>
        </div>

      </div>

      <div v-if="step > 4">
        <form v-if="step === 5" @submit.prevent="nextStep">
          <input class="hugeInput" type="number" v-model.number="targetweight" placeholder="Zielgewicht in kg" min="0" step="0.01" /><br />
          <input class="button" type="submit" value="OK" :disabled="!targetweight" />
        </form>

      </div>

      <div class="container" v-if="step > 5">
        <div class="container" v-if="step === 6">
          <form v-if="step === 6" @submit.prevent="nextStep">
            <input class="hugeInput" type="number" v-model="traininghours"
              placeholder="Anzahl der Trainingsstunden / Woche" /><br />
            <input v-if="step === 6" class="button" type="submit" value="OK" :disabled="!traininghours" />
          </form>
        </div>

      </div>

      <form v-if="step > 6" @submit.prevent="nextStep">
        <div v-if="neat === null" class="container text-center">
          <div class="row justify-content-center">
            <div class="col-3">
              <img src="/PA-Activity-low.svg" style="width: 100%" /><br />
              <button class="button" @click="setNEAT(1)">Niedrig</button>
            </div>
            <div class="col-3">
              <img src="/PA-Activity-med.svg" style="width: 100%" /><br />
              <button class="button" @click="setNEAT(2)">Moderat</button>
            </div>
            <div class="col-3">
              <img src="/PA-Activity-high.svg" style="width: 100%" /><br />
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
              Täglicher Kalorienbedarf: <b>{{ Math.round(teelow) }} - {{ Math.round(teehigh) }} kcal </b>
            </h3>
          </div>
        </div>
        </div>
<!--
        <form v-if="step === 8" @submit.prevent="nextStep">
          <input class="button" type="submit" value="OK" :disabled="!traininghours" />
        </form>
      </div>
    -->

      <!-- Macronutrient breakdown -->
      
      <div v-if="step > 7" class="container fs-4">

        <div class="row">
          <h3>Makroverteilung pro Tag:</h3>
        </div>
        <div class="row" style="background-color: white">
          <div class="col-4 text-center">
            <img src="/PA-Protein.svg" style="width: 100%" /><br />
            Protein:<br> <b>{{ Math.round(lowProt) }} - {{ highProt }}g</b>
          </div>

          <div class="col-4 text-center">
            <img src="/PA-Carbs.svg" style="width: 100%" /><br />
            Kohlenhydrate:<br> <b>{{ Math.round(lowCarb) }} - {{ Math.round(highCarb) }}g</b>
          </div>

          <div class="col-4 text-center">
            <img src="/PA-Fat.svg" style="width: 100%" /><br />
            Fette:<br> <b>{{ Math.round(lowFat) }} - {{ Math.round(highFat) }}g</b>
          </div>
        </div>
        <br />
        <hr>
        <form v-if="step === 9" @submit.prevent="nextStep">
          <input type="submit" class="button" value="Verstanden" />
        </form>
      </div>
    

      <!-- Hand portion size breakdown -->
      <div v-if="step > 7" class="container fs-4">
        <div class="row">
          <b>
          An diesen Portionsangaben kannst Du Dich orientieren,
um im Schnitt {{totalcalories}} kcal / Tag zu Dir zu nehmen:</b>
        </div>
        <div class="row pt-4">
          <div class="col text-center">
            <div class="row">
              <div class="col text-center">
                <img src="/PA-Handteller.svg" />
              </div>
            </div>
            <div class="row">
              <div class="col text-center">
                 <b>{{ proteinservings }}</b><br> Handteller<br> Protein<br>pro Tag<br>=<br><b>{{ totalprotein }}g</b><br> Protein.
              </div>
            </div>
          </div>

          <div class="col text-center">
            <div class="row">
              <div class="col text-center">
                <img src="/PA-Handvoll.svg" />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b>{{ carbservings }}</b><br> handvoll Kohlenhydrate<br>pro Tag<br>=<br><b>{{ totalcarbs }}g</b><br> Kohlenhydrate.
              </div>
            </div>
          </div>

          <div class="col text-center">
            <div class="row">
              <div class="col">
                <img src="/PA-Daumen.svg" />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b>{{ fatservings }}</b><br>Daumen<br>gesunde Fette<br>pro Tag<br>=<br><b>{{ totalfats }}g</b><br>Fett.
              </div>
            </div>
          </div>

          <div class="col text-center">
            <div class="row">
              <div class="col">
                <img src="/PA-Faust.svg" />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b>{{ veggieservings }}</b><br>Gemüse<br>pro Tag<br>
              </div>
            </div>
          </div>
        </div>
<!--
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
        </div>-->
      </div>

      <div class="summary-container text-center pt-3 pb-3" v-if="step > 10">
        <div class="summary-title">Zusammenfassung</div>

        <div class="summary-item" v-if="step > 1">
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
          <span class="summary-label">Aktivität:</span>
          <span class="summary-value">
            <img v-if="neat === 1" src="/PA-Activity-low.svg" style="width: 20%" />
            <img v-if="neat === 2" src="/PA-Activity-med.svg" style="width: 20%" />
            <img v-if="neat === 3" src="/PA-Activity-high.svg" style="width: 20%" />
          </span>
        </div>
      </div>

    </div>
  </div>
  <div class="container text-center fs-2">
    <p> Nähere Informationen zu Ernährung und Training
      findest Du im <b>Transformation Handbook</b>.</p>
    <hr>
  </div>
  <div class="row">
      <div class="footer text-center justify-content-center">
        <p><b>Datenschutz</b></p>
        <p>Alle von dir angegebenen Informationen dienen ausschließlich der Berechnung der für Dich empfohlenen
          Nährstoffverteilung. Diese wird Dir am Ende in der Zusammenfassung angezeigt.
          Deine Eingaben werden nicht gespeichert.
          Der Transformation Calculator ist Teil des <b>Transformation Handbooks</b>.</p>
        <p>© 2025 Lukas Pezenka & Marc-André Yu</p>
        <p>All rights reserved.</p>
      </div>
    </div>
</template>
