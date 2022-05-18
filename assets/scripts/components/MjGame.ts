
import { _decorator, Component, Node, setDisplayStats, Label, Sprite, } from 'cc';
import { Common } from '../other/Common';
import { RoomSeat } from '../prefabs/Seat';
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
    public preNode: Node = null;

    @property(Node)
    public gameNode: Node = null;

    @property(Node)
    public mjCountlblNode: Node;

    @property(Node)
    public gameCountlblNode: Node;

    @property(Node)
    public wanfaNode: Node;

    @property(Node)
    list: Node[] = [];

    mjArr: Sprite[] = [];
    ops: Node;
    selectedMJ;
    chupaiSprite: Sprite[] = [];
    hupaiTips: Node[] = [];
    hupaiLists: Node[] = [];
    // playEfxs: Animation[] = [];
    opts = [];

    onLoad() {
        this.initView();
        this.initEventHandlers();
        this.gameNode.active = false;
        this.preNode.active = true;
        this.initWanfa();
        this.beginGame();
    }

    start() {
        // [3]
        setDisplayStats(false);
        // this.preNode.active = true;
        // this.gameNode.active = false;
        // this.onGameBegin();
    }

    initView() {
        const mjcountLbl = this.mjCountlblNode.getComponent(Label);
        mjcountLbl.string = `剩余${0}张`;
        const gameCountlbl = this.gameCountlblNode.getComponent(Label);
        gameCountlbl.string = `${0}/${0}`;
        const myselfNode = this.gameNode.getChildByName('myself');
        const myholds = myselfNode.getChildByName('holds');
        for (let i = 0; i < myholds.children.length; i++) {
            const sprite = myholds.children[i].getComponent(Sprite);
            this.mjArr.push(sprite);
            sprite.spriteFrame = null;
        }
        const sides = ['myself', 'right', 'up', 'left'];
        for (let i = 0; i < sides.length; i++) {
            const side = sides[i];
            const sideNode = this.gameNode.getChildByName(side);
            this.hupaiTips.push(sideNode.getChildByName('hupai'));
            this.hupaiLists.push(sideNode.getChildByName('hupailist'));
            // hupai 动画
            this.chupaiSprite.push(sideNode.getChildByName('chupai').children[0].getComponent(Sprite));
            const opt = sideNode.getChildByName('opt');
            opt.active = false;
            const sprite = opt.getChildByName('pai').getComponent(Sprite);
            const data = {
                node: opt,
                sprite
            };
            this.opts.push(data);
        }
        const ops = this.gameNode.getChildByName('ops');
        this.ops = ops;
        this.hideOptions();
        this.hideChupai();
    }

    initEventHandlers() {
        const manager = Common.gameNetManager;
        manager.addGameEvent('game_holds', this.onGameHolds);
        manager.addGameEvent('game_begin', this.onGameBegin);
        manager.addGameEvent('game_sync', this.onGamesync);
        manager.addGameEvent('game_chupai', this.onGameChupai);
        manager.addGameEvent('game_mopai', this.onGameMopai);
        manager.addGameEvent('game_action', this.onGameAction);
        manager.addGameEvent('hupai', this.onHupai);
        manager.addGameEvent('mj_count', this.onMjCount);
        manager.addGameEvent('game_num', this.onGameNum);
        manager.addGameEvent('game_over', this.onGameOver);
        manager.addGameEvent('game_chupai_notify', this.onGameChupaiNotify);
        manager.addGameEvent('guo_notify', this.onGuoNotify);
        manager.addGameEvent('guo_result', this.onGuoResult);
        manager.addGameEvent('game_dingque_finish', this.onGameDingqueFinish);
        manager.addGameEvent('peng_notify', this.onPengNotify);
        manager.addGameEvent('gang_notify', this.onGangNotify);
        manager.addGameEvent('hangang_notify', this.onHangangNotify);
    }

    initWanfa() {
        const lbl = this.wanfaNode.getComponent(Label);
        lbl.string = Common.gameNetManager.getWanfa();
    }

    beginGame() {
        for (let i = 0; i < Common.gameNetManager.seats.length; i++) {
            const seat = Common.gameNetManager.seats[i];
            const localIndex = Common.gameNetManager.getLocalIndex(i);
            const hupai = this.hupaiTips[localIndex];
            hupai.active = seat.hued;
            if (seat.hued) {
                hupai.getChildByName('sprHu').active = !seat.iszimo;
                hupai.getChildByName('sprZimo').active = seat.iszimo;
            }
            if (seat.huinfo) {
                for (let j = 0; j < seat.huinfo.length; j++) {
                    const info = seat[j];
                    if (info.ishupai) {
                        this.initHupai(localIndex, info.pai);
                    }
                }
            }
        }
        this.hideChupai();
        this.hideOptions();
        const sides = ['right', 'up', 'left'];
        const gameNode = this.node.getChildByName('game');
        for (let i = 0; i < sides.length; i++) {
            const sideNode = gameNode.getChildByName(sides[i]);
            const holds = sideNode.getChildByName('holds');
            for (let j = 0; j < holds.children.length; j++) {
                const nc = holds.children[j];
                nc.active = true;
                const sprite = nc.getComponent(Sprite);
                sprite.spriteFrame = Common.mahjongManager.holdsEmpty[i + 1];
            }
        }

        if ()
    }

    hideOptions() {
        this.ops.active = false;
        for (let i = 0; i < this.ops.children.length; i++) {
            const child = this.ops.children[i];
            if (child.name === 'op') {
                child.active = false;
                child.getChildByName('btnPeng').active = false;
                child.getChildByName('btnGang').active = false;
                child.getChildByName('btnHu').active = false;
            }
        }
    }

    hideChupai() {
        for (let i = 0; i < this.chupaiSprite.length; i++) {
            this.chupaiSprite[i].node.active = false;
        }
    }

    initHupai(localIndex: number, pai: number) {
        if (Common.gameNetManager.conf.type === 'xlch') {
            const hupailist = this.hupaiLists[localIndex];
            for (let i = 0; i < hupailist.children.length; i++) {
                const hupaiNode = hupailist.children[i];
                if (hupaiNode.active = false) {
                    const pre = Common.mahjongManager.getFoldPre(localIndex);
                    const sprite = hupaiNode.getComponent(Sprite);
                    sprite.spriteFrame = Common.mahjongManager.getSpriteFrameByIndex(pre, pai);
                    hupaiNode.active = true;
                    break;
                }
            }
        }
    }

    onGameHolds = (res: any) => {
        this.initMahjongs();
    }
    onGameBegin = (res: any) => {
        this.preNode.active = false;
        this.gameNode.active = true;
    }
    onGamesync = (res: any) => { }
    onGameChupai = (res: any) => { }
    onGameMopai = (res: any) => { }
    onGameAction = (res: any) => { }
    onHupai = (res: any) => { }
    onMjCount = (res: any) => { }
    onGameNum = (res: any) => { }
    onGameOver = (res: any) => { }
    onGameChupaiNotify = (res: any) => { }
    onGuoNotify = (res: any) => { }
    onGuoResult = (res: any) => { }
    onGameDingqueFinish = (res: any) => { }
    onPengNotify = (res: any) => { }
    onGangNotify = (res: any) => { }
    onHangangNotify = (res: any) => { }

    onMJClicked() {

    }

    initMahjongs() {
        const seats = Common.gameNetManager.seats;
        const seat = seats[Common.gameNetManager.seatIndex];
        const holds = this.sortHolds(seat);
        const lackingNum = (seat.pengs.length + seat.angangs.length + seat.diangangs.length + seat.wangangs.length) * 3;
        for (let i = 0; i < holds.length; i++) {
            const mjIndex = holds[i];
            const sprite = this.mjArr[i + lackingNum];
            sprite.node['mjIndex'] = mjIndex;
            //sprite.node.setPosition(new Vec3(0, 0, 0));
            this.setSpriteFrameByMjIndex('M_', sprite, mjIndex);
        }
        for (let i = 0; i < lackingNum; i++) {
            const sprite = this.mjArr[i];
            sprite.node['mjIndex'] = null;
            sprite.spriteFrame = null;
            sprite.node.active = false;
        }
        for (let i = lackingNum + holds.length; i < this.mjArr.length; i++) {
            const sprite = this.mjArr[i];
            sprite.node['mjIndex'] = null;
            sprite.spriteFrame = null;
            sprite.node.active = false;
        }
    }

    sortHolds(seat: RoomSeat) {
        const holds = seat.holds;
        if (holds == null) {
            return null;
        }
        let mopai = null;
        const length = holds.length;
        const has = [2, 5, 8, 11, 14];
        if (has.indexOf(length) > -1) {
            mopai = holds.pop();
        }
        const dingque = seat.dingque;
        Common.mahjongManager.sortMJ(holds, dingque);
        if (mopai != null) {
            holds.push(mopai);
        }
        return holds;
    }

    setSpriteFrameByMjIndex(pre: string, sprite: Sprite, mjIndex: number) {
        sprite.spriteFrame = Common.mahjongManager.getSpriteFrameByIndex(pre, mjIndex);
        sprite.node.active = true;
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
