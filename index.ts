import { fromEvent, merge , BehaviorSubject} from 'rxjs'; 
import { map, filter, tap, throttleTime, withLatestFrom, buffer, bufferTime} from 'rxjs/operators';

import { keysState$ } from './keystate';
import { frames$ } from './loop';
import * as Game from './game';
import * as Draw from './draw';
import { GameState, Move, STATE_INITIAL } from './models';



// use scan instead?
const gameState$ = new BehaviorSubject<GameState>(STATE_INITIAL);

// TODO: move into gamestate
let topScore = 0;

const scoreDom = document.getElementById('score');
const topScoreDom = document.getElementById('topScore');
const speedDom = document.getElementById('speed');

frames$
  .pipe(
    withLatestFrom(keysState$, gameState$),
    map(([deltaTime, keysDown, gameState]) => Game.tick(deltaTime, gameState, keysDown)),
    tap((gameState) => gameState$.next(gameState)),
    tap((gameState) => {
      const speed  = ((0.6 * Math.log(gameState.tail.length + 148)) - 2).toFixed(2);
      topScore = Math.max(gameState.tail.length,topScore);
      scoreDom.innerHTML = `${gameState.tail.length}`;
      topScoreDom.innerHTML = `${topScore}`;
      speedDom.innerHTML = `${speed}x`;
    }),
  )
  .subscribe(Draw.render);
