import { fromEvent, merge } from 'rxjs'; 
import { map, filter, scan, throttleTime, distinctUntilChanged, bufferTime} from 'rxjs/operators';

import { KeysState } from './models';

const KEYS_INITIAL: KeysState = {
  ArrowUp: false,
  ArrowRight: false,
  ArrowDown: false,
  ArrowLeft: false,
};

const excludeOtherKeys = (e)=> ['ArrowUp','ArrowRight','ArrowDown','ArrowLeft'].includes(e);

// handle keydown
const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown')
  .pipe(
    map(e=> e.code),
    filter(excludeOtherKeys),
    map(code=> <KeyEvent>{code, attribute: 'keydown'}),
    // bufferTime(100),
    // map((frames: Array<any>) => {
    //   return frames.reduce((acc, curr) => {
    //     return Object.assign(acc, curr);
    //   }, {});
    // })
);

// handle keyup
const keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup')
  .pipe(
    map(e=> e.code),
    filter(excludeOtherKeys),
    map(code=> <KeyEvent>{code, attribute: 'keyup'}),
  );


// events to state
const keysState$ = merge(keyDown$, keyUp$)
  .pipe(
    scan((acc, event)=> ({
      ...acc,
      [event.code]: event.attribute === 'keydown',
    }), KEYS_INITIAL),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)), // emit only changes
  );
  
export {
  keysState$
};


interface KeyEvent{
  attribute: 'keydown' | 'keyup';
  code: string;
}
