import * as utils from '../utils';

const timePerQuestionDefault = 20; // in seconds
const timePerQuestionFactor = 1.0;

export default class Question {

	/**
	 * Create a question from the JSON imported from a question file.
	 */
	static parse(json) {
		if (json.type === 'choice') {
			return new ChoiceQuestion(json);
		} else if (json.type === 'text') {
			return new TextQuestion(json);
		} else {
			throw new Error(`Cannot generate question of unknown type '${json.type}'.`)
		}
	}

	constructor(json) {
		if (!json.type || (!json.exp && json.exp !== 0) || !json.id) {
			throw new Error(`Not all required attributes in parsing JSON.`);
		}

		this.id = json.id;
		this.type = json.type;
		
		this.time = (json.time ? json.time * timePerQuestionFactor : timePerQuestionDefault) * 1000;
		this.exp = json.exp;
		this.winExp = this.exp;
		this.loseExp = -Math.ceil(this.exp * 0.5);

		this._json = json;
	}

	/**
	 * Returns the JSON object, that should be transmitted to the client.
	 * This should not contain any solution information anymore.
	 */
	get clientJson() {
		return {
			id: this.id,
			type: this.type,
			exp: this.exp,
			time: this.time,
			timeRemaining: this.timeRemaining,
			endsAt: this.endTime
		};
	}

	get timeRemaining() {
		return Math.max(0, this.endTime - Date.now());
	}

	start() {
		let remainingTime = this.time;
		this.endTime = Date.now() + remainingTime;
		return remainingTime;
	}

	expForAnswer(answer) {
		return this.validateAnswer(answer) ? this.winExp : this.loseExp;
	}

	validateAnswer(answer) {
		return false;
	}

	get correctAnswer() {
		return null;
	}
}

class ChoiceQuestion extends Question {

	constructor(json) {
		super(json);

		this.question = json.question;

		this.answers = [json.answer, ...json.wrongAnswers].map((a) => {
			return {
				id: utils.generateUUID(),
				answer: a
			};
		});
		this.correctId = this.answers[0].id;
		utils.shuffle(this.answers);
	}

	get clientJson() {
		return {
			...super.clientJson,
			question: this.question,
			answers: this.answers
		};
	}

	validateAnswer(answer) {
		return answer === this.correctId;
	}

	get correctAnswer() {
		return this.correctId;
	}

}

class TextQuestion extends Question {

	constructor(json) {
		super(json);

		this.question = json.question;
		this.answers = Array.isArray(json.answers) ? json.answers : [json.answers];
		this.solution = this.answers[0];
		this.answers = this.answers.map(this.normalizeAnswer);
	}

	get clientJson() {
		return {
			...super.clientJson,
			question: this.question
		};
	}

	validateAnswer(answer) {
		return this.answers.indexOf(this.normalizeAnswer(answer)) >= 0;
	}

	get correctAnswer() {
		return this.solution;
	}

	normalizeAnswer(answer) {
		return (answer || '').replace(/[\W_]/g, '').toLowerCase();
	}
}