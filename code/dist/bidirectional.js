/*
Circlar(bidirectional) dependency

width@A = width@ALL - width@B
width@B = width@ALL - width@A
width@ALL = 500px

The whole elements are automatically set
  according to the changes of each elements
*/
import { T, world } from "../../node_modules/timeline-monad/code/dist/timeline-monad.js";
import { allThenResetTL } from "../..//node_modules/timeline-monad/code/dist/allThenResetTL.js";
const aTL = T(self => bTL.sync(b => // aTL depends on bTL
 self.now = (self.now !== allTL.now - b) //if not fixed-point
    ? allTL.now - b //update aTL
    : bTL.now = undefined //aTL.now = bTL.now = undefined
));
const bTL = T(self => aTL.sync(a => // bTL depends on aTL
 self.now = (self.now !== allTL.now - a) //if not fixed-point
    ? allTL.now - a //update bTL
    : aTL.now = undefined //bTL.now = aTL.now = undefined
));
const allTL = T(self => self.sync(all => // on allTL change
 aTL.now = (dataTL.now === undefined) //bTL.now=..is also fine
    ? undefined
    : (a => b => all * (a / (a + b))) //keep ratio of a,b
    (dataTL.now[0])(dataTL.now[1])));
const dataTL = T(self => //data is atomic update of aTL & bTL
 allThenResetTL([aTL, bTL]).sync(ab => (self.now = [...ab, allTL.now]) &&
    console.info("a, b, all", self.now)));
const initTL = T(self => {
    world.now = dataTL;
    world.now = allTL;
    world.now = aTL;
    world.now = bTL;
    const f0 = () => allTL.now = 500;
    const f1 = () => aTL.now = 100;
    const f2 = () => aTL.now = 200;
    const f3 = () => bTL.now = 50;
    const f4 = () => allTL.now = 1000;
    setTimeout(f0, 0); //widh 500
    setTimeout(f1, 10);
    setTimeout(f2, 20);
    setTimeout(f2, 30); //repeat 
    setTimeout(f3, 40);
    setTimeout(f4, 50); //width 1000
    setTimeout(f1, 60);
    setTimeout(f3, 70);
    setTimeout(f0, 80); //widh 500
    setTimeout(f2, 90);
});
world.now = initTL; // data connect to the real world
