/* ======================
   TOOL SYSTEM (2000 TOOLS)
====================== */

const tools = [];
let idCounter = 0;

const categories = [
  "Text", "Image", "Video", "Audio", "Dev",
  "Converter", "Calculator", "SEO", "Social",
  "File", "Security", "Productivity", "Fun"
];

function addTool(name, category, keywords = []) {
  tools.push({
    id: "tool_" + idCounter++,
    name,
    category,
    keywords
  });
}

/* generate 2000 tools */
for (let i = 0; i < 2000; i++) {
  let cat = categories[i % categories.length];

  addTool(
    `${cat} Tool ${i + 1}`,
    cat.toLowerCase(),
    [cat.toLowerCase(), "tool", "generator", i.toString()]
  );
}

/* build UI buttons (first load only) */
function buildToolButtons() {
  const container = document.getElementById("toolButtons");
  if (!container) return;

  container.innerHTML = "";

  tools.slice(0, 30).forEach(tool => {
    let btn = document.createElement("button");
    btn.innerText = tool.name;
    btn.onclick = () => showToolPanel(tool);
    container.appendChild(btn);
  });
}

buildToolButtons();

function showToolPanel(tool) {
  document.querySelectorAll(".tool").forEach(t => t.style.display = "none");

  let panel = document.createElement("div");
  panel.className = "tool";
  panel.innerHTML = `
    <h2>${tool.name}</h2>
    <p>Category: ${tool.category}</p>
    <p>Generated tool placeholder (expand logic here).</p>
  `;

  document.body.appendChild(panel);
}

/* ======================
   SHOW / HIDE TOOLS
====================== */

function showTool(tool) {
  document.querySelectorAll('.tool').forEach(t => t.style.display = 'none');
  const el = document.getElementById(tool);
  if (el) el.style.display = 'block';
}

/* ======================
   IMAGE TOOLS
====================== */

const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas?.getContext('2d');
let img = new Image();

if (upload) {
  upload.addEventListener('change', function () {
    const file = upload.files[0];
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = URL.createObjectURL(file);
  });
}

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
   QR CODE
====================== */

function generateQR() {
  let data = document.getElementById("qrInput").value;
  document.getElementById("qrImg").src =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
    encodeURIComponent(data);
}

/* ======================
   TEXT EDITOR
====================== */

const editor = document.getElementById("editor");

function execCmd(command) {
  document.execCommand(command, false, null);
}

function changeFont(font) {
  document.execCommand("fontName", false, font);
}

function clearDoc() {
  if (editor) editor.innerHTML = "";
}

function exportDoc() {
  let text = editor.innerText;
  let blob = new Blob([text], { type: "text/plain" });

  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "document.txt";
  link.click();
}

if (editor) {
  editor.addEventListener("input", () => {
    let text = editor.innerText;

    let words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    let chars = text.length;

    document.getElementById("docStats").innerText =
      `Words: ${words} | Characters: ${chars}`;
  });
}

/* ======================
   CALCULATOR (mathjs)
====================== */

let display = document.getElementById("display");
let isDeg = true;
let shift = false;

function updateDisplay(val) {
  display.value = val;
}

function append(val) {
  updateDisplay(display.value + val);
}

function clearDisplay() {
  updateDisplay("");
}

function deleteLast() {
  updateDisplay(display.value.slice(0, -1));
}

function calculate() {
  try {
    let expr = display.value.replace(/π/g, Math.PI);
    updateDisplay(math.evaluate(expr));
  } catch {
    updateDisplay("Error");
  }
}

/* trig */
function sin() {
  let v = Number(display.value);
  updateDisplay(Math.sin(isDeg ? v * Math.PI / 180 : v));
}

function cos() {
  let v = Number(display.value);
  updateDisplay(Math.cos(isDeg ? v * Math.PI / 180 : v));
}

function tan() {
  let v = Number(display.value);
  updateDisplay(Math.tan(isDeg ? v * Math.PI / 180 : v));
}

function handleFunc(func) {
  let v = Number(display.value);

  if (func === "sin") sin();
  if (func === "cos") cos();
  if (func === "tan") tan();
}

function toggleAngle() {
  isDeg = !isDeg;
  document.getElementById("angleBtn").innerText = isDeg ? "DEG" : "RAD";
}

/* ======================
   SEARCH (2000 TOOLS)
====================== */

const searchBar = document.getElementById("searchBar");

searchBar?.addEventListener("input", function () {
  let value = this.value.toLowerCase();

  const container = document.getElementById("toolButtons");
  if (!container) return;

  container.innerHTML = "";

  let matches = tools.filter(t =>
    t.name.toLowerCase().includes(value) ||
    t.category.includes(value)
  );

  matches.slice(0, 50).forEach(tool => {
    let btn = document.createElement("button");
    btn.innerText = tool.name;
    btn.onclick = () => showToolPanel(tool);
    container.appendChild(btn);
  });
});