
import { _decorator, Component, Node, EditBox } from 'cc';
import { Common } from '../other/Common';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Cre_a_te
 * DateTime = Wed Apr 06 2022 20:18:48 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = Cre'a'te.ts
 * FileBasenameNoExtension = Cre'a'te
 * URL = db://assets/scripts/components/Cre'a'te.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('CreateRole')
export class CreateRole extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property(Node)
    nameNode:Node;

    start () {
        // [3]
        console.log(456)
    }

    onBtnConfirmClicked() {
        console.log(123);
        const input = this.nameNode.getComponent(EditBox);
        console.log(input.string);
        Common.userManager.create(input.string);
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
