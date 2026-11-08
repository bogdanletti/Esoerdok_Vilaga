
import Kerdes from "./Kerdes.js";
import { questionsData } from "./kerdesek.js";

let questions = [];
let current = 0;
let score = 0;

for (let data of questionsData) {
    questions.push(
        new Question(data.id, data.question, data.answers, data.correct)
    );
}

