import React, { useState, useEffect, useCallback } from 'react';
import { backend } from '../../declarations/backend';

type Direction = 'Up' | 'Down' | 'Left' | 'Right';
type Position = { x: number; y: number };
type GameState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  gameOver: boolean;
  score: number;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const fetchGameState = useCallback(async () => {
    const state = await backend.getGameState();
    setGameState({
      snake: state.snake,
      food: state.food,
      direction: state.direction,
      gameOver: state.gameOver,
      score: Number(state.score),
    });
  }, []);

  useEffect(() => {
    fetchGameState();
  }, [fetchGameState]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState?.gameOver) return;

      let newDirection: Direction;
      switch (event.key) {
        case 'ArrowUp':
          newDirection = 'Up';
          break;
        case 'ArrowDown':
          newDirection = 'Down';
          break;
        case 'ArrowLeft':
          newDirection = 'Left';
          break;
        case 'ArrowRight':
          newDirection = 'Right';
          break;
        default:
          return;
      }

      moveSnake(newDirection);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState && !gameState.gameOver) {
      const gameLoop = setInterval(() => {
        moveSnake(gameState.direction);
      }, 200);

      return () => clearInterval(gameLoop);
    }
  }, [gameState]);

  const moveSnake = async (direction: Direction) => {
    const variant = '#' + direction;
    const newState = await backend.moveSnake({ [variant]:null });
    setGameState({
      snake: newState.snake,
      food: newState.food,
      direction: newState.direction,
      gameOver: newState.gameOver,
      score: Number(newState.score),
    });
  };

  const startNewGame = async () => {
    const newState = await backend.startNewGame();
    setGameState({
      snake: newState.snake,
      food: newState.food,
      direction: newState.direction,
      gameOver: newState.gameOver,
      score: Number(newState.score),
    });
  };

  if (!gameState) return <div>Loading...</div>;

  return (
    <div className="game-container">
      <div className="game-board">
        {Array.from({ length: 20 }, (_, y) =>
          Array.from({ length: 20 }, (_, x) => {
            const isSnake = gameState.snake.some(pos => pos.x === x && pos.y === y);
            const isFood = gameState.food.x === x && gameState.food.y === y;
            return (
              <div
                key={`${x}-${y}`}
                className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
              />
            );
          })
        )}
      </div>
      <div className="controls">
        <button onClick={() => moveSnake('Up')}>Up</button>
        <button onClick={() => moveSnake('Down')}>Down</button>
        <button onClick={() => moveSnake('Left')}>Left</button>
        <button onClick={() => moveSnake('Right')}>Right</button>
      </div>
      <div className="score">Score: {gameState.score}</div>
      {gameState.gameOver && (
        <div className="game-over">
          Game Over!
          <button onClick={startNewGame}>Start New Game</button>
        </div>
      )}
    </div>
  );
};

export default App;
