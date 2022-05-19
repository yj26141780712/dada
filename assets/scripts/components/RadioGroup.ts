
import { _decorator, Component, Node, EventTouch } from 'cc';
import { Radio } from './Radio';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = RadioGroup
 * DateTime = Thu Apr 14 2022 20:50:19 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = RadioGroup.ts
 * FileBasenameNoExtension = RadioGroup
 * URL = db://assets/scripts/components/RadioGroup.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('RadioGroup')
export class RadioGroup extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property(Node)
    radioGroups: Node[] = [];
    checkIndex = 0;

    start() {
        // [3]
        this.radioGroups.forEach((node, index) => {
            const radio = node.getComponent(Radio);
            console.log(radio);
            radio.groupIndex = index;
            radio.groupReset = this.groupReset;
        })
    }

    groupReset = (gIndex: number) => {
        this.checkIndex = gIndex;
        this.radioGroups.forEach((node, index) => {
            if (gIndex !== index) {
                const radio = node.getComponent(Radio);
                radio.checked = false;
                radio.refresh();
            }
        })
    }

    onClicked(event: EventTouch) {
        console.log(event);
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
