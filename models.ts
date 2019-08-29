

export const MAX_BITE_SIZE = 20;

export enum Move {
  Up = 'Up',
  Right = 'Right',
  Down = 'Down',
  Left = 'Left',
};

export const BLOCK_SIZE: number = 16;


export const STATE_INITIAL: GameState = {
  move: Move.Right,
  mealSize: 0,

  tail: [{x: 0, y: 0}],
  bait: {x: 32, y: 32, size: 6},
}


export interface KeysState {
  ArrowUp: boolean;
  ArrowRight: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
}

export interface GameState {
  move: Move;
  mealSize: number;
  bait?: Bait;
  tail: Cor[];
}

export interface Bait extends Cor {
  size: number;
}

export interface Cor {
  x: number;
  y: number;
}

