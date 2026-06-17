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
  document.body.style.overflowY = "visisble";
  document.body.style.overflowX = "hidden";
}

// The learning slideshow
let index = 1;
showLesson(index);

function changeLesson(n) {
  showLesson(index += n);
}

function changeLessonTo(n) {
  showLesson(index = n);
}

function showLesson(n) {
  let lessons = document.querySelectorAll("#learning-slideshow .learn-section"), dots = document.getElementsByClassName("dot");
  if (n > lessons.length) {
    index = 1;
  }    
  if (n < 1) {
    index = lessons.length;
  }
  for (let i = 0; i < lessons.length; i++) {
    lessons[i].style.display = "none";  
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  lessons[index-1].style.display = "block";  
  dots[index-1].className += " active";
}

document.querySelectorAll("input[type=text]").forEach((element) => {
  element.addEventListener("keyup", (event) => {
    if (event.keyCode == 13) {
      element.blur();
      if (element.value == element.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML) {
        element.nextElementSibling.innerHTML = "Perfect!";
      } else {
        element.nextElementSibling.innerHTML = "Not quite! Try again.";
      }
    }
  });
});