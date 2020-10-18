import { cardsEqual } from "../utils/GameUtils";
import {
  CommStatus,
  GameState,
  PlayerStatus,
  Suit,
  TaskPriority,
} from "../enums";
import { Card, Player, Task, Trick, Turn } from "./";

export class Game {
  gameID: string;
  players: Player[];
  tasks: Task[] = [];
  trick: Trick;
  currentTrickWinner: Player;
  taskCount: number = 2;
  state: GameState;

  constructor(gameID: string, players: Player[]) {
    this.players = players;
    this.gameID = gameID;
    this.state = GameState.MissionStart;
  }

  public generateDeck = () => {
    const gameDeck: Card[] = [];
    const suitInts = Object.values(Suit).filter((val) => !isNaN(val as any));
    // Generate a game deck
    suitInts.forEach((suit) => {
      for (let i = 1; i <= 9; i += 1) {
        if (suit === Suit.Rocket && i > 4) {
          continue;
        } else {
          gameDeck.push(new Card(suit as Suit, i));
        }
      }
    });
    // Shuffle deck
    gameDeck.sort(() => Math.random() - 0.5);
    return gameDeck;
  };

  public generateTaskDeck = () => {
    const taskDeck: Task[] = this.generateDeck()
      .map((card) => card as Task)
      .filter((task) => task.suit !== Suit.Rocket);

    // Shuffle tasks
    taskDeck.sort(() => Math.random() - 0.5);
    return taskDeck;
  };

  public setupGame = () => {
    this.setupMission();

    const taskDeck: Task[] = this.generateTaskDeck();
    this.tasks = taskDeck.splice(0, this.taskCount);

    this.state = GameState.TaskSelection;
    console.log(this.tasks);
  };

  public setupMission = () => {
    const gameDeck: Card[] = this.generateDeck();
    // Distribute cards
    gameDeck.forEach((card, i) => {
      this.players[i % this.players.length].hand.push(card);

      // Give first player token
      if (card.suit === Suit.Rocket && card.value === 4) {
        this.players[i % this.players.length].isCommander = true;
        this.players[i % this.players.length].isFirstPlayer = true;
        this.players[i % this.players.length].isTurn = true;
      }
    });

    this.players.forEach((player: Player) => {
      player.hand = player.hand.sort((a: Card, b: Card) => {
        if (a.suit < b.suit) return -1;
        if (a.suit > b.suit) return 1;
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
      });
    });
    this.trick = new Trick();
  };

  public getPlayer = (id: string) => {
    return this.players.find((player: Player) => player.socketID === id);
  };

  public getNextPlayer = (id: string) => {
    const index = this.players.findIndex(
      (player: Player) => player.socketID === id
    );
    if (index === this.players.length - 1) {
      return this.players[0];
    } else {
      return this.players[index + 1];
    }
  };

  public isLastPlayer = (player: Player) => {
    return this.getNextPlayer(player.name).isFirstPlayer;
  };

  public selectTask = (turn: Turn) => {
    const { playerID, card } = turn;
    const currentPlayer = this.getPlayer(playerID);
    const nextPlayer = this.getNextPlayer(playerID);
    if (this.taskChoiceIsValid(turn)) {
      currentPlayer.tasks.push(card as Task);
      this.tasks = this.tasks.filter((task) => !cardsEqual(card, task));
      currentPlayer.isTurn = false;
      nextPlayer.isTurn = true;
      console.log(this.players.map((p) => p.isTurn));
      if (this.tasks.length === 0) {
        this.state = GameState.TrickSetup;
      }
    }
  };

  public selectCommunicationCard = (turn: Turn) => {
    const { card, playerID } = turn;
    const player = this.getPlayer(playerID);
    if (this.communicationCardValid(turn)) {
      player.hand = player.hand.map((c) => {
        if (cardsEqual(c, card)) {
          c = card;
          player.communicatedCard = card;
        } else {
          // Make sure no other card get flagged for comm
          c.commStatus = CommStatus.None;
        }
        return c;
      });
    }
  };

  public cancelCommunication = (playerID: string) => {
    const player = this.getPlayer(playerID);
    player.hand.forEach((c) => {
      c.commStatus = CommStatus.None;
    });
    player.communicatedCard = null;
  };

  public setCommunicationStatus = (playerID: string, status: PlayerStatus) => {
    this.setPlayerStatus(playerID, status);
    if (this.isEveryPlayerReady()) {
      this.startTrick();
    }
  };

  public setPlayerStatus = (playerID: string, status: PlayerStatus) => {
    const player = this.getPlayer(playerID);
    player.status = status;
  };

  public startTrick = () => {
    this.state = GameState.TrickOngoing;
    this.players.forEach((p) => (p.status = PlayerStatus.ActionPending));
    this.trick = new Trick();
  };

  public isEveryPlayerReady = () => {
    return this.players.every((p) => p.status === PlayerStatus.Standby);
  };

  public playTurn = (turn: Turn) => {
    const { playerID, card } = turn;
    const currentPlayer = this.getPlayer(playerID);
    const nextPlayer = this.getNextPlayer(playerID);

    if (this.moveIsValid(turn)) {
      this.removeTurnCard(turn);
      this.trick.turns.push(turn);
      currentPlayer.isTurn = false;
      nextPlayer.isTurn = true;
      // First move
      if (this.trick.turns.length === 1) {
        this.trick.suit = card.suit;
      }
      // Last move
      else if (this.trick.turns.length === this.players.length) {
        this.computeTrickWinner(turn);
      } else {
        this.computeTrickWinner(turn);
      }
      this.computeTrickEnd(turn);
    }
  };

  public computeTrickWinner = (turn: Turn) => {
    let values: number[];
    if (turn.card.suit === Suit.Rocket) {
      values = this.trick.turns
        .filter((trickTurn) => trickTurn.card.suit === Suit.Rocket)
        .map((trickTurn) => trickTurn.card.value);
    } else if (this.trick.suit === turn.card.suit) {
      values = this.trick.turns
        .filter((trickTurn) => trickTurn.card.suit === this.trick.suit)
        .map((trickTurn) => trickTurn.card.value);
    }
    if (Math.max(...values, turn.card.value) === turn.card.value) {
      this.currentTrickWinner = this.getPlayer(turn.playerID);
    }
  };

  public computeTrickEnd = (turn: Turn) => {
    const trickWinner = this.currentTrickWinner;
    console.log("trickWinner", trickWinner.name);
    let trickValid = true;

    // Check if trick winner accomplished on of his tasks
    const accomplishedTask = this.getAccomplishedTask(trickWinner);
    if (accomplishedTask !== undefined) {
      console.log("winner has accomplished mission");
      if (this.defaultTrickValidation(accomplishedTask)) {
        this.removeTask(trickWinner, accomplishedTask);
      } else {
        trickValid = false;
      }
    } else {
      // Else check if someone else has it
      //      if someone else has it, game ends
      // Else game continues
      this.players
        .filter((p) => p.name !== turn.playerID)
        .forEach((player) => {
          this.trick.turns.forEach((gameTrick) => {
            if (player.tasks.some((c) => cardsEqual(c, gameTrick.card))) {
              trickValid = false;
            }
          });
        });
    }

    if (trickValid && this.players.every((p) => p.tasks.length === 0)) {
      this.state = GameState.MissionVictory;
    } else if (trickValid) {
      this.state = GameState.TrickSetup;
    } else {
      this.state = GameState.MissionFailed;
    }
  };

  public getAccomplishedTask = (player: Player) => {
    let accomplishedTask: Task = null;
    this.trick.turns.forEach((trickTurn) => {
      accomplishedTask = player.tasks.find((c) =>
        cardsEqual(trickTurn.card, c)
      );
    });
    return accomplishedTask;
  };

  public defaultTrickValidation = (task: Task) => {
    switch (task.priority) {
      case TaskPriority.Omega:
        return this.tasks.length === 1 && cardsEqual(this.tasks[0], task);
      case TaskPriority.First:
        return this.tasks.length === this.taskCount;
      case TaskPriority.Second:
        return this.tasks.length === this.taskCount - 1;
      case TaskPriority.Third:
        return this.tasks.length === this.taskCount - 2;
      case TaskPriority.Fourth:
        return this.tasks.length === this.taskCount - 3;
      case TaskPriority.Fifth:
        return this.tasks.length === this.taskCount - 4;
      case TaskPriority.OneRelative:
        return this.tasks.some((t) => t.priority === TaskPriority.TwoRelative);
      case TaskPriority.TwoRelative:
        return this.tasks.every((t) => t.priority !== TaskPriority.OneRelative);
      case TaskPriority.ThreeRelative:
        return this.tasks.every(
          (t) =>
            t.priority !== TaskPriority.OneRelative &&
            t.priority !== TaskPriority.TwoRelative
        );
      case TaskPriority.FourRelative:
        return this.tasks.every(
          (t) =>
            t.priority !== TaskPriority.OneRelative &&
            t.priority !== TaskPriority.TwoRelative &&
            t.priority !== TaskPriority.ThreeRelative
        );
      default:
        return true;
    }
  };

  public removeTurnCard = (turn: Turn) => {
    const player = this.getPlayer(turn.playerID);
    const card = turn.card;
    player.hand = player.hand.filter((c) => !cardsEqual(c, card));
  };

  public moveIsValid = (turn: Turn): boolean => {
    const { playerID, card } = turn;
    const player = this.getPlayer(playerID);
    const trickStarted = this.trick != null && this.trick.suit != null;

    console.log("played: ", card);
    const isTurn = player.isTurn;
    const hasCard = player.hand.some((c) => cardsEqual(c, card));
    const hasRequiredSuit =
      trickStarted && player.hand.some((c) => this.trick.suit === c.suit);

    const isValid =
      this.state === GameState.TrickOngoing &&
      (card.suit === Suit.Rocket ||
        (this.trick != null && card.suit === this.trick.suit) ||
        !hasRequiredSuit);

    return isTurn && hasCard && (!trickStarted || isValid);
  };

  public taskChoiceIsValid = (turn: Turn): boolean => {
    const { playerID, card } = turn;
    const player = this.getPlayer(playerID);

    console.log(player.name, "chose: ", card);
    const isTurn = player.isTurn;

    const gameHasRequiredTask = this.tasks.some((c) => cardsEqual(c, card));

    return gameHasRequiredTask && isTurn;
  };

  public communicationCardValid = (turn: Turn): boolean => {
    const { card, playerID } = turn;
    let isValid: boolean = card.suit !== Suit.Rocket;
    if (isValid) {
      const player = this.getPlayer(playerID);
      const filteredHandValues = player.hand
        .filter((handCard) => handCard.suit === card.suit)
        .map((c) => c.value);
      switch (card.commStatus) {
        case CommStatus.Highest:
          isValid = isValid && Math.max(...filteredHandValues) === card.value;
          break;
        case CommStatus.Lowest:
          isValid = isValid && Math.min(...filteredHandValues) === card.value;
          break;
        case CommStatus.Only:
          isValid =
            isValid &&
            filteredHandValues.length === 1 &&
            filteredHandValues[0] === card.value;
          break;
        case CommStatus.None:
          isValid = false;
          break;
      }
    }
    return isValid;
  };

  public removeTask = (player: Player, task: Task) => {
    player.tasks = player.tasks.filter((t) => !cardsEqual(t, task));
  };

  public resetTrick = () => {
    this.currentTrickWinner.isFirstPlayer = true;
    this.trick = new Trick();
    this.players.forEach((p) => {
      p.status = PlayerStatus.ActionPending;
    });
  };
}
