import { _decorator, Component, Node, SpriteAtlas, SpriteFrame } from 'cc';
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

    @property(SpriteFrame)
    holdsEmpty:SpriteFrame[] =[];


    onLoad() {
        Common.mahjongManager.leftAtlas = this.leftAtlas;
        Common.mahjongManager.rightAtlas = this.rightAtlas;
        Common.mahjongManager.myAtlas = this.myAtlas;
        Common.mahjongManager.upAtlas = this.upAtlas;
        console.log('分配精灵资源')
        Common.mahjongManager.holdsEmpty = this.holdsEmpty;
    }

    update(deltaTime: number) {

    }
}

