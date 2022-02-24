
import { _decorator, Component, Node, Label } from 'cc';
import { Common } from '../other/Common';
import { Seat } from '../prefabs/Seat';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MjRoom
 * DateTime = Thu Feb 24 2022 14:21:38 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = MjRoom.ts
 * FileBasenameNoExtension = MjRoom
 * URL = db://assets/scripts/components/MjRoom.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('MjRoom')
export class MjRoom extends Component {

    @property(Node)
    public lblTimeNode: Node = null;

    @property(Node)
    public lblRoomNode: Node = null;

    @property(Node)
    public preSeatNodes: Node[] = [];

    lblTime: Label;
    lblRoomNo: Label;
    lastMinute: number;
    preSeats: Seat[] = []; // 准备阶段四个座位
    gameSeats: Seat[] = [] // 游戏阶段四个座位

    start() {
        // [3]
        this.initView();
        this.initSeats();
        this.initEventHandlers();
    }

    //初始化文本等显示
    initView() {
        this.lblTime = this.lblTimeNode.getComponent(Label);
        this.lblRoomNo = this.lblRoomNode.getComponent(Label);
        this.lblRoomNo.string = Common.gameNetManager.roomId;
        this.preSeats = this.preSeatNodes.map(n => n.getComponent(Seat));
        this.setBtns();
    }

    initSeats() {
        const seats = Common.gameNetManager.seats;
        for (var i = 0; i < seats.length; ++i) {
            this.initSingleSeat(seats[i]);
        }
    }

    initSingleSeat(seat: any) {
        var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
        var isOffline = !seat.online;
        var isZhuang = seat.seatindex == cc.vv.gameNetMgr.button;

        console.log("isOffline:" + isOffline);

        this._seats[index].setInfo(seat.name, seat.score);
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].voiceMsg(false);

        this._seats2[index].setInfo(seat.name, seat.score);
        this._seats2[index].setZhuang(isZhuang);
        this._seats2[index].setOffline(isOffline);
        this._seats2[index].setID(seat.userid);
        this._seats2[index].voiceMsg(false);
        this._seats2[index].refreshXuanPaiState();
    }

    initEventHandlers() {

    }

    onBtnWeichatClicked() {

    }

    setBtns() {
        const prepare = this.node.getChildByName("prepare");
        var btnExit = prepare.getChildByName("btnExit");
        var btnDispress = prepare.getChildByName("btnDissolve");
        var btnWeichat = prepare.getChildByName("btnWeichat");
        var btnBack = prepare.getChildByName("btnBack");
        var isIdle = Common.gameNetManager.numOfGames == 0;
        btnExit.active = Common.gameNetManager.isRoomOwner() && isIdle;
        btnDispress.active = Common.gameNetManager.isRoomOwner() && isIdle;
        btnWeichat.active = isIdle;
        btnBack.active = isIdle;
    }

    update(deltaTime: number) {
        const minutes = Math.floor(Date.now() / 1000 / 60);
        if (this.lastMinute !== minutes) {
            const date = new Date();
            const h = date.getHours();
            const m = date.getMinutes();
            this.lblTime.string = `${h > 10 ? h : '0' + h}:${m > 10 ? m : '0' + m}`;
        }
    }
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
