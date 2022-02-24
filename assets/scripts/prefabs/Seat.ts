
import { _decorator, Component, Node, Label, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

export interface RoomSeat {
    seatindex: number;
    userName: string;
    score: 0;
    dayingjia: boolean;
    isOffline: boolean;
    isReady: boolean;
    isZhuang: boolean;
    userId: number;
}

/**
 * Predefined variables
 * Name = Seat
 * DateTime = Thu Feb 24 2022 14:47:55 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = Seat.ts
 * FileBasenameNoExtension = Seat
 * URL = db://assets/scripts/prefabs/Seat.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('Seat')
export class Seat extends Component {

    @property(Node)
    public readyNode: Node = null;

    @property(Node)
    public offLineNode: Node = null;

    @property(Node)
    public zhuangNode: Node = null;

    @property(Node)
    public nameNode: Node = null;

    @property(Node)
    public scoreNode: Node = null;

    @property(Node)
    public voicemsgNode: Node = null;

    seatindex: number;
    seat: RoomSeat;
    start() {
        // [3]

    }

    init(seat: RoomSeat) {
        this.seat = { ...seat };
        this.nameNode.getComponent(Label).string = this.seat.score.toString();
        this.scoreNode.getComponent(Label).string = this.seat.score.toString();
        this.readyNode.active = this.seat.isReady;
        this.offLineNode.active = this.seat.isOffline;
        this.zhuangNode.active = this.seat.isZhuang;
        this.voicemsgNode.active = false;
    }

    onIconClicked() {
        //点击头像显示用户信息窗口
        console.log('我点击了头像');
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
