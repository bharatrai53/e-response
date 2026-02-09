(() => {
  const cfg = window.RESPONSE_CONFIG || {};

  const stageReceipt = document.getElementById("stageReceipt");
  const stageVow = document.getElementById("stageVow");
  const stageReveal = document.getElementById("stageReveal");

  const beginBtn = document.getElementById("beginBtn");
  const softBtn = document.getElementById("softBtn");
  const softMsg = document.getElementById("softMsg");

  const backBtn = document.getElementById("backBtn");
  const submitVowBtn = document.getElementById("submitVowBtn");

  const a1 = document.getElementById("a1");
  const a2 = document.getElementById("a2");
  const a3 = document.getElementById("a3");
  const err = document.getElementById("err");

  const mirror = document.getElementById("mirror");
  const result = document.getElementById("result");
  const restartBtn = document.getElementById("restartBtn");

  const storyBtns = Array.from(document.querySelectorAll(".story"));

  function show(which){
    stageReceipt.hidden = which !== "receipt";
    stageVow.hidden = which !== "vow";
    stageReveal.hidden = which !== "reveal";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clean(s){
    return (s || "").trim();
  }

  beginBtn?.addEventListener("click", () => {
    softMsg.textContent = "";
    show("vow");
    setTimeout(() => a1?.focus(), 120);
  });

  softBtn?.addEventListener("click", () => {
    softMsg.textContent = cfg.shyMessage || "Okay. But I’m still listening.";
  });

  backBtn?.addEventListener("click", () => {
    err.textContent = "";
    show("receipt");
  });

  submitVowBtn?.addEventListener("click", () => {
    err.textContent = "";
    const v1 = clean(a1.value);
    const v2 = clean(a2.value);
    const v3 = clean(a3.value);

    if (!v1 || !v2 || !v3){
      err.textContent = (cfg.validation && cfg.validation.missing) || "Fill all three.";
      return;
    }

    mirror.innerHTML = `
      <strong>Noted.</strong><br/>
      You: “With you, I am most <strong>${escapeHtml(v1)}</strong>.”<br/>
      You: “Last time, I felt <strong>${escapeHtml(v2)}</strong>.”<br/>
      You: “Next time, I want <strong>${escapeHtml(v3)}</strong>.”
    `;

    result.textContent = "Choose a story. I’ll comply. (Probably.)";
    show("reveal");
  });

  storyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-story");
      const text = (cfg.storyResult && cfg.storyResult[id]) || "Confirmed.";
      result.textContent = text;
    });
  });

  restartBtn?.addEventListener("click", () => {
    // reset
    a1.value = ""; a2.value = ""; a3.value = "";
    err.textContent = "";
    softMsg.textContent = "";
    result.textContent = "";
    show("receipt");
  });

  function escapeHtml(str){
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  show("receipt");
})();
