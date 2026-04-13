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