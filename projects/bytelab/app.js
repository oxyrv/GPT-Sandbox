(() => {
  "use strict";

  const decimalInput = document.querySelector("#decimal-input");
  const valueError = document.querySelector("#value-error");
  const bitContainer = document.querySelector("#bit-switches");
  const bitWeights = [128, 64, 32, 16, 8, 4, 2, 1];
  let currentValue = 173;

  function isByte(value) {
    return Number.isInteger(value) && value >= 0 && value <= 255;
  }

  function binary(value) {
    return value.toString(2).padStart(8, "0");
  }

  function updateByte(value) {
    currentValue = value;
    decimalInput.value = String(value);
    document.querySelector("#decimal-value").textContent = String(value);
    document.querySelector("#hex-value").textContent = value.toString(16).toUpperCase().padStart(2, "0");
    document.querySelector("#binary-value").textContent = binary(value);

    bitContainer.querySelectorAll("button").forEach((button, index) => {
      const on = (value & bitWeights[index]) !== 0;
      button.setAttribute("aria-pressed", String(on));
      button.querySelector("b").textContent = on ? "1" : "0";
    });
    valueError.hidden = true;
  }

  function buildSwitches() {
    bitContainer.replaceChildren();
    bitWeights.forEach((weight, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bit";
      button.setAttribute("aria-label", "Toggle bit " + (7 - index) + ", place value " + weight);
      button.innerHTML = "<small>" + (7 - index) + "</small><b>0</b>";
      button.addEventListener("click", () => updateByte(currentValue ^ weight));
      bitContainer.append(button);
    });
  }

  function readOperand(input) {
    const value = Number(input.value);
    return input.value.trim() !== "" && isByte(value) ? value : null;
  }

  function updateLogic() {
    const a = readOperand(document.querySelector("#operand-a"));
    const b = readOperand(document.querySelector("#operand-b"));
    const operator = document.querySelector("#operator").value;
    const error = document.querySelector("#logic-error");
    if (a === null || b === null) {
      error.hidden = false;
      return;
    }
    error.hidden = true;

    let result;
    let explanation;
    if (operator === "AND") {
      result = a & b;
      explanation = "AND keeps a bit only when both corresponding bits are 1.";
    } else if (operator === "OR") {
      result = a | b;
      explanation = "OR sets a bit when either corresponding bit is 1 (or both).";
    } else {
      result = a ^ b;
      explanation = "XOR sets a bit only when the corresponding bits are different.";
    }

    document.querySelector("#logic-a").textContent = binary(a);
    document.querySelector("#logic-b").textContent = binary(b);
    document.querySelector("#logic-result").textContent = binary(result);
    document.querySelector("#result-op").textContent = operator + " = " + result;
    document.querySelector("#logic-explanation").textContent = explanation;
  }

  decimalInput.addEventListener("input", () => {
    const value = Number(decimalInput.value);
    if (decimalInput.value.trim() === "" || !isByte(value)) {
      valueError.hidden = false;
      return;
    }
    updateByte(value);
  });

  document.querySelector("#reset-byte").addEventListener("click", () => updateByte(0));
  ["#operand-a", "#operand-b", "#operator"].forEach((selector) => {
    document.querySelector(selector).addEventListener("input", updateLogic);
    document.querySelector(selector).addEventListener("change", updateLogic);
  });

  buildSwitches();
  updateByte(173);
  updateLogic();
})();
