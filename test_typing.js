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

// The typing simulator
const typingTestSimulator = document.querySelector("main #typing-test-simulator");

let correctColor = "#5cb863", incorrectColor = "#bd4646";

// Getting words for the typing test text
async function getWords() {
  const cached = localStorage.getItem("cachedWords");
  if (cached) {
    const words = JSON.parse(cached);
    return Array.from({ length: 200 }, () =>
      words[Math.floor(Math.random() * words.length)]
    );
  }

  const response = await fetch("https://api.jsonbin.io/v3/b/6a30a1acda38895dfec6f8c8", {
    headers: {
      "X-Master-Key": "$2b$10$urVPLuREMsfPaTuP1vJ6eu4tBoN8V7XDoK.yRkLeJpiU5HFMmZWHO"
    }
  });

  const data = await response.json();
  const words = data.record;
  localStorage.setItem("cachedWords", JSON.stringify(words));

  return Array.from({ length: 200 }, () =>
    words[Math.floor(Math.random() * words.length)]
  );
}

// Making a <span> for every letter of the typing text
function makeTypingTestWords(typingTestWords) {
  for (letter of typingTestWords) {
    let typingTestWordsLetter = document.createElement("span");
    if (letter != " ") {
      typingTestWordsLetter.innerHTML = letter;
    } else {
      typingTestWordsLetter.innerHTML = "&nbsp;";
    }
    typingTestSimulator.appendChild(typingTestWordsLetter);
  }
}

getWords().then(words => {
  makeTypingTestWords(words.join(" "));
}).then(() => {
  // Highlighting the current letter to type
  let currentLetterIndex = 0;
  let currentLetter = typingTestSimulator.childNodes[currentLetterIndex];
  if (document.body.classList.contains("dark-theme")) {
    currentLetter.style.cssText = "border-left: 2px solid black; animation: border-animation-dark-theme 0.9s infinite;";
  } else {
    currentLetter.style.cssText = "border-left: 2px solid black; animation: border-animation 0.9s infinite;";
  }

  // Actual typing
  const forbiddenCharactersKeyCodes = [46, 27, 9, 20, 16, 17, 145, 19, 45, 144, 18, 8, 13, 91];
  let lettersCorrect = 0, lettersIncorrect = 0, lettersTyped = 0, timer = 60, isTimerStarted = false, toggleVariable = false, lastCurrentLetterIndex = 0;

  function countdown() {
    if (isTimerStarted == false) {
      return;
    }
    let timerInterval = setInterval(() => {
      if (timer < 0) {
        clearInterval(timerInterval);
        isTimerStarted = false;
        currentLetter.style.cssText = "border-left: none; animation: none;";
        document.querySelector("main #test-instructions").innerHTML = "Time's up!";
        setTimeout(showResults, 1500);
        return;
      }
      document.querySelector("main #test-instructions").innerHTML = `${timer}`;
      timer--;
    }, 1000);
  }

  // Caps Lock warning
  document.addEventListener("keydown", event => {
    if (event.key == "CapsLock" && toggleVariable && timer > 0) {
      document.querySelector("main #test-instructions").innerHTML = "Caps Lock is on!";
    }
  });

  document.addEventListener("keyup", event => {
    if (timer > -1) {
      let lettersLeftToType = typingTestSimulator.childNodes.length - currentLetterIndex;
      if (!(lettersLeftToType > 15) && !(lettersLeftToType < 15)) {
        if (lastCurrentLetterIndex != currentLetterIndex) {
          makeTypingTestWords(" ");
          getWords().then(words => {
            makeTypingTestWords(words.join(" "));
          });
          lastCurrentLetterIndex = currentLetterIndex;
        }
      }

      if (event.key == "CapsLock") return;

      let characterTyped = event.key;
      if (event.shiftKey) characterTyped = characterTyped.toUpperCase();

      if (characterTyped == currentLetter.innerHTML || (event.keyCode == 32 && currentLetter.innerHTML == "&nbsp;")) {
        if (!toggleVariable) {
          isTimerStarted = true;
          countdown();
          toggleVariable = true;
        }
        currentLetter.style.cssText = `background-color: ${correctColor}; border-left: none; animation: none`;
        lettersCorrect++;
        lettersTyped++;
      } else if (!forbiddenCharactersKeyCodes.includes(event.keyCode)) {
        if (!toggleVariable) {
          isTimerStarted = true;
          countdown();
          toggleVariable = true;
        }
        currentLetter.style.cssText = `background-color: ${incorrectColor}; border-left: none; animation: none`;
        lettersIncorrect++;
        lettersTyped++;
      }

      if (timer > 0 && !forbiddenCharactersKeyCodes.includes(event.keyCode)) {
        // Restore instructions after any non-forbidden keypress
        if (document.querySelector("main #test-instructions").innerHTML == "Caps Lock is on!" && 
        (characterTyped == currentLetter.innerHTML || (event.keyCode == 32 && currentLetter.innerHTML == "&nbsp;") || (!forbiddenCharactersKeyCodes.includes(event.keyCode) && characterTyped.length === 1))) {
          document.querySelector("main #test-instructions").innerHTML = `${timer}`;
        }
        currentLetterIndex++;
        currentLetter = typingTestSimulator.childNodes[currentLetterIndex];
        if (document.body.classList.contains("dark-theme")) {
          currentLetter.style.cssText = "border-left: 2px solid black; animation: border-animation-dark-theme 0.9s infinite;";
        } else {
          currentLetter.style.cssText = "border-left: 2px solid black; animation: border-animation 0.9s infinite;";
        }
      }
    }
  });

  // Showing the results
  function showResults() {
    let accuracy = Math.floor((lettersCorrect/lettersTyped) * 100), numOfWords = Math.floor(lettersCorrect/5);
    if (numOfWords == 1 && lettersCorrect != 1) {
      document.querySelector("main #test-results-container #test-results #body p").innerHTML = `You typed <strong>${numOfWords}</strong> word (<strong>${lettersCorrect}</strong> characters) in <strong>1 minute</strong>, with a <strong>${accuracy}%</strong> accuracy.`;
    } else if (numOfWords != 1 && lettersCorrect == 1) {
      document.querySelector("main #test-results-container #test-results #body p").innerHTML = `You typed <strong>${numOfWords}</strong> words (<strong>${lettersCorrect}</strong> character) in <strong>1 minute</strong>, with a <strong>${accuracy}%</strong> accuracy.`;
    } else {
      document.querySelector("main #test-results-container #test-results #body p").innerHTML = `You typed <strong>${numOfWords}</strong> words (<strong>${lettersCorrect}</strong> characters) in <strong>1 minute</strong>, with a <strong>${accuracy}%</strong> accuracy.`;
    }
    if ((accuracy >= 0 && accuracy < 60) && (numOfWords < 0 || (numOfWords >= 0 && numOfWords < 30))) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "You need to work on your accuracy and speed!";
    } else if ((accuracy >= 60 && accuracy < 85) && (numOfWords >= 30 && numOfWords < 45)) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "Not too shabby, but you still need to work on your accuracy & speed a bit more!";
    } else if ((accuracy >= 85 && accuracy < 90) && (numOfWords >= 45 && numOfWords < 65)) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "Pretty good!";
    } else if ((accuracy >= 90 && accuracy < 97) && (numOfWords >= 65 && numOfWords < 75)) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "Excellent!";
    } else if (accuracy >= 0 && accuracy < 60) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "You need to work on your accuracy!";
    } else if (accuracy >= 60 && accuracy < 85) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "You still need to get a little more accuracy.";
    } else if (accuracy >= 85 && accuracy < 90) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "Maybe fine-tune your accuracy?";
    } else if (accuracy >= 90 && accuracy < 97) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "You have average accuracy!";
    } else if (accuracy >= 97 && accuracy < 100) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "Your accuracy is almost perfect!";
    } else if (numOfWords >= 0 && numOfWords < 30) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "You need to work on your speed more.";
    } else if (numOfWords >= 30 && numOfWords < 45) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "Good speed, but you could still improve.";
    } else if (numOfWords >= 45 && numOfWords < 65) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "Great speed!";
    } else if (numOfWords >= 65 && numOfWords < 75) {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "Awesome speed!";
    } else {
      document.querySelector("main #test-results-container #test-results #footer h2").innerHTML = "You're exceptional!";
    }
    document.querySelector("main #test-results-container").style.display = "block";
  }
});