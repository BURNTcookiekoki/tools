function showTool(tool) {
  document.querySelectorAll('.tool').forEach(t => t.style.display = 'none');
  document.getElementById(tool).style.display = 'block';
}

/* ======================
   CALCULATOR
====================== */
function add() {
  let n1 = Number(num1.value);
  let n2 = Number(num2.value);
  result.innerText = n1 + n2;
}

function percent() {
  let n1 = Number(num1.value);
  let n2 = Number(num2.value);
  result.innerText = (n1 / 100) * n2;
}

function sqrt() {
  let n1 = Number(num1.value);
  result.innerText = Math.sqrt(n1);
}

/* ======================
   IMAGE TOOLS
====================== */
const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();

upload.addEventListener('change', function() {
  const file = upload.files[0];
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  img.src = URL.createObjectURL(file);
});

function resizeImage() {
  canvas.width = img.width / 2;
  canvas.height = img.height / 2;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function blurImage() {
  ctx.filter = "blur(5px)";
  ctx.drawImage(img, 0, 0);
  ctx.filter = "none";
}

function compressImage() {
  let dataURL = canvas.toDataURL("image/jpeg", 0.5);
  let link = document.createElement('a');
  link.href = dataURL;
  link.download = "compressed.jpg";
  link.click();
}

/* ======================
   TEXT TOOLS
====================== */
function wordCount() {
  let text = textInput.value.trim();
  let words = text.split(/\s+/).filter(w => w.length > 0);
  textResult.innerText = "Words: " + words.length;
}

function toUpper() {
  textInput.value = textInput.value.toUpperCase();
}

function toLower() {
  textInput.value = textInput.value.toLowerCase();
}

/* ======================
   QR CODE
====================== */
function generateQR() {
  let data = qrInput.value;
  qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(data);
}

/* ======================
   SCIENTIFIC CALCULATOR
====================== */

let display = document.getElementById("display");

let shift = false;
let isDeg = true;
let history = [];
let historyIndex = -1;

/* ======================
   BASIC INPUT
====================== */
function append(val) {
  display.value += val;
}

function clearDisplay() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

/* ======================
   SAFE CALCULATE (NO EVAL)
====================== */
function calculate() {
  try {
    let expr = display.value;

    // Handle degrees
    if (isDeg) {
      expr = expr.replace(/sin\((.*?)\)/g, (_, v) => `sin(${v} deg)`);
      expr = expr.replace(/cos\((.*?)\)/g, (_, v) => `cos(${v} deg)`);
      expr = expr.replace(/tan\((.*?)\)/g, (_, v) => `tan(${v} deg)`);
    }

    let result = math.evaluate(expr);

    display.value = result;

    history.push(expr + " = " + result);
    historyIndex = history.length;

  } catch {
    display.value = "Error";
  }
}

/* ======================
   SHIFT MODE
====================== */
function toggleShift() {
  shift = !shift;
  document.getElementById("shiftBtn").style.background = shift ? "orange" : "";
}

/* ======================
   DEG / RAD
====================== */
function toggleAngle() {
  isDeg = !isDeg;
  document.getElementById("angleBtn").innerText = isDeg ? "DEG" : "RAD";
}

/* ======================
   FUNCTIONS (SHIFT SUPPORT)
====================== */
function handleFunc(func) {
  let val = display.value || "0";

  try {
    let result;

    if (shift) {
      // inverse trig
      if (func === "sin") result = math.asin(val);
      else if (func === "cos") result = math.acos(val);
      else if (func === "tan") result = math.atan(val);
      else if (func === "log") result = math.log10(val);
      else result = val;
    } else {
      if (func === "sin") result = math.sin(isDeg ? val + " deg" : val);
      else if (func === "cos") result = math.cos(isDeg ? val + " deg" : val);
      else if (func === "tan") result = math.tan(isDeg ? val + " deg" : val);
      else if (func === "log") result = math.log10(val);
      else if (func === "sqrt") result = math.sqrt(val);
      else if (func === "square") result = math.pow(val, 2);
      else if (func === "power") {
        append("^");
        return;
      }
      else if (func === "reciprocal") result = 1 / val;
    }

    display.value = result;
    shift = false;

  } catch {
    display.value = "Error";
  }
}

/* ======================
   PERCENT
====================== */
function percent() {
  display.value = math.evaluate(display.value) / 100;
}

/* ======================
   FRACTION + SCI NOTATION
====================== */
function toFraction() {
  try {
    let frac = math.fraction(display.value);
    display.value = frac.n + "/" + frac.d;
  } catch {
    display.value = "Error";
  }
}

function toScientific() {
  try {
    let num = Number(display.value);
    display.value = num.toExponential(5);
  } catch {
    display.value = "Error";
  }
}

/* ======================
   HISTORY
====================== */
function historyUp() {
  if (historyIndex > 0) {
    historyIndex--;
    display.value = history[historyIndex];
  }
}

function historyDown() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    display.value = history[historyIndex];
  }
}

/* ======================
   KEYBOARD SUPPORT
====================== */
document.addEventListener("keydown", function(e) {
  if (!isNaN(e.key) || "+-*/().".includes(e.key)) {
    append(e.key);
  }

  if (e.key === "Enter") calculate();
  if (e.key === "Backspace") deleteLast();
  if (e.key === "Escape") clearDisplay();
});