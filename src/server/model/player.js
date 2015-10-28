const expPerLevel = 100;

export default class Player {

	constructor(sessId, username) {
		this.sessionId = sessId;
		this.username = username;
		this.exp = 0;
		this.lostExp = 0;
		this.level = 1;
		this.socket = null;
	}

	get infos() {
		return {
			username: this.username,
			exp: this.exp,
			level: this.level
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
		// TODO: level up and down properly
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

	emit() {
		if (this.socket) {
			this.socket.emit.apply(this.socket, arguments);
		}
	}

	emitHighscore(highscores) {
		this.emit('highscore', {
			topscores: highscores,
			myrank: this.rank
		});
	}

}
