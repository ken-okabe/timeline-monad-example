import { T, world } from "../../node_modules/timeline-monad/code/dist/timeline-monad.js";
import { allThenResetTL } from "../..//node_modules/timeline-monad/code/dist/allThenResetTL.js";
/*
「Aの幅」= 「全体の幅」-「Bの幅」
「Bの幅」= 「全体の幅」-「Aの幅」
「全体の幅」= 500ピクセル
という式の場合は、「Aの幅」と「Bの幅」を両方満たすような解が存在します
ユーザーが画面上のウィジェットを操作して
「Aの幅」あるいは
「Bの幅」を変えたときに、もうひとつの「幅」も正しく計算されます。
また、「全体の幅」が変わったときにも、
「Aの幅」や「Bの幅」も良いように変更され、制約が保たれるようになります。
*/

const aTL = T(self =>
    bTL.sync(b =>
        self.now = (self.now !== allTL.now - b)
            ? allTL.now - b
            : bTL.now = undefined
    )
);

const bTL = T(self =>
    aTL.sync(a =>
        self.now = (self.now !== allTL.now - a)
            ? allTL.now - a
            : aTL.now = undefined
    )
);

const dataTL = T(self =>
    allThenResetTL([aTL, bTL]).sync(ab =>
        (self.now = [...ab, allTL.now]) &&
        console.info("a, b, all", self.now))
);

const allTL = T(self =>
    self.sync(all =>
        (dataTL.now === undefined)
            ? undefined
            : (a => b =>
                aTL.now = all * (a / (a + b))
            )(dataTL.now[0])(dataTL.now[1])
    )
);

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

    setTimeout(f0, 0);
    setTimeout(f1, 10);
    setTimeout(f2, 20);
    setTimeout(f2, 30);
    setTimeout(f3, 40);
    setTimeout(f4, 50);
    setTimeout(f1, 60);
    setTimeout(f3, 70);
    setTimeout(f0, 80);
    setTimeout(f2, 90);
});

world.now = initTL;