
import { GameState, KeysState, BLOCK_SIZE, Move, Cor , STATE_INITIAL, Bait, MAX_BITE_SIZE} from './models';

const SIZE = 32;

export function tick(deltaTime: number, gameState: GameState, keysState: KeysState): GameState {
  const head = gameState.tail[0];
  let move = getMove(keysState, gameState.move) || gameState.move;
  let nextTail = gameState.tail;

  

  const nextHead = getCellNextCord(move, head, deltaTime, (0.6 * Math.log(gameState.tail.length + 148)) - 2);

  // border
  // if(nextHead.x >= BLOCK_SIZE * (SIZE - 1) || nextHead.y < 0 || nextHead.y >= BLOCK_SIZE * (SIZE - 1)){
  //   return STATE_INITIAL;
  // }

  if(move === Move.Left && nextHead.x <= 0) {
    nextHead.x  = BLOCK_SIZE * (SIZE - 1);
  }
  if(move === Move.Up && nextHead.y < 0) {
    nextHead.y  = BLOCK_SIZE * (SIZE - 1);
  }
  if(move === Move.Right && nextHead.x >= BLOCK_SIZE * (SIZE - 1)) {
    nextHead.x = 0;
  }
  if(move === Move.Down && nextHead.y >= BLOCK_SIZE * (SIZE - 1)) {
    nextHead.y = 0;
  }



  // eating
  if(gameState.bait && collideWithBait(nextHead, gameState.bait)) {
    gameState.mealSize = gameState.mealSize + gameState.bait.size;
    gameState.bait = getRandomBait();
  } else {
    if(gameState.mealSize > 0) {
      gameState.mealSize = gameState.mealSize - 1;
    } else {
      nextTail = nextTail.slice(0, gameState.tail.length -1);
    }
  }

  // self
  for(let i = 10; i < nextTail.length; i++) {
    if(collide(nextHead, nextTail[i])){
      return STATE_INITIAL
    }
  }

  const nextGameState: GameState = {
    ...gameState,
    tail: [
      nextHead,
      ...nextTail,
    ],
    move,
  };
  return nextGameState;
}

// TODO: move to utils

const getCellNextCord = (move: Move, cell: Cor, deltaTime: number, blocksPerSeconds = 1): Cor => {
  const speed = blocksPerSeconds * BLOCK_SIZE * deltaTime;
  const step = BLOCK_SIZE * speed;
  switch(move){
    case Move.Up:
      return {
        x: cell.x,
        y: cell.y - step,
      };
    case Move.Right:
      return {
        x: cell.x + step,
        y: cell.y,
      };
    case Move.Down:
      return {
        x: cell.x,
        y: cell.y + step,
      };
    case Move.Left:
      return {
        x: cell.x - step,
        y: cell.y,
      };
    default: 
      throw new Error('bad Move');
  }
}


const getMove = (keysState: KeysState, currentMove: Move): Move => {
  if(keysState.ArrowUp && currentMove !== Move.Up && currentMove !== Move.Down) return Move.Up;
  if(keysState.ArrowRight && currentMove !== Move.Right && currentMove !== Move.Left) return Move.Right;
  if(keysState.ArrowDown && currentMove !== Move.Down && currentMove !== Move.Up) return Move.Down;
  if(keysState.ArrowLeft && currentMove !== Move.Left && currentMove !== Move.Right) return Move.Left;
  return currentMove;
}

const cellIsOutOfTheArea = (cell: Cor) => {
  return cell != null && (cell.x < 0 || cell.y < 0);
}

const getDistance = (a: Cor, b: Cor): number => Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);

const collide = (cellA: Cor, cellB: Cor): boolean => {
  return getDistance(cellA, cellB) < BLOCK_SIZE;
}

const collideWithBait = (cellA: Cor, bait: Bait): boolean => {
  return getDistance(cellA, {x: bait.x, y: bait.y}) <= (bait.size / MAX_BITE_SIZE) * BLOCK_SIZE + 8;
}

const getRandomBait = (): Bait => {
  const generatePoint = () => Math.floor(((Math.random() * (SIZE - 1) * BLOCK_SIZE)/ BLOCK_SIZE)) * BLOCK_SIZE;
  return {
    x: generatePoint(),
    y: generatePoint(),
    size: Math.floor(Math.random() * MAX_BITE_SIZE) + 2,
  }
}