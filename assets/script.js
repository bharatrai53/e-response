(() => {
    const cfg = window.PORTAL_CONFIG || { key: "change-me", hints: {}, storyReplies: {} };
  
    const statusText = document.getElementById("statusText");
  
    const stagePipeline = document.getElementById("stagePipeline");
    const stageKey = document.getElementById("stageKey");
    const stageLetter = document.getElementById("stageLetter");
  
    const runBtn = document.getElementById("runBtn");
    const resetBtn = document.getElementById("resetBtn");
    const continueBtn = document.getElementById("continueBtn");
    const artifactPanel = document.getElementById("artifactPanel");
  
    const steps = Array.from(document.querySelectorAll("#steps li"));
  
    const keyInput = document.getElementById("keyInput");
    const decryptBtn = document.getElementById("decryptBtn");
    const backBtn = document.getElementById("backBtn");
    const keyError = document.getElementById("keyError");
  
    const hintBox = document.getElementById("hintBox");
    const hintBtns = Array.from(document.querySelectorAll(".hintBtn"));
  
    const storyButtons = Array.from(document.querySelectorAll(".choice"));
    const storyResult = document.getElementById("storyResult");
  
    // Helpers
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const setStatus = (s) => { statusText.textContent = s; };
  
    function resetPipelineUI(){
      steps.forEach(li => li.classList.remove("running","done","fail"));
      artifactPanel.hidden = true;
      continueBtn?.blur();
      runBtn.disabled = false;
      resetBtn.disabled = true;
      setStatus("idle");
    }
  
    async function runPipeline(){
      resetPipelineUI();
      runBtn.disabled = true;
      resetBtn.disabled = true;
      setStatus("running");
  
      for (let i=0;i<steps.length;i++){
        const li = steps[i];
        li.classList.add("running");
        await sleep(650 + Math.random()*450);
        li.classList.remove("running");
        li.classList.add("done");
      }
  
      await sleep(250);
      artifactPanel.hidden = false;
      resetBtn.disabled = false;
      setStatus("artifact-ready");
    }
  
    function showStage(which){
      stagePipeline.hidden = which !== "pipeline";
      stageKey.hidden = which !== "key";
      stageLetter.hidden = which !== "letter";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  
    function normalizeKey(s){
      return (s || "").trim().toLowerCase();
    }
  
    function decrypt(){
      keyError.textContent = "";
      const entered = normalizeKey(keyInput.value);
      const expected = normalizeKey(cfg.key);
  
      if (!expected || expected === "change-me"){
        keyError.textContent = "⚠️ Config not set. Edit assets/config.js and set PORTAL_CONFIG.key first.";
        return;
      }
  
      if (entered !== expected){
        keyError.textContent = "Decryption failed. That key feels… incorrect. Try again (or request assistance).";
        keyInput.focus();
        return;
      }
  
      setStatus("decrypted");
      showStage("letter");
      storyResult.textContent = "Select a story. I’ll comply. (Probably.)";
    }
  
    // Wire up events
    runBtn?.addEventListener("click", runPipeline);
    resetBtn?.addEventListener("click", resetPipelineUI);
  
    continueBtn?.addEventListener("click", () => {
      showStage("key");
      setStatus("key-exchange");
      keyInput.focus();
    });
  
    backBtn?.addEventListener("click", () => showStage("pipeline"));
  
    decryptBtn?.addEventListener("click", decrypt);
    keyInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") decrypt();
    });
  
    hintBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const n = btn.getAttribute("data-h");
        hintBox.textContent = (cfg.hints && cfg.hints[n]) ? cfg.hints[n] : "No hint configured.";
      });
    });
  
    storyButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const s = btn.getAttribute("data-story");
        const reply = (cfg.storyReplies && cfg.storyReplies[s]) || "Acknowledged.";
        storyResult.textContent = reply;
      });
    });
  
    // Init
    resetPipelineUI();
    showStage("pipeline");
  })();
  