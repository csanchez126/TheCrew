import { CommStatus, GameState, PlayerStatus, Suit } from "../enums";
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
      for (let i = 1; i <= 4; i += 1) {
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
      this.tasks = this.tasks.filter(
        (task) => !(task.suit === card.suit && task.value === card.value)
      );
      currentPlayer.isTurn = false;
      nextPlayer.isTurn = true;
      console.log(this.players.map((p) => p.isTurn));
      if (this.tasks.length === 0) {
        this.state = GameState.TrickSetup;
      }
    }
  };

  public selectCommunicationCard = (turn: Turn) => {
    console.log(turn);
    const { card, playerID } = turn;
    const player = this.getPlayer(playerID);
    if (this.communicationCardValid(turn)) {
      player.hand = player.hand.map((c) => {
        if (c.value === card.value && c.suit === card.suit) {
          c = card;
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
  };

  public setCommunicationStatus = (playerID: string, status: PlayerStatus) => {
    this.setPlayerStatus(playerID, status);
    if (this.isEveryPlayerReady()) {
      this.state = GameState.TrickOngoing;
    }
  };

  public setPlayerStatus = (playerID: string, status: PlayerStatus) => {
    const player = this.getPlayer(playerID);
    player.status = status;
  };

  public startTrick = () => {
    this.state = GameState.TrickOngoing;
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
      } else {
        this.computeTrickWinner(turn);
      }
    }
  };

  public computeTrickWinner = (turn: Turn) => {
    let values: number[];
    if (turn.card.suit === Suit.Rocket) {
      values = this.trick.cards
        .filter((c) => c.suit === Suit.Rocket)
        .map((c) => c.value);
    } else if (this.trick.suit === turn.card.suit) {
      values = this.trick.cards
        .filter((c) => c.suit === this.trick.suit)
        .map((c) => c.value);
    }
    if (Math.max(...values, turn.card.value) === turn.card.value) {
      this.currentTrickWinner = this.getPlayer(turn.playerID);
    }
  };

  public computeTrickEnd = (turn: Turn) => {
    const trickWinner = this.currentTrickWinner;
    console.log("trickWinner", trickWinner.name);
    const { card } = turn;
    let trickValid = false;

    // Check if trick winner has task
    //   Check task requirement
    //      If valid, trick won, game continues
    this.trick.cards.forEach((gameTrick) => {
      if (
        trickWinner.tasks.some(
          (task) =>
            gameTrick.suit === task.suit && gameTrick.value === task.value
        )
      ) {
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
          if (
            player.tasks.some(
              (task) =>
                gameTrick.suit === task.suit && gameTrick.value === task.value
            )
          ) {
            if (!trickValid) {
              console.log("someone else should have won this task :(");
            }
          }
        });
      });
  };

  public removeTurnCard = (turn: Turn) => {
    const player = this.getPlayer(turn.playerID);
    const card = turn.card;
    player.hand = player.hand.filter(
      (c) => !(c.suit === card.suit && c.value === card.value)
    );
  };

  public moveIsValid = (turn: Turn): boolean => {
    const { playerID, card } = turn;
    const player = this.getPlayer(playerID);
    const trickStarted = this.trick != null && this.trick.suit != null;

    console.log("played: ", card);
    const isTurn = player.isTurn;
    const hasCard = player.hand.some(
      (c) => c.suit === card.suit && c.suit === card.suit
    );
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

    const gameHasRequiredSuit = this.tasks.some(
      (task) => task.suit === card.suit && task.value === card.value
    );

    return gameHasRequiredSuit && isTurn;
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
}
