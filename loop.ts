import { Observable, of } from 'rxjs'; 
import { map, expand, filter, share, throttleTime} from 'rxjs/operators';


const calculateStep: (prevFrame: IFrameData) => Observable<IFrameData> = (prevFrame: IFrameData) => {
  return Observable.create((observer) => { 
    
    requestAnimationFrame((frameStartTime) => {      
      // Millis to seconds
      const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime)/1000 : 0;
      observer.next({
        frameStartTime,
        deltaTime
      });
    })
  })
  .pipe(
    map((frame: IFrameData) => {
    if(frame.deltaTime > (1/15)) {
        frame.deltaTime = 1/15;
      }
      return frame;
    }),
  )
};

const frames$ = of(undefined)
  .pipe(
    expand((val) => calculateStep(val)),
    // Expand emits the first value provided to it, and in this
    //  case we just want to ignore the undefined input frame
    filter(frame => frame != null),
    map((frame: IFrameData) => frame.deltaTime),
    share(),
    // throttleTime(300),
  );

export {
  frames$
};

interface IFrameData {
  frameStartTime: number;
  deltaTime: number;
}