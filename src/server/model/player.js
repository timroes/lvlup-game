import SafeSocket from '../socket/safeSocket';

const expPerLevel = 100;

export default class Player extends SafeSocket {

	constructor(sessId, username) {
		super();
		this.sessionId = sessId;
		this.username = username;
		this.exp = 0;
		this.lostExp = 0;
		this.level = 1;
		this.stats = {
			correct: 0,
			wrong: 0,
			noanswer: 0
		};
	}

	get infos() {
		return {
			username: this.username,
			exp: this.exp,
			level: this.level
		};
	}

	get infosForAdmin() {
		return {
			username: this.username,
			level: this.level,
			exp: this.exp,
			totalExp: this.totalExp,
			stats: this.stats
		};
	}

	get lvlInfos() {
		return {
			exp: this.exp,
			level: this.level
		};
	}

	get totalExp() {
		return (this.level - 1) * expPerLevel + this.exp;
	}

	lvlup(exp) {
		if (exp < 0) {
			this.exp = Math.max(this.exp + exp, 0);
			this.lostExp -= exp;
		} else {
			let tmpExp = this.exp + exp;
			let lvlsup = Math.floor(tmpExp / expPerLevel);
			this.level += lvlsup;
			this.exp = tmpExp % expPerLevel;
		}
	}

}
