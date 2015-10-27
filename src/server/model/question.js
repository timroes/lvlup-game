import * as utils from '../utils';

const timePerQuestion = 30; // in seconds

export default class Question {

	/**
	 * Create a question from the JSON imported from a question file.
	 */
	static parse(json) {
		if (json.type === 'choice') {
			return new ChoiceQuestion(json);
		} else {
			throw new Error(`Cannot generate question of unknown type '${json.type}'.`)
		}
	}

	constructor(json) {
		if (!json.type || !json.exp) {
			throw new Error(`Not all required attributes in parsing JSON.`);
		}
		this.type = json.type;
		
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
			type: this.type,
			exp: this.exp
		};
	}

	get timeRemaining() {
		return Math.max(0, this.endTime - Date.now());
	}

	start() {
		let remainingTime = timePerQuestion * 1000;
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
		let json = super.clientJson;
		json.question = this.question;
		json.answers = this.answers;
		return json;
	}

	validateAnswer(answer) {
		return answer.id === this.correctId;
	}

	get correctAnswer() {
		return this.correctId;
	}

}