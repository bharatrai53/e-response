(() => {
  const cfg = window.RESPONSE_CONFIG || {};

  // stages
  const stageReceipt = document.getElementById("stageReceipt");
  const stageOperational = document.getElementById("stageOperational");
  const stageTruth = document.getElementById("stageTruth");

  // receipt buttons
  const goOperationalBtn = document.getElementById("goOperationalBtn");
  const goNeedBtn = document.getElementById("goNeedBtn");
  const receiptNote = document.getElementById("receiptNote");

  // operational buttons
  const unsealTruthBtn = document.getElementById("unsealTruthBtn");
  const backFromOperationalBtn = document.getElementById("backFromOperationalBtn");

  // truth stepper
  const nextBtn = document.getElementById("nextBtn");
  const backBtn = document.getElementById("backBtn");
  const resetBtn = document.getElementById("resetBtn");
  const err = document.getElementById("err");

  const t1 = document.getElementById("t1");
  const t2 = document.getElementById("t2");
  const t3 = document.getElementById("t3");
  const t4 = document.getElementById("t4");

  const steps = Array.from(document.querySelectorAll(".step"));

  // inputs
  const x1 = document.getElementById("x1");
  const x2 = document.getElementById("x2");
  const x3 = document.getElementById("x3");
  const x4 = document.getElementById("x4");

  const mirror = document.getElementById("mirror");

  let step = 1;

  function show(which){
    stageReceipt.hidden = which !== "receipt";
    stageOperational.hidden = which !== "operational";
    stageTruth.hidden = which !== "truth";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setStep(n){
    step = n;
    t1.hidden = n !== 1;
    t2.hidden = n !== 2;
    t3.hidden = n !== 3;
    t4.hidden = n !== 4;

    steps.forEach(el => el.classList.toggle("active", el.getAttribute("data-s") === String(n)));

    if (n === 1) setTimeout(() => x1?.focus(), 120);
    if (n === 2) setTimeout(() => x2?.focus(), 120);
    if (n === 3) setTimeout(() => x4?.focus(), 120);
  }

  function clean(s){ return (s || "").trim(); }

  function escapeHtml(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  // receipt actions
  goOperationalBtn?.addEventListener("click", () => {
    receiptNote.textContent = cfg.receiptNoteOperational || "";
    show("operational");
  });

  goNeedBtn?.addEventListener("click", () => {
    receiptNote.textContent = cfg.receiptNoteNeed || "";
    show("truth");
    err.textContent = "";
    setStep(1);
  });

  // operational actions
  backFromOperationalBtn?.addEventListener("click", () => show("receipt"));
  unsealTruthBtn?.addEventListener("click", () => {
    show("truth");
    err.textContent = "";
    setStep(1);
  });

  // truth navigation
  nextBtn?.addEventListener("click", () => {
    err.textContent = "";

    if (step === 1){
      if (!clean(x1.value)){
        err.textContent = cfg.validationMissing || "Answer it.";
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2){
      if (!clean(x2.value) || !clean(x3.value)){
        err.textContent = cfg.validationMissing || "Answer it.";
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3){
      if (!clean(x4.value)){
        err.textContent = cfg.validationMissing || "Answer it.";
        return;
      }

      const v1 = escapeHtml(clean(x1.value));
      const v2 = escapeHtml(clean(x2.value));
      const v3 = escapeHtml(clean(x3.value));
      const v4 = escapeHtml(clean(x4.value));

      mirror.innerHTML = `
        <strong>Noted.</strong><br/>
        Last time you felt: <strong>${v1}</strong><br/>
        You want: <strong>${v2}</strong> · You need: <strong>${v3}</strong><br/>
        And the fear you named: <strong>${v4}</strong>
      `;

      setStep(4);
      nextBtn.textContent = "Done";
      return;
    }
  });

  backBtn?.addEventListener("click", () => {
    err.textContent = "";
    if (step > 1){
      setStep(step - 1);
      nextBtn.textContent = "Next";
    } else {
      show("receipt");
    }
  });

  resetBtn?.addEventListener("click", () => {
    x1.value = ""; x2.value = ""; x3.value = ""; x4.value = "";
    err.textContent = "";
    receiptNote.textContent = "";
    nextBtn.textContent = "Next";
    show("receipt");
  });

  // init
  show("receipt");
})();
