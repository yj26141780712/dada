
import { _decorator, Component, Node, EventTouch, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = JoinGame
 * DateTime = Wed Feb 23 2022 13:35:55 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = JoinGame.ts
 * FileBasenameNoExtension = JoinGame
 * URL = db://assets/scripts/prefabs/JoinGame.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('JoinGame')
export class JoinGame extends Component {

    @property(Node)
    public nums: Node[] = [];
    inputIndex = 0;

    start() {
        // [3]
    }

    /**
     * 输入数字
     * @param event touch事件
     * @param value 数字值
     */
    onInputClicked(event: EventTouch, value: string) {
        this.input(value);
    }

    input(value: string) {
        if (this.inputIndex <= this.nums.length - 1) {
            this.nums[this.inputIndex].getComponent(Label).string = value;
            this.inputIndex++;
        }
        if (this.inputIndex === this.nums.length) { //完成输入
            this.onFinishInput();
        }
    }

    onFinishInput() {
        const rooId = this.parseRoomID();
        console.log('进入房间！', rooId);
    }

    onResetClicked() {
        this.nums.forEach(node => {
            node.getComponent(Label).string = '';
        });
        this.inputIndex = 0;
    }

    onDelClicked() {
        if (this.inputIndex > 0) {
            this.inputIndex--;
            this.nums[this.inputIndex].getComponent(Label).string = '';
        }
    }

    parseRoomID() {
        return this.nums.map(n => n.getComponent(Label)).join('');
    }

    onCloseClicked() {
        this.node.active = false;
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
