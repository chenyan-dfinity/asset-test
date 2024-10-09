import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Utils "./utils";

actor {
  type Direction = { #Up; #Down; #Left; #Right };
  type Position = { x : Int; y : Int };
  type GameState = {
    snake : [Position];
    food : Position;
    direction : Direction;
    gameOver : Bool;
    score : Nat;
  };

  let boardSize = 20;
  let rand = Utils.Random64();

  func generateFood(snake : [Position]) : Position {
    var food : Position = { x = rand.getRangeFrom(0, boardSize); y = rand.getRangeFrom(0, boardSize) };
    label l loop {
      var collision = false;
      for (pos in snake.vals()) {
        if (pos.x == food.x and pos.y == food.y) {
          collision := true;
          break l;
        };
      };
      if (not collision) {
        return food;
      };
      food := { x = rand.getRangeFrom(0, boardSize); y = rand.getRangeFrom(0, boardSize) };
    };
    food
  };

  func initializeGame() : GameState {
    let snake = [{ x = 10; y = 10 }];
    {
      snake = snake;
      food = generateFood(snake);
      direction = #Right;
      gameOver = false;
      score = 0;
    }
  };

  var gameState : GameState = initializeGame();

  public func startNewGame() : async GameState {
    gameState := initializeGame();
    gameState
  };

  public func moveSnake(newDirection : Direction) : async GameState {
    if (gameState.gameOver) {
      return gameState;
    };

    let snakeBuffer = Buffer.fromArray<Position>(gameState.snake);
    let head = Option.get(snakeBuffer.getOpt(0), { x = 0; y = 0 });
    var newHead = switch (newDirection) {
      case (#Up) { { x = head.x; y = head.y - 1 } };
      case (#Down) { { x = head.x; y = head.y + 1 } };
      case (#Left) { { x = head.x - 1; y = head.y } };
      case (#Right) { { x = head.x + 1; y = head.y } };
    };

    // Wrap around the board
    newHead := {
      x = (newHead.x + boardSize) % boardSize;
      y = (newHead.y + boardSize) % boardSize;
    };

    // Check for collision with self
    for (pos in snakeBuffer.vals()) {
      if (pos.x == newHead.x and pos.y == newHead.y) {
        gameState := { gameState with gameOver = true };
        return gameState;
      };
    };

    snakeBuffer.insert(0, newHead);

    if (newHead.x == gameState.food.x and newHead.y == gameState.food.y) {
      // Snake ate food
      gameState := {
        gameState with
        food = generateFood(Buffer.toArray(snakeBuffer));
        score = gameState.score + 1;
      };
    } else {
      ignore snakeBuffer.removeLast();
    };

    gameState := {
      gameState with
      snake = Buffer.toArray(snakeBuffer);
      direction = newDirection;
    };
    gameState
  };

  public query func getGameState() : async GameState {
    gameState
  };

  stable var stableGameState : GameState = gameState;

  system func preupgrade() {
    stableGameState := gameState;
  };

  system func postupgrade() {
    gameState := stableGameState;
  };
}