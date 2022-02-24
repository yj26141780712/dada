
import { _decorator, Component, Node, setDisplayStats } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MjGame
 * DateTime = Thu Feb 24 2022 13:53:40 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = MjGame.ts
 * FileBasenameNoExtension = MjGame
 * URL = db://assets/scripts/components/MjGame.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('MjGame')
export class MjGame extends Component {
     
    @property(Node)
    public preNode:Node = null;

    @property(Node)
    public gameNode:Node = null;

    start() {
        // [3]
        setDisplayStats(false);
        this.preNode.active = true;
        this.gameNode.active = false;
        this.onGameBegin();
    }

    onGameBegin(){
        this.preNode.active =false;
        this.gameNode.active = true;
    }

    onMJClicked() {
        
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
