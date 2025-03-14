let firstBuzz = null;
let lastBuzz = null;
let timerInterval = null;
let buzzOrder = [];
let submittedAnswers = new Set();

function login() {
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    if (password === "Discordbattle") { // Passwortprüfung
        document.getElementById("login").classList.add("hidden");
        document.getElementById("quiz").classList.remove("hidden");
        localStorage.setItem("userName", name); // Speichern des Namens
    } else {
        alert("Falsches Passwort!");
    }
}

function buzz() {
    const name = localStorage.getItem("userName");

    if (!buzzOrder.includes(name)) {
        buzzOrder.push(name);
        updateBuzzList();
        if (!firstBuzz) {
            firstBuzz = name;
        }
        lastBuzz = name;
    }
}

function updateBuzzList() {
    const buzzList = document.getElementById("buzzList");
    buzzList.innerHTML = buzzOrder.map((name, index) => {
        let label = `${index + 1}. ${name}`;
        if (name === firstBuzz) label += " (Schnellster)";
        if (name === lastBuzz) label += " (Letzter)";
        return `<div>${label}</div>`;
    }).join("");
}

function startTimer() {
    const duration = document.getElementById("timer").value;
    let time = duration;
    document.getElementById("time").innerText = time;

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        time--;
        document.getElementById("time").innerText = time;
        if (time <= 0) {
            clearInterval(timerInterval);
            submitAnswers();
        }
    }, 1000);
}

function submitAnswer() {
    const name = localStorage.getItem("userName");
    if (submittedAnswers.has(name)) {
        alert("Du hast bereits eine Antwort gesendet.");
        return;
    }

    const answer = document.getElementById("answer").value;
    if (answer) {
        localStorage.setItem(`answer_${name}`, answer);
        submittedAnswers.add(name);
        alert("Antwort gesendet!");
        displayAnswers();
    } else {
        alert("Bitte eine Antwort eingeben.");
    }
}

function submitAnswers() {
    const name = localStorage.getItem("userName");
    const answer = document.getElementById("answer").value;
    if (answer && !submittedAnswers.has(name)) {
        localStorage.setItem(`answer_${name}`, answer);
        submittedAnswers.add(name);
    }
    alert("Zeit abgelaufen! Antworten wurden gesendet.");
    displayAnswers();
}

function displayAnswers() {
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = ""; // Löscht den aktuellen Inhalt

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("answer_")) {
            const name = key.split("_")[1];
            const answer = localStorage.getItem(key);
            const answerElement = document.createElement("div");
            answerElement.innerHTML = `<strong>${name}:</strong> ${answer}`;
            answersDiv.appendChild(answerElement);
        }
    }
}

function resetBuzzers() {
    firstBuzz = null;
    lastBuzz = null;
    buzzOrder = [];
    updateBuzzList();
    resetAnswers();
}

function resetAnswers() {
    submittedAnswers.clear();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("answer_")) {
            localStorage.removeItem(key);
        }
    }
    document.getElementById("answers").innerHTML = "";
}
