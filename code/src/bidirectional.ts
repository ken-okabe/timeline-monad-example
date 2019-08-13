import { T, world } from "../../node_modules/timeline-monad/code/dist/timeline-monad.js";

const eventTL = T(self => {
    const f = () => (self.now = "Hello timeline!");
    setTimeout(f, 1000);
});

const timeline3 = eventTL.sync(a => console.log(a));

world.now = eventTL;