// Dark theme
function toggleDarkTheme() {
  document.body.classList.toggle('dark-theme');
  if (document.querySelector("#dark-theme-btn span").innerHTML == "dark_mode") {
    document.querySelector("#dark-theme-btn span").innerHTML = "light_mode";
    document.querySelector("#dark-theme-btn span").classList.toggle("light");
    correctColor = "#336137";
    incorrectColor = "#7d2424";
    localStorage.setItem("darkTheme", "on");
  } else {
    document.querySelector("#dark-theme-btn span").innerHTML = "dark_mode";
    correctColor = "#5cb863";
    incorrectColor = "#bd4646";
    localStorage.setItem("darkTheme", "off");
  }
}

// Apply dark theme on page load if it was previously enabled
if (localStorage.getItem("darkTheme") == "on") {
  document.body.classList.add("dark-theme");
  document.querySelector("#dark-theme-btn span").innerHTML = "light_mode";
  document.querySelector("#dark-theme-btn span").classList.add("light");
}

// If the user is on mobile/tablet, ask them to switch to laptop so they can properly learn/type and do the typing exercises that way
const userAgent = navigator.userAgent.toLowerCase();
if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent) || /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent)) {
  document.getElementById("warning-modal").style.display = "block";
  document.body.style.overflowY = "hidden";
  document.body.style.overflowX = "hidden";
} else {
  document.getElementById("warning-modal").style.display = "none";
  document.body.style.overflowY = "visible";
  document.body.style.overflowX = "hidden";
}

// Getting a random practice text from the API
async function getPracticeText() {
  const response = await fetch("https://api.jsonbin.io/v3/b/6a30afecf5f4af5e29f8a80e", {
    headers: {
      "X-Master-Key": "$2b$10$urVPLuREMsfPaTuP1vJ6eu4tBoN8V7XDoK.yRkLeJpiU5HFMmZWHO"
    }
  });

  const data = await response.json();
  const texts = data.record;
  return texts[Math.floor(Math.random() * texts.length)];
}

getPracticeText().then(typingPracticeText => {
  // The typing simulator
  const typingPracticeSimulator = document.querySelector("main #typing-practice-simulator");
  let correctColor = "#5cb863", incorrectColor = "#bd4646", correctedColor = "#bd9642";

  // Making a <span> for every letter of the typing text
  for (letter of typingPracticeText) {
    let typingPracticeTextLetter = document.createElement("span");
    typingPracticeTextLetter.innerHTML = letter != " " ? letter : "&nbsp;";
    typingPracticeSimulator.appendChild(typingPracticeTextLetter);
  }

  // Highlighting the current letter to type
  let currentLetterIndex = 0;
  let currentLetter = typingPracticeSimulator.childNodes[currentLetterIndex];
  if (document.body.classList.contains("dark-theme")) {
    currentLetter.style.cssText = "border-left: 2px solid black; animation: border-animation-dark-theme 0.9s infinite;";
  } else {
    currentLetter.style.cssText = "border-left: 2px solid black; animation: border-animation 0.9s infinite;";
  }

  // Actual typing
  const forbiddenCharactersKeyCodes = [46, 27, 9, 20, 16, 17, 145, 19, 45, 144, 18, 8, 13, 91];
  let lettersCorrect = 0, lettersIncorrect = 0, lettersCorrected = 0, timeBefore, timeAfter, lettersCorrectedArray = [];

  // Caps Lock warning
  document.addEventListener("keydown", event => {
    if (event.key == "CapsLock" && (lettersCorrect > 0 || lettersIncorrect > 0) && currentLetterIndex <= typingPracticeText.length - 1) {
      document.querySelector("main #practice-instructions").innerHTML = "Caps Lock is on!";
    }
  });

  document.addEventListener("keyup", event => {
    if (event.key == "CapsLock") {
      if (!event.getModifierState("CapsLock")) {
        if (currentLetterIndex > typingPracticeText.length - 1) {
          document.querySelector("main #practice-instructions").innerHTML = "All done!";
        } else {
          document.querySelector("main #practice-instructions").innerHTML = lettersCorrect == 0 && lettersIncorrect == 0
            ? "<p>This is a practice text for you to type to get better and better! Type it all the way to the end, and then you'll see your results!</p>Start typing"
            : "Don't stop until the end!";
        }
      }
      return;
    }

    if (currentLetterIndex > typingPracticeText.length - 1) return;

    let characterTyped = event.key;
    if (event.shiftKey) characterTyped = characterTyped.toUpperCase();

    if (characterTyped == "Backspace" && currentLetterIndex != 0) {
      currentLetter.style.cssText = "border-left: none; animation: none";
      currentLetterIndex--;
      currentLetter = typingPracticeSimulator.childNodes[currentLetterIndex];
      if (currentLetter.style.backgroundColor == correctColor) lettersCorrect--;
      else if (currentLetter.style.backgroundColor == incorrectColor) lettersIncorrect--;
      currentLetter.style.cssText = document.body.classList.contains("dark-theme")
        ? "border-left: 2px solid black; animation: border-animation-dark-theme 0.9s infinite;"
        : "border-left: 2px solid black; animation: border-animation 0.9s infinite;";
      lettersCorrectedArray.push(currentLetter);
    }

    if (timeBefore == null) {
      timeBefore = Math.floor(new Date() / 1000);
      document.querySelector("main #practice-instructions").innerHTML = "Don't stop until the end!";
    }

    if (characterTyped == currentLetter.innerHTML || (event.keyCode == 32 && currentLetter.innerHTML == "&nbsp;")) {
      if (lettersCorrectedArray.includes(currentLetter)) {
        currentLetter.style.cssText = `background-color: ${correctedColor}; border-left: none; animation: none`;
        lettersCorrected++;
      } else {
        currentLetter.style.cssText = `background-color: ${correctColor}; border-left: none; animation: none`;
        lettersCorrect++;
      }
      if (!event.getModifierState("CapsLock")) document.querySelector("main #practice-instructions").innerHTML = "Don't stop until the end!";
    } else if (!forbiddenCharactersKeyCodes.includes(event.keyCode)) {
      currentLetter.style.cssText = `background-color: ${incorrectColor}; border-left: none; animation: none`;
      if (!event.getModifierState("CapsLock")) document.querySelector("main #practice-instructions").innerHTML = "Don't stop until the end!";
      lettersIncorrect++;
    }

    if (!forbiddenCharactersKeyCodes.includes(event.keyCode)) {
      currentLetterIndex++;
      if (currentLetterIndex < typingPracticeText.length) {
        currentLetter = typingPracticeSimulator.childNodes[currentLetterIndex];
        currentLetter.style.cssText = document.body.classList.contains("dark-theme")
          ? "border-left: 2px solid black; animation: border-animation-dark-theme 0.9s infinite;"
          : "border-left: 2px solid black; animation: border-animation 0.9s infinite;";
      }
    }

    if (currentLetterIndex > typingPracticeText.length - 1) {
      timeAfter = Math.floor(new Date() / 1000);
      document.querySelector("main #practice-instructions").innerHTML = "All done!";
      setTimeout(showResult, 1500);
    }
  });

  // Showing the results
  function showResult() {
    let time = timeAfter - timeBefore;
    let speed = Math.max(0, Math.floor(((typingPracticeText.length / 5) - (lettersIncorrect / (time / 60))) / (time / 60)));
    let accuracy = Math.floor((lettersCorrect / typingPracticeText.length) * 100);
    document.querySelector("main #practice-results-container #practice-results #body #speed").innerHTML = `Speed: ${speed} WPM`;
    document.querySelector("main #practice-results-container #practice-results #body #accuracy").innerHTML = `Accuracy: ${accuracy}%`;
    document.querySelector("main #practice-results-container #practice-results #body #duration").innerHTML = `Duration: ${time} seconds`;
    document.querySelector("main #practice-results-container #practice-results #body #num-of-characters").innerHTML = `There were <strong>${typingPracticeText.length}</strong> characters in this practice.`;
    document.querySelector("main #practice-results-container").style.display = "block";
  }
});