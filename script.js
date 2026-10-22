const $ = (id) => document.getElementById(id);
const rand = (n) => Math.floor(Math.random() * n);
const pick = (list) => list[rand(list.length)];
const ideas = [
  "اكتب رسالة شكر لشخص لم يسمعها منك من قبل.", "صوّر شيئاً أحمر تصادفه في طريقك اليوم.",
  "تعلّم كلمة جديدة بلغة أخرى وجرّب استعمالها.", "امشِ عشر دقائق بدون هاتف.",
  "ارسم شعاراً لمشروع غير موجود.", "جرّب مشروباً لم تذقه من قبل.",
  "رتّب مكتبك في خمس دقائق فقط.", "اكتب قصة كاملة من ثلاث جمل.",
  "اتصل بصديق قديم واسأله عن حاله.", "صمّم غلاف كتاب لعنوان عشوائي.",
  "استمع لأغنية من بلد لا تعرفه.", "اكتب هدفاً صغيراً لهذا الأسبوع."
];
const faces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
let actions = 0;
let history = [];
function bump() {
  actions += 1; $("count").textContent = actions;
}
function toast(message) {
  const box = $("toast");
  box.textContent = message; box.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => box.classList.remove("show"), 1600);
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast("تم النسخ"); }
  catch (error) { toast("تعذّر النسخ، انسخ يدوياً"); }
}
function newIdea() {
  let next = pick(ideas);
  while (next === $("ideaText").textContent) next = pick(ideas);
  $("ideaText").textContent = next;
  bump();
}
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const channel = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return "#" + channel(0) + channel(8) + channel(4);
}
function newPalette() {
  const base = rand(360);
  const box = $("swatches");
  box.innerHTML = "";
  [0, 30, 60, 180, 210].forEach((step) => {
    const hex = hslToHex((base + step) % 360, 55 + rand(30), 40 + rand(30));
    const swatch = document.createElement("button");
    swatch.className = "swatch";
    swatch.style.background = hex;
    swatch.innerHTML = "<span>" + hex + "</span>";
    swatch.setAttribute("aria-label", "نسخ اللون " + hex);
    swatch.addEventListener("click", () => copyText(hex));
    box.appendChild(swatch);
  });
  const root = document.documentElement.style;
  root.setProperty("--accent", hslToHex(base, 85, 58)); root.setProperty("--bg", hslToHex(base, 80, 94));
  bump();
}
function finishRoll() {
  const a = rand(6), b = rand(6);
  $("die1").textContent = faces[a]; $("die2").textContent = faces[b];
  const total = a + b + 2;
  $("total").textContent = total;
  history.unshift(total);
  history = history.slice(0, 8);
  $("history").textContent = history.join(" - ");
  $("rollBtn").disabled = false;
  bump();
}
function rollDice() {
  if ($("rollBtn").disabled) return;
  $("rollBtn").disabled = true;
  let ticks = 0;
  const timer = setInterval(() => {
    $("die1").textContent = pick(faces);
    $("die2").textContent = pick(faces);
    ticks += 1;
    if (ticks > 8) {
      clearInterval(timer);
      finishRoll();
    }
  }, 80);
}
function clearHistory() {
  history = [];
  $("history").textContent = "لا توجد رميات بعد"; $("total").textContent = 0;
}
$("ideaBtn").addEventListener("click", newIdea);
$("copyIdea").addEventListener("click", () => copyText($("ideaText").textContent));
$("palBtn").addEventListener("click", newPalette);
$("rollBtn").addEventListener("click", rollDice);
$("clearBtn").addEventListener("click", clearHistory);
document.addEventListener("keydown", (e) => { if (e.key.toLowerCase() === "r") rollDice(); });
newIdea();
newPalette();
actions = 0;
$("count").textContent = 0;
