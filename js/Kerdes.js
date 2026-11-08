
export default class Question {

    constructor(id, question, answers, correct) {
        this.id = id;
        this.question = question;
        this.answers = answers;
        this.correct = correct;
    }

    isCorrect(answerIndex) {
        return answerIndex === this.correct;
    }
}
