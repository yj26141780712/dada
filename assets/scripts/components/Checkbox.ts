
import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Checkbox
 * DateTime = Thu Apr 14 2022 19:53:04 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = Checkbox.ts
 * FileBasenameNoExtension = Checkbox
 * URL = db://assets/scripts/components/Checkbox.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Checkbox')
export class Checkbox extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property(Node)
    public btn:Node;

    @property(SpriteFrame)
    public sprite:SpriteFrame;

    @property(SpriteFrame)
    public checkedSprite:SpriteFrame;

    @property({tooltip:'默认选项'})
    public checked:boolean =false;

    start () {
        // [3]
        this.refresh();
    }

    onClicked(){
        console.log(123);
        this.checked = !this.checked;
        this.refresh();
    }

    refresh() {
        const sp = this.btn.getComponent(Sprite);
        console.log(this.checked)
        if(this.checked){
            sp.spriteFrame = this.checkedSprite;
        } else {
            sp.spriteFrame = this.sprite;
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
