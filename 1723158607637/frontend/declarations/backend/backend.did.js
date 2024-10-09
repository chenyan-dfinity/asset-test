export const idlFactory = ({ IDL }) => {
  const Direction = IDL.Variant({
    'Up' : IDL.Null,
    'Down' : IDL.Null,
    'Left' : IDL.Null,
    'Right' : IDL.Null,
  });
  const Position = IDL.Record({ 'x' : IDL.Int, 'y' : IDL.Int });
  const GameState = IDL.Record({
    'direction' : Direction,
    'food' : Position,
    'score' : IDL.Nat,
    'snake' : IDL.Vec(Position),
    'gameOver' : IDL.Bool,
  });
  return IDL.Service({
    'getGameState' : IDL.Func([], [GameState], ['query']),
    'moveSnake' : IDL.Func([Direction], [GameState], []),
    'startNewGame' : IDL.Func([], [GameState], []),
  });
};
export const init = ({ IDL }) => { return []; };
