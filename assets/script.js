(() => {
  const cfg = window.RESPONSE_CONFIG || {};

  const stageReceipt = document.getElementById("stageReceipt");
  const stageStory1 = document.getElementById("stageStory1");
  const stageStory3 = document.getElementById("stageStory3");

  const unsealBtn = document.getElementById("unsealBtn");
  const shyBtn = document.getElementById("shyBtn");
  const receiptNote = document.getElementById("receiptNote");

  const backFrom1Btn = document.getElementById("backFrom1Btn");
  const switchTo3Btn = document.getElementById("switchTo3Btn");

  const nextBtn = document.getElementById("nextBtn");
  const backBtn = document.getElementById("backBtn");
  const resetBtn = document.getElementById("resetBtn");

  const q1 = document.getElementById("q1");
  const q2 = document.getElementById("q2");
  const q3 = document.getElementById("q3");

  const s1 = document.getElementById("s1");
  const s2 = document.getElementById("s2");
  const s3 = document.getElementById("s3");
  const s4 = document.getElementById("s4");

  const steps = Array.from(document.querySelectorAll(".step"));
  const mirror = document.getElementById("mirror");
  const err = document.getElementById("err");

  let step = 1;

  function show(which){
    stageReceipt.hidden = which !== "receipt";
    stageStory1.hidden = which !== "story1";
    stageStory3.hidden = which !== "story3";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setStep(n){
    step = n;
    s1.hidden = n !== 1;
    s2.hidden = n !== 2;
    s3.hidden = n !== 3;
    s4.hidden = n !== 4;

    steps.forEach(el => el.classList.toggle("active", el.getAttribute("data-s") === String(n)));

    // focus
    if (n === 1) setTimeout(() => q1?.focus(), 120);
    if (n === 2) setTimeout(() => q2?.focus(), 120);
    if (n === 3) setTimeout(() => q3?.focus(), 120);
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

  // RECEIPT actions
  unsealBtn?.addEventListener("click", () => {
    receiptNote.textContent = cfg.receiptNoteUnseal || "";
    show("story3");
    err.textContent = "";
    setStep(1);
  });

  shyBtn?.addEventListener("click", () => {
    receiptNote.textContent = cfg.receiptNoteShy || "";
    show("story1");
  });

  // STORY 1 actions
  backFrom1Btn?.addEventListener("click", () => show("receipt"));
  switchTo3Btn?.addEventListener("click", () => {
    show("story3");
    err.textContent = "";
    setStep(1);
  });

  // STORY 3 stepper actions
  nextBtn?.addEventListener("click", () => {
    err.textContent = "";

    if (step === 1){
      if (!clean(q1.value)){
        err.textContent = cfg.validationMissing || "Fill it in.";
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2){
      if (!clean(q2.value)){
        err.textContent = cfg.validationMissing || "Fill it in.";
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3){
      if (!clean(q3.value)){
        err.textContent = cfg.validationMissing || "Fill it in.";
        return;
      }

      // Build mirror & reveal
      const v1 = escapeHtml(clean(q1.value));
      const v2 = escapeHtml(clean(q2.value));
      const v3 = escapeHtml(clean(q3.value));

      mirror.innerHTML = `
        <strong>Noted.</strong><br/>
        With me, you are most <strong>${v1}</strong>.<br/>
        Last time, you felt <strong>${v2}</strong>.<br/>
        Next time, you want <strong>${v3}</strong>.
      `;

      // Optional line override from config (simple)
      const comeHereLine = cfg.comeHereLine || "";
      if (comeHereLine){
        // Inject it into the existing paragraph if present
        // (We keep this minimal: just replace the text node by finding the last copy paragraph in s4.)
        const paras = s4.querySelectorAll(".copy");
        const last = paras[paras.length - 1];
        if (last) last.textContent = comeHereLine;
      }

      setStep(4);
      nextBtn.textContent = "Done";
      return;
    }

    if (step === 4){
      // stay put
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
    q1.value = ""; q2.value = ""; q3.value = "";
    err.textContent = "";
    receiptNote.textContent = "";
    nextBtn.textContent = "Next";
    show("receipt");
  });

  // Init
  show("receipt");
})();
