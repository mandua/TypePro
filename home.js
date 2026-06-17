// Sticky header
document.addEventListener("scroll", () => {
  if (window.pageYOffset > document.getElementById("header").offsetTop) {
    document.getElementById("header").classList.add("sticky-header");
  } else {
    document.getElementById("header").classList.remove("sticky-header");
  }
});

// The menu
function openMenu() {
  document.getElementById("menu").style.width = "25vh";
  document.querySelector("main").style.marginLeft = "25vh";
  document.querySelector("footer").style.marginLeft = "24vh";
}

function closeMenu() {
  document.getElementById("menu").style.width = "0";
  document.querySelector("main").style.marginLeft = "0";
  document.querySelector("footer").style.marginLeft = "-10px";
}

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

// The footer copyright claim
setInterval(function() {
  document.querySelector("footer #copyright-claim").innerHTML = "TypePro &copy; " + new Date().getFullYear();
}, 1000);