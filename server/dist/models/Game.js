"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const enums_1 = require("../enums");
const _1 = require("./");
class Game {
    constructor(gameID, socketIDs) {
        this.tasks = [];
        this.taskCount = 6;
        this.generateDeck = () => {
            const gameDeck = [];
            const suitInts = Object.values(enums_1.Suit).filter((val) => !isNaN(val));
            // Generate a game deck
            suitInts.forEach((suit) => {
                for (let i = 1; i <= 9; i += 1) {
                    if (suit === enums_1.Suit.Rocket && i > 4) {
                        continue;
                    }
                    else {
                        gameDeck.push(new _1.Card(suit, i));
                    }
                }
            });
            // Shuffle deck
            gameDeck.sort(() => Math.random() - 0.5);
            return gameDeck;
        };
        this.generateTaskDeck = () => {
            const taskDeck = this.generateDeck()
                .map((card) => card)
                .filter((task) => task.suit !== enums_1.Suit.Rocket);
            // Shuffle tasks
            taskDeck.sort(() => Math.random() - 0.5);
            return taskDeck;
        };
        this.setupGame = () => {
            this.setupMission();
            // Task distribution
            const taskDeck = this.generateTaskDeck();
            this.tasks = taskDeck.splice(0, this.taskCount);
            // For temporary task distribution
            const firstPlayerIndex = this.players.findIndex((p) => p.isFirstPlayer);
            // Distribute tasks
            this.tasks.forEach((task, i) => {
                this.players[(i + firstPlayerIndex) % this.players.length].tasks.push(task);
            });
            console.log(this.tasks);
        };
        this.setupMission = () => {
            const gameDeck = this.generateDeck();
            // Distribute cards
            gameDeck.forEach((card, i) => {
                this.players[i % this.players.length].hand.push(card);
                // Give first player token
                if (card.suit === enums_1.Suit.Rocket && card.value === 4) {
                    this.players[i % this.players.length].isCommander = true;
                    this.players[i % this.players.length].isFirstPlayer = true;
                    this.players[i % this.players.length].isTurn = true;
                }
            });
            this.players.forEach((player) => {
                player.hand = player.hand.sort((a, b) => {
                    if (a.suit < b.suit)
                        return -1;
                    if (a.suit > b.suit)
                        return 1;
                    if (a.value < b.value)
                        return -1;
                    if (a.value > b.value)
                        return 1;
                });
            });
            this.trick = new _1.Trick();
        };
        this.getPlayer = (id) => {
            return this.players.find((player) => player.name === id);
        };
        this.getNextPlayer = (id) => {
            const index = this.players.findIndex((player) => player.name === id);
            if (index === this.players.length - 1) {
                return this.players[0];
            }
            else {
                return this.players[index + 1];
            }
        };
        this.isLastPlayer = (player) => {
            return this.getNextPlayer(player.name).isFirstPlayer;
        };
        this.playTurn = (turn) => {
            const { playerID, card } = turn;
            const currentPlayer = this.getPlayer(playerID);
            const nextPlayer = this.getNextPlayer(playerID);
            if (this.moveIsValid(turn)) {
                this.removeTurnCard(turn);
                this.trick.cards.push(card);
                currentPlayer.isTurn = false;
                nextPlayer.isTurn = true;
                // First move
                if (this.trick.cards.length === 1) {
                    this.trick.suit = card.suit;
                    this.currentTrickWinner = currentPlayer;
                }
                // Last move
                else if (this.trick.cards.length === this.players.length) {
                    this.computeTrickWinner(turn);
                    this.computeTrickEnd(turn);
                }
                else {
                    this.computeTrickWinner(turn);
                }
            }
        };
        this.computeTrickWinner = (turn) => {
            let values;
            if (turn.card.suit === enums_1.Suit.Rocket) {
                values = this.trick.cards
                    .filter((c) => c.suit === enums_1.Suit.Rocket)
                    .map((c) => c.value);
            }
            else if (this.trick.suit === turn.card.suit) {
                values = this.trick.cards
                    .filter((c) => c.suit === this.trick.suit)
                    .map((c) => c.value);
            }
            if (Math.max(...values, turn.card.value) === turn.card.value) {
                this.currentTrickWinner = this.getPlayer(turn.playerID);
            }
        };
        this.computeTrickEnd = (turn) => {
            const trickWinner = this.currentTrickWinner;
            console.log("trickWinner", trickWinner.name);
            const { card } = turn;
            let trickValid = false;
            // Check if trick winner has task
            //   Check task requirement
            //      If valid, trick won, game continues
            this.trick.cards.forEach((gameTrick) => {
                if (trickWinner.tasks.some((task) => gameTrick.suit === task.suit && gameTrick.value === task.value)) {
                    // Should check task req here?
                    trickValid = true;
                    console.log("winner has accomplished mission");
                }
            });
            // Else check if someone else has it
            //      if someone else has it, game ends
            // Else game continues
            this.players
                .filter((p) => p.name !== turn.playerID)
                .forEach((player) => {
                this.trick.cards.forEach((gameTrick) => {
                    if (player.tasks.some((task) => gameTrick.suit === task.suit && gameTrick.value === task.value)) {
                        if (!trickValid) {
                            console.log("someone else should have won this task :(");
                        }
                    }
                });
            });
        };
        this.removeTurnCard = (turn) => {
            const player = this.getPlayer(turn.playerID);
            const card = turn.card;
            player.hand = player.hand.filter((c) => !(c.suit === card.suit && c.value === card.value));
        };
        this.moveIsValid = (turn) => {
            const { playerID, card } = turn;
            const player = this.getPlayer(playerID);
            const trickStarted = this.trick != null && this.trick.suit != null;
            console.log("played: ", card);
            const isTurn = player.isTurn;
            const hasCard = player.hand.some((c) => c.suit === card.suit && c.suit === card.suit);
            const hasRequiredSuit = trickStarted && player.hand.some((c) => this.trick.suit === c.suit);
            const isValid = card.suit === enums_1.Suit.Rocket ||
                (this.trick != null && card.suit === this.trick.suit) ||
                !hasRequiredSuit;
            return isTurn && hasCard && (!trickStarted || isValid);
        };
        this.players = socketIDs.map((id) => new _1.Player(id));
        this.gameID = gameID;
        this.state = enums_1.GameState.MissionStart;
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map