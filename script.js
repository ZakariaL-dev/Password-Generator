const passwordDisplay = document.getElementById("passinp");
const copyIcon = document.getElementById("copyicon");
const feedback = document.getElementById("feedback");
const strenghtType = document.getElementById("strenghtpara");
const strenghtLine = document.getElementById("strengthline");
const lengthValue = document.getElementById("lengthnumb");
const lengthRange = document.getElementById("lengthinp");
const uppercaseCheck = document.getElementById("upper");
const lowercaseCheck = document.getElementById("lower");
const numberCheck = document.getElementById("number");
const symbolCheck = document.getElementById("symbol");
const generatebtn = document.getElementById("generatebtn");

let previousWidth = 65;

// init UI values
lengthValue.textContent = lengthRange.value;

// keep at least one checkbox checked (use event listeners instead of a tight setInterval)
const allChecks = [uppercaseCheck, lowercaseCheck, numberCheck, symbolCheck];
allChecks.forEach((chk) =>
  chk.addEventListener("change", () => {
    if (!allChecks.some((c) => c.checked)) {
      lowercaseCheck.checked = true;
    }
    strength();
  })
);

// update length label + strength live
lengthRange.addEventListener("input", () => {
  lengthValue.textContent = lengthRange.value;
  strength();
});

// copy function (supports modern clipboard, falls back to execCommand if necessary)
async function copy(_id) {
  if (
    passwordDisplay.value &&
    passwordDisplay.value !== "Random Password Generator"
  ) {
    try {
      await navigator.clipboard.writeText(passwordDisplay.value);
      feedback.style.color = "#338997";
      feedback.innerHTML = "Copied to clipboard!";
    } catch (err) {
      // fallback
      passwordDisplay.select();
      document.execCommand("copy");
      feedback.style.color = "#338997";
      feedback.innerHTML = "Copied to clipboard!";
    }
  } else {
    feedback.style.color = "red";
    feedback.innerHTML = "Generate a password first!";
  }
  // simple fade in/out
  feedback.style.animationName = "fadeIn";
  feedback.style.animationDuration = "0.4s";
  feedback.style.opacity = "1";
  setTimeout(() => {
    feedback.style.opacity = "0";
    feedback.style.animationName = "none";
  }, 2000);
}

// generate password (uses crypto RNG when available)
generatebtn.addEventListener("click", function () {
  const length = parseInt(lengthRange.value, 10);

  const lowerletters = "abcdefghijklmnopqrstuvwxyz";
  const upperletters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberchar = "0123456789";
  const symbolchar = "!@#$%^&*";

  let charset = "";
  if (uppercaseCheck.checked) charset += upperletters;
  if (lowercaseCheck.checked) charset += lowerletters;
  if (numberCheck.checked) charset += numberchar;
  if (symbolCheck.checked) charset += symbolchar;

  if (!charset) {
    feedback.style.color = "red";
    feedback.innerHTML = "Select at least one character set";
    feedback.style.animationName = "fadeIn";
    feedback.style.animationDuration = "0.4s";
    feedback.style.opacity = "1";
    setTimeout(() => {
      feedback.style.opacity = "0";
      feedback.style.animationName = "none";
    }, 2000);
    return;
  }

  let password = "";
  const cryptoObj = window.crypto || window.msCrypto;
  if (cryptoObj && cryptoObj.getRandomValues) {
    const randomValues = new Uint32Array(length);
    cryptoObj.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      password += charset[randomValues[i] % charset.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
  }

  passwordDisplay.value = password;
  strength(); // update bar color/width after generation
});

// strength system (no class toggling; CSS handles smooth transition of width)
function strength() {
  let checkCount = 0;
  if (uppercaseCheck.checked) checkCount += 1;
  if (lowercaseCheck.checked) checkCount += 1;
  if (numberCheck.checked) checkCount += 1;
  if (symbolCheck.checked) checkCount += 1;

  const len = parseInt(lengthRange.value, 10);
  if (len < 8) checkCount += 0;
  if (len >= 8 && len < 13) checkCount += 1;
  if (len >= 13 && len < 17) checkCount += 2;
  if (len >= 17 && len < 23) checkCount += 3;
  if (len >= 23) checkCount += 4;

  if (
    len > 22 &&
    uppercaseCheck.checked &&
    lowercaseCheck.checked &&
    numberCheck.checked &&
    symbolCheck.checked
  )
    checkCount += 1;

  let newWidth = 0;

  if (checkCount <= 1) {
    strenghtType.innerHTML = "Very weak";
    strenghtType.style.color = "#EF4444";
    strenghtLine.style.backgroundColor = "#EF4444";
    newWidth = 25;
  } else if (checkCount <= 2 && checkCount > 1) {
    strenghtType.innerHTML = "Weak";
    strenghtType.style.color = "#F97316";
    strenghtLine.style.backgroundColor = "#F97316";
    newWidth = 45;
  } else if (checkCount <= 5 && checkCount > 2) {
    strenghtType.innerHTML = "Medium";
    strenghtType.style.color = "#EAB308";
    strenghtLine.style.backgroundColor = "#EAB308";
    newWidth = 65;
  } else if (checkCount <= 8 && checkCount > 5) {
    strenghtType.innerHTML = "Strong";
    strenghtType.style.color = "#84CC16";
    strenghtLine.style.backgroundColor = "#84CC16";
    newWidth = 85;
  } else if (checkCount > 8) {
    strenghtType.innerHTML = "Very strong";
    strenghtType.style.color = "#10B981";
    strenghtLine.style.backgroundColor = "#10B981";
    newWidth = 100;
  }

  // simply change width — CSS transition will animate both increase and decrease smoothly
  strenghtLine.style.width = newWidth + "%";
  previousWidth = newWidth;
}

// initialize
strength();

// make the copy icon react (in case HTML still uses onclick, our function accepts a param)
if (copyIcon) copyIcon.addEventListener("click", () => copy());
