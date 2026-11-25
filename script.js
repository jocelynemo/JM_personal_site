const visitCountEl = document.getElementById("visit-count");
const greeting = document.querySelector("#greeting");
const photo = document.querySelector("#hobbies img");
const sections = document.getElementsByClassName("section");
const listItems = document.getElementsByTagName("li");

const themeButton = document.getElementById("theme-button");
const photoButton = document.getElementById("photo-button");
const hobbyButton = document.getElementById("hobby-button");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("visitor-name");
const formMessage = document.getElementById("form-message");

let highlightedHobby = -1;

function readStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        return;
    }
}

function toolsSection() {
    for (let index = 0; index < sections.length; index += 1) {
        if (sections[index].id === "tools") {
            return sections[index];
        }
    }
    return null;
}

function hobbyItems() {
    const hobbies = [];
    for (let index = 0; index < listItems.length; index += 1) {
        if (listItems[index].closest("#hobbies")) {
            hobbies.push(listItems[index]);
        }
    }
    return hobbies;
}

function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    themeButton.textContent = isDark ? "Switch to light mode" : "Toggle dark mode";
    writeStorage("theme", isDark ? "dark" : "light");
}

function toneColor(kind) {
    const isDark = document.body.classList.contains("dark-mode");
    if (kind === "error") {
        return isDark ? "#fda4af" : "#9f1239";
    }
    return isDark ? "#5eead4" : "#0f766e";
}

function showGreeting(name, returning) {
    if (!name) {
        greeting.textContent = "Thanks for visiting my page.";
        return;
    }
    const hello = returning ? "Welcome back, " : "Hello, ";
    greeting.textContent = hello + name + ". Thanks for visiting my page.";
}

let visits = Number(readStorage("pageVisits"));
if (!Number.isFinite(visits) || visits < 0) {
    visits = 0;
}
visits += 1;
writeStorage("pageVisits", String(visits));

const visitWord = visits === 1 ? "time" : "times";
visitCountEl.textContent = "You have visited this page " + visits + " " + visitWord + ".";
visitCountEl.style.fontWeight = "bold";

const savedTheme = readStorage("theme");
if (savedTheme === "dark") {
    applyTheme(true);
}

const savedName = readStorage("visitorName");
if (savedName) {
    nameInput.value = savedName;
    showGreeting(savedName, true);
}

themeButton.addEventListener("click", function () {
    applyTheme(!document.body.classList.contains("dark-mode"));
});

photoButton.addEventListener("click", function () {
    const isHidden = photo.style.display === "none";
    if (isHidden) {
        photo.style.display = "block";
        photoButton.textContent = "Hide photo";
    } else {
        photo.style.display = "none";
        photoButton.textContent = "Show photo";
    }
});

hobbyButton.addEventListener("click", function () {
    const hobbies = hobbyItems();
    if (hobbies.length === 0) {
        return;
    }
    if (highlightedHobby >= 0 && hobbies[highlightedHobby]) {
        hobbies[highlightedHobby].classList.remove("featured");
    }
    highlightedHobby = (highlightedHobby + 1) % hobbies.length;
    hobbies[highlightedHobby].classList.add("featured");
});

nameInput.addEventListener("input", function () {
    showGreeting(nameInput.value.trim(), false);
    formMessage.textContent = "";
});

nameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = nameInput.value.trim();

    if (name === "") {
        formMessage.textContent = "Please enter your name.";
        formMessage.style.color = toneColor("error");
        nameInput.style.borderColor = toneColor("error");
        showGreeting("", false);
        return;
    }

    nameInput.style.borderColor = toneColor("success");
    formMessage.style.color = toneColor("success");
    formMessage.textContent = "Saved. This browser will remember your name.";
    showGreeting(name, false);
    writeStorage("visitorName", name);

    const tools = toolsSection();
    let note = document.querySelector(".welcome-note");
    if (!note) {
        note = document.createElement("p");
        note.className = "welcome-note";
        if (tools) {
            tools.appendChild(note);
        }
    }
    note.textContent = "Nice to meet you, " + name + ".";
});
