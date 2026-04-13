
/* =========================
   CORE TOOL STORAGE
========================= */

let tools = JSON.parse(localStorage.getItem("tools")) || [];

/* =========================
   DEFAULT ENGINE LIBRARY
========================= */

const baseTools = {
  "remove vowels": (i) => i.replace(/[aeiou]/gi, ""),
  "reverse text": (i) => i.split("").reverse().join(""),
  "uppercase": (i) => i.toUpperCase(),
  "lowercase": (i) => i.toLowerCase(),
  "word count": (i) => i.trim().split(/\s+/).length,
  "math": (i) => { try { return math.evaluate(i); } catch { return "error"; } },
  "base64 encode": (i) => btoa(i),
  "base64 decode": (i) => atob(i),
  "slugify": (i) => i.toLowerCase().replace(/\s+/g,"-")
};

/* =========================
   AI TOOL GENERATOR (RULE BASED)
========================= */

function generateTool() {
  const input = document.getElementById("aiInput").value.toLowerCase();

  if (!input) return;

  let fn = null;

  for (let key in baseTools) {
    if (input.includes(key)) {
      fn = baseTools[key];
      break;
    }
  }

  if (!fn) {
    fn = (i) => "Custom tool created: " + input;
  }

  const tool = {
    id: Date.now(),
    name: input.toUpperCase(),
    run: fn,
    user: true
  };

  tools.push(tool);
  saveTools();
  render(tools);
}

/* =========================
   SAVE SYSTEM
========================= */

function saveTools() {
  localStorage.setItem("tools", JSON.stringify(tools));
}

/* =========================
   RENDER
========================= */

const grid = document.getElementById("grid");

function render(list) {
  grid.innerHTML = "";

  list.forEach(t => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <b>${t.name}</b>
      <button onclick="openTool(${t.id})">Open</button>
    `;

    grid.appendChild(div);
  });
}

render(tools);

/* =========================
   OPEN TOOL
========================= */

window.openTool = function(id) {
  const tool = tools.find(t => t.id === id);

  const panel = document.createElement("div");
  panel.className = "panel";

  panel.innerHTML = `
    <h3>${tool.name}</h3>
    <textarea id="input"></textarea>
    <button onclick="run(${id})">Run</button>
    <button onclick="this.parentElement.remove()">Close</button>
    <p id="out"></p>
  `;

  document.body.appendChild(panel);
};

window.run = function(id) {
  const tool = tools.find(t => t.id === id);
  const input = document.getElementById("input").value;

  document.getElementById("out").innerText =
    tool.run(input);
};

/* =========================
   SEARCH
========================= */

document.getElementById("search").addEventListener("input", e => {
  const v = e.target.value.toLowerCase();
  render(tools.filter(t => t.name.toLowerCase().includes(v)));
});

/* =========================
   USER FILTER
========================= */

window.showUserTools = function() {
  render(tools.filter(t => t.user));
};

window.showAll = function() {
  render(tools);
};

/* =========================
   INIT DEFAULT TOOLS (IF EMPTY)
========================= */

if (tools.length === 0) {
  Object.keys(baseTools).forEach(k => {
    tools.push({
      id: Date.now() + Math.random(),
      name: k.toUpperCase(),
      run: baseTools[k],
      user: false
    });
  });

  saveTools();
  render(tools);
}