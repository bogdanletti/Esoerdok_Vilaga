
import Kerdes from "./Kerdes.js";
import { questionsData } from "./kerdesek.js";

let questions = [];
let current = 0;
let score = 0;

for (let data of questionsData) {
    questions.push(
        new Kerdes(data.id, data.question, data.answers, data.correct)
    );
}

function showQuestion() {
    let question = questions[current];

    document.getElementById("question").textContent = question.question;
    document.getElementById("answers").innerHTML = "";

    document.getElementById("progress-text").textContent =
        (current + 1) + " / " + questions.length;

    document.getElementById("progress-bar").style.width =
        ((current + 1) / questions.length * 100) + "%";

    for (let i = 0; i < question.answers.length; i++) {
        let button = document.createElement("button");

        button.textContent = question.answers[i];
        button.className = "answer-btn";

        button.onclick = function() {
            checkAnswer(i);
        };

        document.getElementById("answers").appendChild(button);
    }
}


showQuestion();
