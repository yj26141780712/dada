import { _decorator, Component, Node, SpriteAtlas } from 'cc';
import { Common } from '../other/Common';
const { ccclass, property } = _decorator;

@ccclass('Mahjong')
export class Mahjong extends Component {

    @property(SpriteAtlas)
    leftAtlas: SpriteAtlas;

    @property(SpriteAtlas)
    rightAtlas: SpriteAtlas;

    @property(SpriteAtlas)
    myAtlas: SpriteAtlas;

    @property(SpriteAtlas)
    upAtlas: SpriteAtlas;

    @property(SpriteAtlas)
    holdsEmpty: SpriteAtlas;

    start() {
        Common.mahjongManager.leftAtlas = this.leftAtlas;
        Common.mahjongManager.rightAtlas = this.rightAtlas;
        Common.mahjongManager.myAtlas = this.myAtlas;
        Common.mahjongManager.upAtlas = this.upAtlas;
        Common.mahjongManager.holdsEmpty = this.holdsEmpty;
    }

    update(deltaTime: number) {

    }
}

