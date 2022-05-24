
import { _decorator, Component, Node, setDisplayStats, Label, Sprite, EventMouse, Button, Animation, AudioSource, assert, game } from 'cc';
import { Common } from '../other/Common';
import { RoomSeat } from '../prefabs/Seat';
import { AudioManager } from './AudioManager';
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

    @property(Animation)
    playEfxs: Animation[] = [];

    mjArr: Sprite[] = [];
    ops: Node;
    selectedMJ;
    chupaiSprite: Sprite[] = [];
    hupaiTips: Node[] = [];
    hupaiLists: Node[] = [];
    // playEfxs: Animation[] = [];
    opts = [];



    onLoad() {
        this.initAudio();
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
    }

    initAudio() {
        const audioSource = this.getComponent(AudioSource)!;
        assert(audioSource);
        game.addPersistRootNode(this.node);
        AudioManager.init(audioSource);
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
            this.playEfxs.push(sideNode.getChildByName('play_efx').getComponent(Animation));
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

        this.gameNode.active = true;
        this.preNode.active = false;
        this.initMahjongs();
        const seats = Common.gameNetManager.seats;

        seats.forEach((seat, index) => {
            const localIndex = Common.gameNetManager.getLocalIndex(index);
            if (localIndex != 0) {
                this.initOtherMahjongs(seat);
                if (index === Common.gameNetManager.turn) {
                    this.initMopai(index, -1);
                } else {
                    this.initMopai(index, null);
                }
            }
        });

        this.showChupai();
        if (Common.gameNetManager.curAction !== null) {
            this.showAction(Common.gameNetManager.curAction);
            Common.gameNetManager.curAction = null;
        }
        this.checkQueYiMen()
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

    initMopai(seatIndex: number, pai: number) {
        const localIndex = Common.gameNetManager.getLocalIndex(seatIndex);
        const side = Common.mahjongManager.getSide(localIndex);
        const pre = Common.mahjongManager.getFoldPre(localIndex);
        const gameNode = this.node.getChildByName('game');
        const sideNode = gameNode.getChildByName(side);
        const holds = sideNode.getChildByName('holds');
        const lastIndex = this.getMjIndex(side, 13);
        const nc = holds.children[lastIndex];
        if (pai === null) {
            nc.active = false;
        } else if (pai >= 0) {
            nc.active = true;
            const sprite = nc.getComponent(Sprite);
            sprite.spriteFrame = Common.mahjongManager.getSpriteFrameByIndex(pre, pai);
        } else {
            nc.active = true;
            const sprite = nc.getComponent(Sprite);
            sprite.spriteFrame = Common.mahjongManager.getHoldsEmptySpriteFrame(side);
        }
    }

    showChupai() {
        const pai = Common.gameNetManager.chupai;
        if (pai >= 0) {
            const localIndex = Common.gameNetManager.getLocalIndex(Common.gameNetManager.turn);
            const sprite = this.chupaiSprite[localIndex];
            sprite.spriteFrame = Common.mahjongManager.getSpriteFrameByIndex('M_', pai);
            sprite.node.active = true;
        }
    }

    showAction(data: any) {
        if (this.ops.active) {
            this.hideOptions();
        }
        if (data && (data.hu || data.gang || data.peng)) {
            this.ops.active = true;
            if (data.hu) {
                this.addOption('btnHu', data.pai);
            }
            if (data.peng) {
                this.addOption('btnPeng', data.pai);
            }
            if (data.gang) {
                for (let i = 0; i < data.gangpai.length; i++) {
                    const gp = data.gangpai[i];
                    this.addOption('btnGang', gp);
                }
            }
        }
    }

    addOption(btnName: string, pai: number) {
        for (let i = 0; i < this.ops.children.length; i++) {
            const child = this.ops.children[i];
            if (child.name === 'op' && child.active === false) {
                child.active = true;
                const sprite = child.getChildByName('opTarget').getComponent(Sprite);
                const btn = child.getChildByName(btnName);
                btn.active = true;
                btn[pai] = pai;
                return;
            }
        }
    }

    checkQueYiMen() {
        if (Common.gameNetManager.conf == null || Common.gameNetManager.conf.type != "xlch" || !Common.gameNetManager.getSelfData().hued) {
            const dingque = Common.gameNetManager.dingque;
            let hasQue = false;
            if (Common.gameNetManager.seatIndex == Common.gameNetManager.turn) {
                for (var i = 0; i < this.mjArr.length; ++i) {
                    const sprite = this.mjArr[i];
                    const mjIndex = sprite.node['mjIndex'];
                    if (mjIndex !== null) {
                        var type = Common.mahjongManager.getTypeByIndex(mjIndex);
                        if (type == dingque) {
                            hasQue = true;
                            break;
                        }
                    }
                }
            }
            for (var i = 0; i < this.mjArr.length; ++i) {
                const sprite = this.mjArr[i];
                const mjIndex = sprite.node['mjIndex'];
                if (mjIndex !== null) {
                    const type = Common.mahjongManager.getTypeByIndex(mjIndex);
                    if (hasQue && type != dingque) {
                        sprite.node.getComponent(Button).interactable = false;
                    }
                    else {
                        sprite.node.getComponent(Button).interactable = true;
                    }
                }
            }
        }
        else {
            if (Common.gameNetManager.seatIndex == Common.gameNetManager.turn) {
                for (var i = 0; i < 14; ++i) {
                    var sprite = this.mjArr[i];
                    if (sprite.node.active == true) {
                        sprite.node.getComponent(Button).interactable = i == 13;
                    }
                }
            }
            else {
                for (var i = 0; i < 14; ++i) {
                    var sprite = this.mjArr[i];
                    if (sprite.node.active == true) {
                        sprite.node.getComponent(Button).interactable = true;
                    }
                }
            }
        }
    }

    onGameHolds = (res: any) => {
        this.initMahjongs();
        this.checkQueYiMen();
    }
    onGameBegin = (res: any) => {
        this.beginGame();
    }
    onGamesync = (res: any) => {
        this.beginGame();
    }
    onGameChupai = (res: any) => {
        const data = res;
        this.hideChupai();
        this.checkQueYiMen();
        if (data.last !== Common.gameNetManager.seatIndex) {
            this.initMopai(data.last, null);
        }
        if (!Common.replayManager.isReplay() && data.turn !== Common.gameNetManager.seatIndex) {
            this.initMopai(data.turn, -1);
        }
    }
    onGameMopai = (res: any) => {
        const data = res;
        this.hideChupai();
        const pai = data.pai;
        const localIndex = Common.gameNetManager.getLocalIndex(data.seatIndex);
        if (localIndex === 0) {
            const index = 13;
            const sprite = this.mjArr[index];
            this.setSpriteFrameByMjIndex('M_', sprite, pai);
            sprite.node['mjIndex'] = pai;
        } else if (Common.replayManager.isReplay()) {
            this.initMopai(data.seatIndex, pai);
        }
    }
    onGameAction = (res: any) => {
        this.showAction(res);
    }
    onHupai = (res: any) => {
        const data = res;
        const seatIndex = data.seatindex;
        const localIndex = Common.gameNetManager.getLocalIndex(seatIndex);
        const hupai = this.hupaiTips[localIndex];
        hupai.active = true;
        if (localIndex === 0) {
            this.hideOptions();
        }
        const seat = Common.gameNetManager.seats[seatIndex];
        seat.hued;
        if (Common.gameNetManager.conf.type === 'xlch') {
            hupai.getChildByName("sprHu").active = true;
            hupai.getChildByName("sprZimo").active = false;
            this.initHupai(localIndex, data.hupai);
            if (data.iszimo) {
                if (seat.seatindex == Common.gameNetManager.seatIndex) {
                    seat.holds.pop();
                    this.initMahjongs();
                }
                else {
                    this.initOtherMahjongs(seat);
                }
            }
        } else {
            hupai.getChildByName("sprHu").active = !data.iszimo;
            hupai.getChildByName("sprZimo").active = data.iszimo;
            if (!(data.iszimo && localIndex == 0)) {
                this.initMopai(seatIndex, data.hupai);
            }
        }
        if (Common.replayManager.isReplay() == true && Common.gameNetManager.conf.type != "xlch") {
            var opt = this.opts[localIndex];
            opt.node.active = true;
            opt.sprite.spriteFrame = Common.mahjongManager.getSpriteFrameByIndex("M_", data.hupai);
        }

        if (data.iszimo) {
            this.playEfx(localIndex, "play_zimo");
        }
        else {
            this.playEfx(localIndex, "play_hu");
        }
        AudioManager.playSound("nv/hu.mp3");
    }
    onMjCount = (res: any) => {
        const label = this.mjCountlblNode.getComponent(Label);
        label.string = `剩余${Common.gameNetManager.numOfMJ}张`;
    }
    onGameNum = (res: any) => {
        const label = this.gameCountlblNode.getComponent(Label);
        label.string = `${Common.gameNetManager.numOfGames}/${Common.gameNetManager.maxNumofGames}`;
    }
    onGameOver = (res: any) => {
        this.gameNode.active = false;
        this.preNode.active = true;
    }
    onGameChupaiNotify = (res: any) => {
        this.hideChupai();
        const seatData = res.seatData;
        if (seatData.seatindex === Common.gameNetManager.seatIndex) {
            this.initMahjongs();
        } else {
            this.initOtherMahjongs(seatData);
        }
        this.showChupai();
        //播放出牌动画
    }

    onGuoNotify = (res: any) => {
        this.hideChupai();
        this.hideOptions();
        const seatData = res;
        if (seatData.seatindex === Common.gameNetManager.seatIndex) {
            this.initMahjongs();
        }
        //播放音乐
    }

    onGuoResult = (res: any) => {
        this.hideOptions();
    }

    onGameDingqueFinish = (res: any) => {
        this.initMahjongs();
    }

    onPengNotify = (res: any) => {
        this.hideChupai();
        const seatData = res;
        if (seatData.seatindex === Common.gameNetManager.seatIndex) {
            this.initMahjongs();
        } else {
            this.initOtherMahjongs(seatData);
        }
        const localIndex = Common.gameNetManager.getLocalIndex(seatData.seatindex);
        // 播放音乐 播放动效
        this.hideOptions();
    }

    onGangNotify = (res: any) => {
        this.hideChupai();
        const data = res;
        const seatData = data.seatData;
        const gangtype = data.gangtype;
        if (seatData.seatindex === Common.gameNetManager.seatIndex) {
            this.initMahjongs();
        } else {
            this.initOtherMahjongs(seatData);
        }
        const localIndex = Common.gameNetManager.getLocalIndex(seatData.seatindex);
        if (gangtype === 'wangang') {
            // 播放音乐 播放动效
        } else {
            // 播放音乐 播放动效
        }
        this.hideOptions();
    }

    onHangangNotify = (res: any) => {

        this.hideOptions();
    }

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

    initOtherMahjongs(seat: RoomSeat) {
        const localIndex = Common.gameNetManager.getLocalIndex(seat.seatindex);
        if (localIndex === 0) {
            return;
        }
        const side = Common.mahjongManager.getSide(localIndex);
        const game = this.node.getChildByName('game');
        const sideNode = game.getChildByName(side);
        const sideHolds = sideNode.getChildByName('holds');
        const num = (seat.pengs.length + seat.angangs.length + seat.diangangs.length + seat.wangangs.length) * 3
        for (let i = 0; i < num; i++) {
            const index = this.getMjIndex(side, i);
            sideHolds.children[index].active = false;
        }
        const pre = Common.mahjongManager.getFoldPre(localIndex);
        const holds = this.sortHolds(seat);
        if (holds && holds.length > 0) {
            holds.forEach((hold, index) => {
                const idx = this.getMjIndex(side, index);
                const sprite = sideHolds.children[idx].getComponent(Sprite);
                sprite.node.active = true;
                sprite.spriteFrame = Common.mahjongManager.getSpriteFrameByIndex(pre, hold);
            });
            if (holds.length + num === 13) {
                const lastInx = this.getMjIndex(side, 13);
                sideHolds.children[lastInx].active = false;
            }
        }
    }

    getMjIndex(side: string, index: number) {
        if (side === 'right' || side === 'up') {
            return 13 - index;
        }
        return index;
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

    playEfx(index: number, name: string) {
        this.playEfxs[index].node.active = true;
        this.playEfxs[index].play(name);
    }

    ontest() {

    }

    onMjClicked(event: EventMouse) {
        if (Common.gameNetManager.isHuanSanZhang) {
            this.node.emit("mj_clicked", event.target);
            return;
        }

        //如果不是自己的轮子，则忽略
        if (Common.gameNetManager.turn != Common.gameNetManager.seatIndex) {
            console.log("not your turn." + Common.gameNetManager.turn);
            return;
        }

        for (var i = 0; i < this.mjArr.length; ++i) {
            if (event.target == this.mjArr[i].node) {
                //如果是再次点击，则出牌
                if (event.target == this.selectedMJ) {
                    this.shoot(this.selectedMJ.mjIndex);
                    this.selectedMJ.y = 0;
                    this.selectedMJ = null;
                    return;
                }
                if (this.selectedMJ != null) {
                    this.selectedMJ.y = 0;
                }
                event.target.y = 15;
                this.selectedMJ = event.target;
                return;
            }
        }
    }

    //出牌
    shoot = (mjId: number) => {
        if (mjId == null) {
            return;
        }
        Common.net.send('chupai', mjId);
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
