import { shiftString } from "../lib/caesar.js";

const params = new URLSearchParams(location.search);
const text = params.get("text") || "";
const truncated = params.get("truncated") === "1";

document.getElementById("input-len").textContent = text.length;
document.getElementById("input-text").textContent = text;
if (truncated) {
  document.getElementById("truncated-note").hidden = false;
}

const tbody = document.querySelector("#results tbody");

for (let n = 0; n <= 25; n++) {
  const row = document.createElement("tr");
  if (n === 0) row.classList.add("original");

  const tdShift = document.createElement("td");
  tdShift.className = "shift col-shift";
  tdShift.textContent = n === 0 ? "—" : n;

  const tdPlain = document.createElement("td");
  tdPlain.className = "plain col-plain";
  tdPlain.textContent = shiftString(text, n);

  const tdBtn = document.createElement("td");
  tdBtn.className = "col-copy";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Copy";
  btn.dataset.shift = String(n);
  tdBtn.appendChild(btn);

  row.append(tdShift, tdPlain, tdBtn);
  tbody.appendChild(row);
}

tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const n = Number(btn.dataset.shift);
  try {
    await navigator.clipboard.writeText(shiftString(text, n));
    const original = btn.textContent;
    btn.textContent = "Copied ✓";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1500);
  } catch {
    btn.textContent = "Copy failed";
    setTimeout(() => { btn.textContent = "Copy"; }, 1500);
  }
});
