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

let display = document.getElementById("display");

/* ======================
   STATE
====================== */
let shift = false;
let isDeg = true;

/* ======================
   DISPLAY SAFE UPDATE
====================== */
function updateDisplay(value) {
  display.value = value;

  // prevent overflow (auto scroll)
  display.scrollLeft = display.scrollWidth;
}

/* ======================
   BASIC INPUT
====================== */
function append(val) {
  updateDisplay(display.value + val);
}

function clearDisplay() {
  updateDisplay("");
}

function deleteLast() {
  updateDisplay(display.value.slice(0, -1));
}

/* ======================
   SAFE CALCULATE (NO eval)
====================== */
function calculate() {
  try {
    let expr = display.value;

    // convert π
    expr = expr.replace(/π/g, Math.PI);

    let result = math.evaluate(expr);
    updateDisplay(result);
  } catch {
    updateDisplay("Error");
  }
}

/* ======================
   SHIFT MODE
====================== */
function toggleShift() {
  shift = !shift;
  document.getElementById("shiftBtn").style.background =
    shift ? "orange" : "#2e2e2e";
}

/* ======================
   DEG / RAD
====================== */
function toggleAngle() {
  isDeg = !isDeg;
  document.getElementById("angleBtn").innerText = isDeg ? "DEG" : "RAD";
}

/* ======================
   TRIG FUNCTIONS
====================== */
function sin() {
  let v = Number(display.value);
  updateDisplay(
    Math.sin(isDeg ? v * Math.PI / 180 : v)
  );
}

function cos() {
  let v = Number(display.value);
  updateDisplay(
    Math.cos(isDeg ? v * Math.PI / 180 : v)
  );
}

function tan() {
  let v = Number(display.value);
  updateDisplay(
    Math.tan(isDeg ? v * Math.PI / 180 : v)
  );
}

/* ======================
   MATH FUNCTIONS
====================== */
function sqrt() {
  updateDisplay(Math.sqrt(Number(display.value)));
}

function square() {
  let v = Number(display.value);
  updateDisplay(v * v);
}

function percent() {
  updateDisplay(Number(display.value) / 100);
}

function reciprocal() {
  updateDisplay(1 / Number(display.value));
}

/* ======================
   SHIFT FUNCTIONS (inverse trig)
====================== */
function handleFunc(func) {
  let v = Number(display.value);

  if (shift) {
    if (func === "sin") updateDisplay(Math.asin(v));
    if (func === "cos") updateDisplay(Math.acos(v));
    if (func === "tan") updateDisplay(Math.atan(v));
    shift = false;
    document.getElementById("shiftBtn").style.background = "#2e2e2e";
    return;
  }

  if (func === "sin") sin();
  if (func === "cos") cos();
  if (func === "tan") tan();
}

/* ======================
   LOGS
====================== */
function log() {
  updateDisplay(Math.log10(Number(display.value)));
}

function ln() {
  updateDisplay(Math.log(Number(display.value)));
}

/* ======================
   FRACTION
====================== */
function toFraction() {
  try {
    let f = math.fraction(display.value);
    updateDisplay(`${f.n}/${f.d}`);
  } catch {
    updateDisplay("Error");
  }
}

/* ======================
   SCI NOTATION
====================== */
function toScientific() {
  let num = Number(display.value);
  updateDisplay(num.toExponential(5));
}

/* ======================
   KEYBOARD SUPPORT
====================== */
document.addEventListener("keydown", function (e) {
  if (!isNaN(e.key) || "+-*/().".includes(e.key)) {
    append(e.key);
  }

  if (e.key === "Enter") calculate();
  if (e.key === "Backspace") deleteLast();
  if (e.key === "Escape") clearDisplay();
});

const searchBar = document.getElementById("searchBar");

const toolsMap = [
  { id: "calc", keywords: ["calculator", "calc", "math"] },
  { id: "sciCalc", keywords: ["scientific", "science calc", "casio", "fx"] },
  { id: "image", keywords: ["image", "photo", "resize", "compress", "blur"] },
  { id: "text", keywords: ["text", "word", "uppercase", "lowercase"] },
  { id: "qr", keywords: ["qr", "qr code", "barcode"] }
];

let lastMatch = null;

/* ======================
   FUZZY SEARCH (typos allowed)
====================== */
function similarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();

  let matches = 0;
  for (let char of a) {
    if (b.includes(char)) matches++;
  }

  return matches / Math.max(a.length, b.length);
}

/* ======================
   SEARCH ENGINE
====================== */
searchBar.addEventListener("input", function () {
  let value = this.value.toLowerCase();

  if (value === "") {
    document.querySelectorAll(".tool").forEach(t => t.style.display = "block");
    lastMatch = null;
    return;
  }

  let bestMatch = null;
  let bestScore = 0;

  for (let tool of toolsMap) {
    for (let keyword of tool.keywords) {
      let score =
        keyword.includes(value)
          ? 1
          : similarity(value, keyword);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = tool.id;
      }
    }
  }

  // show best match only
  document.querySelectorAll(".tool").forEach(t => t.style.display = "none");

  if (bestMatch) {
    document.getElementById(bestMatch).style.display = "block";
    lastMatch = bestMatch;
  }
});

searchBar.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && lastMatch) {
    openTool(lastMatch);
  }
});

function openTool(id) {
  document.querySelectorAll(".tool").forEach(t => t.style.display = "none");

  let tool = document.getElementById(id);
  if (tool) {
    tool.style.display = "block";
    tool.scrollIntoView({ behavior: "smooth" });
  }
}

const textInput = document.getElementById("textInput");
const textResult = document.getElementById("textResult");

/* ======================
   LIVE STATS
====================== */
textInput.addEventListener("input", updateStats);

function updateStats() {
  let text = textInput.value;

  let words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  let chars = text.length;

  textResult.innerText = `Words: ${words} | Characters: ${chars}`;
}

/* ======================
   FONT CHANGE
====================== */
function changeFont() {
  let font = document.getElementById("fontSelect").value;
  textInput.style.fontFamily = font;
}

/* ======================
   BASIC TEXT OPS
====================== */
function toUpper() {
  textInput.value = textInput.value.toUpperCase();
}

function toLower() {
  textInput.value = textInput.value.toLowerCase();
}

function titleCase() {
  textInput.value = textInput.value
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

function reverseText() {
  textInput.value = textInput.value.split("").reverse().join("");
}

function cleanSpaces() {
  textInput.value = textInput.value.replace(/\s+/g, " ").trim();
}

/* ======================
   FIND / REPLACE
====================== */
function findReplace() {
  let find = document.getElementById("findInput").value;
  let replace = document.getElementById("replaceInput").value;

  let regex = new RegExp(find, "g");
  textInput.value = textInput.value.replace(regex, replace);
}

/* ======================
   HIGHLIGHT
====================== */
function highlight() {
  let word = document.getElementById("findInput").value;
  if (!word) return;

  textInput.value = textInput.value.replace(
    new RegExp(word, "g"),
    match => `[[${match}]]`
  );
}

/* ======================
   EXPORT
====================== */
function exportText() {
  let blob = new Blob([textInput.value], { type: "text/plain" });
  let link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "text.txt";
  link.click();
}

/* ======================
   REWRITE (simple AI)
====================== */
function rewriteText() {
  textInput.value = textInput.value
    .replace(/\bi am\b/gi, "I'm")
    .replace(/\byou are\b/gi, "you're")
    .replace(/\bis not\b/gi, "isn't")
    .replace(/\bare not\b/gi, "aren't");
}

/* ======================
   BOLD / ITALIC
====================== */
function wrap(before, after) {
  let start = textInput.selectionStart;
  let end = textInput.selectionEnd;

  let selected = textInput.value.substring(start, end);
  let beforeText = textInput.value.substring(0, start);
  let afterText = textInput.value.substring(end);

  textInput.value = beforeText + before + selected + after + afterText;
}

function makeBold() {
  wrap("**", "**");
}

function makeItalic() {
  wrap("*", "*");
}