import { SpriteAtlas } from "cc";

export class MahjongManager {
    sides = ['myself', 'right', 'up', 'left'];
    pres = ['M_', 'R_', 'B_', 'L_'];
    foldpPres = ['B_', 'R_', 'B_', 'L_'];
    mahjongSprites = [];
    leftAtlas: SpriteAtlas;
    rightAtlas: SpriteAtlas;
    myAtlas: SpriteAtlas;
    upAtlas: SpriteAtlas;
    holdsEmpty: SpriteAtlas;
    init() {
        // tong
        for (let i = 1; i < 10; i++) {
            this.mahjongSprites.push('dot_' + i);
        }
        // tiao
        for (let i = 1; i < 10; i++) {
            this.mahjongSprites.push('bamboo_' + i);
        }
        // wan
        for (let i = 1; i < 10; i++) {
            this.mahjongSprites.push('character_' + i);
        }

        this.mahjongSprites.push('red');
        this.mahjongSprites.push('green');
        this.mahjongSprites.push('white');

        this.mahjongSprites.push('wind_east');
        this.mahjongSprites.push('wind_west');
        this.mahjongSprites.push('wind_south');
        this.mahjongSprites.push('wind_north');
    }

    getSpriteByIndex(index: number) {
        return MahjongManager[index];
    }

    getTypeByIndex(index: number) {
        if (index >= 0 && index < 9) {
            return 0;
        }
        if (index >= 9 && index < 18) {
            return 1;
        }
        if (index >= 18 && index < 27) {
            return 2;
        }
    }

    getSpriteFrameByIndex(pre: string, index: number) {
        const key = `${pre}${this.getSpriteByIndex(index)}`;
        if (pre === 'M_') {
            return this.myAtlas.getSpriteFrame(key);
        } else if (pre === 'B_') {
            return this.upAtlas.getSpriteFrame(key);
        } else if (pre === 'L_') {
            return this.leftAtlas.getSpriteFrame(key);
        } else if (pre === 'R_') {
            return this.rightAtlas.getSpriteFrame(key);
        }
    }

    getHoldsEmptySpriteFrame(side: string) {
        if (side === 'up') {
            return this.holdsEmpty.getSpriteFrame('e_mj_up');
        } else if (side === 'myself') {
            return null;
        } else if (side === 'right') {
            return this.holdsEmpty.getSpriteFrame('e_mj_right');
        } else if (side === 'left') {
            return this.holdsEmpty.getSpriteFrame('e_mj_left');
        }
    }

    sortMJ(mjs: number[], dingque: number) {
        mjs.sort((a, b) => {
            if (dingque > 0) {
                const t1 = this.getTypeByIndex(a);
                const t2 = this.getTypeByIndex(b);
                if (t1 !== t2) {
                    if (dingque == t1) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            }
            return a - b;
        });
    }

    getFoldPre(localIndex: number) {
        return this.foldpPres[localIndex];
    }
}