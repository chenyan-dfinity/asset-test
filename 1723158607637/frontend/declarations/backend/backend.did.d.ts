import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Direction = { 'Up' : null } |
  { 'Down' : null } |
  { 'Left' : null } |
  { 'Right' : null };
export interface GameState {
  'direction' : Direction,
  'food' : Position,
  'score' : bigint,
  'snake' : Array<Position>,
  'gameOver' : boolean,
}
export interface Position { 'x' : bigint, 'y' : bigint }
export interface _SERVICE {
  'getGameState' : ActorMethod<[], GameState>,
  'moveSnake' : ActorMethod<[Direction], GameState>,
  'startNewGame' : ActorMethod<[], GameState>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
