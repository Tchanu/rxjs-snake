import { GameState, BLOCK_SIZE, MAX_BITE_SIZE } from './models';

const gameDom: HTMLElement = document.getElementById('game');


export function render(state: GameState): void {
  const ctx: CanvasRenderingContext2D = (<HTMLCanvasElement>gameDom).getContext('2d');
  ctx.clearRect(0, 0, gameDom.clientWidth, gameDom.clientHeight);

  // render all celss
  state.tail.forEach((cell) => {
    fill(ctx, cell);
  }); 

  // render baits
  fill(ctx, state.bait, 'red', (state.bait.size / MAX_BITE_SIZE) * BLOCK_SIZE + 8);
}


const fill = (ctx, cell, color = '#4caf50', size = BLOCK_SIZE) => {
    ctx.fillStyle = color;
    ctx.fillRect(cell.x, cell.y, size, size);
}