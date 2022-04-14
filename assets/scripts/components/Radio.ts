
import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Radio
 * DateTime = Thu Apr 14 2022 20:48:16 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = Radio.ts
 * FileBasenameNoExtension = Radio
 * URL = db://assets/scripts/components/Radio.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Radio')
export class Radio extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property(SpriteFrame)
    public checkedSprite:SpriteFrame;

    @property(SpriteFrame)
    public sprite:SpriteFrame;

    @property(Node)
    public btn:Node;

    @property({})
    public checked = false;

    groupIndex = -1;
    groupReset = (index:number)=>{};

    start () {
        // [3]
    }

    onClicked(){
        this.checked  = !this.checked;
        if(this.groupIndex>-1){
            this.groupReset(this.groupIndex);
        }
        this.refresh();
    }

    refresh(){
        const sprite  = this.btn.getComponent(Sprite);
        if(this.checked){
            sprite.spriteFrame = this.checkedSprite;
        } else {
            sprite.spriteFrame = this.sprite;
        }
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
