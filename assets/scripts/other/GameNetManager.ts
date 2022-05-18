import { director } from 'cc';
import { Common } from "./Common";
import { RoomSeat } from "../prefabs/Seat";

type GameState = 'begin' | 'playing' | 'dingque' | 'huanpai';
type GameEvent = 'game_begin' | '';
type GameConfType = 'xlch' | 'xzdd';

interface GameConf {
    maxGames: number;
    maxFan: number;
    hsz: boolean;
    type: GameConfType;
}

export class GameNetManager {
    roomId: string; //房间号
    conf: GameConf; // 玩法conf
    maxNumofGames = 0;
    numOfGames = 0;
    numOfMJ = 0;
    seatIndex = -1; //用户实际索引
    seats: RoomSeat[] = []; // 当前房间里面的已被使用位置
    turn = -1;
    button = -1;
    dingque = -1;
    chupai = -1;
    isDingQueing = false;
    isHuanSanZhang = false;
    gamestate: GameState;
    isOver = false;
    dissoveData: any = null;
    huanpaimothod: string;
    curAction: string;
    roomServerIp: string; //房间服务器Id
    gameEvents: {};

    reset() {

    }

    initHandlers() {
        const net = Common.net;
        net.addHandler('login_result', this.onLoginResult);
        net.addHandler('login_finished', this.onLoginFinished);
        net.addHandler('exit_result', this.onExitResult);
        net.addHandler('exit_notify_push', this.onExitNotifyPush);
        net.addHandler('dispress_push', this.onDispressPush);
        net.addHandler('disconnect', this.onDisconnect);
        net.addHandler('new_user_comes_push', this.onNewUserComesPush);
        net.addHandler('user_state_push', this.onUserStatePush);
        net.addHandler('user_ready_push', this.onUserReadyPush);
        net.addHandler('mj_count_push', this.onMjCountPush);
        net.addHandler('game_holds_push', this.onGameHoldsPush);
        net.addHandler('game_begin_push', this.onGameBeginPush);
        net.addHandler('game_num_push', this.onGameNumPush);
        net.addHandler('game_playing_push', this.onGamePlayingPush);
        net.addHandler('game_sync_push', this.onGameSyncPush);
        net.addHandler('game_action_push', this.onGameActionPush);
        net.addHandler('game_huanpai_push', this.onGameHuanpaiPush);
        net.addHandler('game_huanpai_over_push', this.onGameHuanpaiOverPush);
        net.addHandler('game_dingque_push', this.onGameDingquePush);
        net.addHandler('game_dingque_notify_push', this.onGameDingqueNotifyPush);
        net.addHandler('game_dingque_finish_push', this.onGameDingqueFinishPush);
        net.addHandler('game_chupai_push', this.onGameChupaiPush);
        net.addHandler('game_chupai_notify_push', this.onGameChupaiNotifyPush);
        net.addHandler('game_mopai_push', this.onGameMopaiPush);
        net.addHandler('game_over_push', this.onGameOverPush);
        net.addHandler('hangang_notify_push', this.onHangangNotifyPush);
        net.addHandler('peng_notify_push', this.onPengNotifyPush);
        net.addHandler('gang_notify_push', this.onGangNotifyPush);
        net.addHandler('guo_notify_push', this.onGuoNotifyPush);
        net.addHandler('guo_result', this.onGuoResult);
        net.addHandler('guo_hu_push', this.onGuoHuPush);
        net.addHandler('hu_push', this.onHuPush);
        net.addHandler('huanpai_notify', this.onHuanpaiNotify);
        // net.addHandler('peng_notify_push', this.onUserReadyPush);
    }

    onLoginResult = (res: any) => {
        if (res.errcode === 0) { //连接成功 开启心跳
            const data = res.data;
            this.roomId = data.roomid;
            this.conf = data.conf;
            this.maxNumofGames = data.conf.maxGames;
            this.numOfGames = data.numofgames;
            this.seats = data.seats;
            this.seatIndex = this.getSeatIndexById(Common.userManager.userInfo.userId);
            this.isOver = false;
        } else {
            console.log(res.errmsg);
        }
    }

    onLoginFinished = (res: any) => {
        console.log('登录结束');
        // 跳转到主场景
        // director.loadScene('');
    }

    onExitResult = (res: any) => {
        this.roomId = null;
        this.turn = -1;
        this.dingque = -1;
        this.isDingQueing = false;
        this.seats = [];
    }

    onExitNotifyPush = (res: any) => {
        const userId = res;
        const seat = this.getSeatById(userId);
        if (seat != null) {
            seat.userId = 0;
            seat.name = '';
            // 用户推出变更用户状态
            this.dispatchEvent('user_state_changed', seat);
        }
    }

    onDispressPush = (res: any) => {
        this.roomId = null;
        this.turn = -1;
        this.dingque = -1;
        this.isDingQueing = false;
        this.seats = [];
    }

    onDisconnect = (res: any) => {
        if (this.roomId === null) {
            // 跳转到大厅
        } else {
            if (this.isOver) {
                Common.userManager.oldRoomId = this.roomId;
                this.dispatchEvent('disconnect');
            } else {
                this.roomId = null;
            }
        }
    }

    onNewUserComesPush = (res: any) => {
        const seatIndex = res.seatindex;
        let seat = this.seats[seatIndex];
        if (seat && seat.userId > 0) {
            seat.isOnline = true;
        } else {
            seat = { ...seat, ...res, isOnline: true };
        }
        this.dispatchEvent('new_user', seat);
    }

    onUserStatePush = (res: any) => {
        const userId = res.userid;
        const seat = this.getSeatById(userId);
        seat.isOnline = res.online;
        this.dispatchEvent('user_state_changed', seat);
    }

    onUserReadyPush = (res: any) => {
        const userId = res.userid;
        const seat = this.getSeatById(userId);
        seat.isReady = res.ready;
        this.dispatchEvent('user_state_changed', seat);
    }

    onMjCountPush = (res: any) => {
        this.numOfMJ = res;
        this.dispatchEvent('mj_count', res);
    }

    onGameHoldsPush = (res: any) => {
        const seat = this.seats[this.seatIndex];
        seat.holds = res;
        for (let i = 0; i < this.seats.length; i++) {
            const seat = this.seats[i];
            if (seat.holds == null) {
                seat.holds = [];
            }
            if (seat.pengs == null) {
                seat.pengs = [];
            }
            if (seat.angangs == null) {
                seat.angangs = [];
            }
            if (seat.diangangs == null) {
                seat.diangangs = [];
            }
            if (seat.wangangs == null) {
                seat.wangangs = [];
            }
            seat.isReady = false;
        }
        this.dispatchEvent('game_holds')
    }

    onGameBeginPush = (res: any) => {
        this.button = res;
        this.turn = this.button;
        this.gamestate = 'begin';
        this.dispatchEvent('game_begin');
    }

    onGameNumPush = (res: any) => {
        this.numOfGames = res;
        this.dispatchEvent('game_num', res);
    }

    onGamePlayingPush = (res: any) => {
        this.gamestate = 'playing';
        this.dispatchEvent('game_playing');
    }

    onGameSyncPush = (res: any) => {
        this.numOfMJ = res.numofmj;
        this.gamestate = res.state;
        if (this.gamestate === 'dingque') {
            this.isDingQueing = true;
        } else if (this.gamestate === 'huanpai') {
            this.isHuanSanZhang = true;
        }
        this.turn = res.turn;
        this.button = res.button;
        this.chupai = res.chuPai;
        this.huanpaimothod = res.huanpaimethod;
        for (let i = 0; i < 4; i++) {
            const seat = this.seats[i];
            const sd = res.seats[i];
            seat.holds = sd.holds;
            seat.folds = sd.folds;
            seat.angangs = sd.angangs;
            seat.diangangs = sd.diangangs;
            seat.wangangs = sd.wangangs;
            seat.pengs = sd.pengs;
            seat.dingque = sd.dingque;
            seat.hued = sd.hued;
            seat.iszimo = sd.iszimo;
            seat.huinfo = sd.huinfo;
            seat.huanpais = sd.huanpais;
            if (i === this.seatIndex) {
                seat.dingque = sd.que;
            }
        }
    }

    onGameActionPush = (res: any) => {
        this.curAction = res;
        this.dispatchEvent('game_action');
    }

    onGameHuanpaiPush = (res: any) => {
        this.isHuanSanZhang = true;
        this.dispatchEvent('game_huanpai');
    }

    onGameHuanpaiOverPush = (res: any) => {
        let info = '';
        const method = res.method;
        if (method == 0) {
            info = '换对家牌';
        } else if (method == 1) {
            info = '换下家牌';
        } else {
            info = '换上家牌';
        }
        this.huanpaimothod = method;
        this.isHuanSanZhang = false;
        this.dispatchEvent('game_huanpai_over');
        this.dispatchEvent('push_notice', { info, time: 2 });
    }

    onGameOverPush = (res: any) => {
        const results = res.results;
        for (let i = 0; i < this.seats.length; ++i) {
            this.seats[i].score = results.length === 0 ? 0 : results[i].totalscore;
        }
        this.dispatchEvent('game_over', results);
        if (res.endinfo) {
            this.isOver = true;
            this.dispatchEvent('game_end', res.endinfo);
        }
        this.reset();
        for (let i = 0; i < this.seats.length; ++i) {
            this.dispatchEvent('user_state_changed', this.seats[i]);
        }
    }

    onGameDingqueNotifyPush = (res: any) => {
        this.dispatchEvent('game_dingque_notify', res);
    }

    onGameDingquePush = (res: any) => {
        this.isDingQueing = true;
        this.isHuanSanZhang = false;
        this.dispatchEvent('game_dingque');
    }

    onDingqueNotifyPush = (res: any) => {

    }

    onGameDingqueFinishPush = (res: any) => {
        for (let i = 0; i < res.length; ++i) {
            this.seats[i].dingque = res[i];
        }
        this.dispatchEvent('game_dingque_finish', res);
    }

    onGameChupaiPush = (res: any) => {
        const turnUserId = res;
        const seatIndex = this.getSeatIndexById(turnUserId);
        this.doTurnChange(seatIndex);
    }

    onGameChupaiNotifyPush = (res: any) => {
        const userId = res.userId;
        const pai = res.pai;
        const seatIndex = this.getSeatIndexById(userId);
        this.doChupai(seatIndex, pai);
    }

    onHangangNotifyPush = (res: any) => {
        this.dispatchEvent('hangang_notify', res);
    }

    onPengNotifyPush = (res: any) => {
        const userId = res.userid;
        const pai = res.pai;
        const seatIndex = this.getSeatIndexById(userId);
        this.doPeng(seatIndex, pai);
    }

    onGangNotifyPush = (res: any) => {
        const userId = res.userid;
        const pai = res.pai;
        const seatIndex = this.getSeatIndexById(userId);
        this.doGang(seatIndex, pai, res.gangtype);
    }

    onGuoNotifyPush = (res: any) => {
        const userId = res.userId;
        const pai = res.pai;
        const seatIndex = this.getSeatIndexById(userId);
        this.doGuo(seatIndex, pai);
    }

    onGuoResult = (res: any) => {
        this.dispatchEvent('guo_result');
    }

    onGuoHuPush = (res: any) => {
        this.dispatchEvent('push_notice', { info: '过胡', time: 1.5 });
    }

    onHuPush = (res: any) => {
        this.doHu(res);
    }

    onHuanpaiNotify = (res: any) => {
        const seat = this.getSeatById(res.si);
        seat.huanpais = res.huanpais;
        this.dispatchEvent('huanpai_notify', seat);
    }

    onGameMopaiPush = (res: any) => {
        this.doMopai(this.seatIndex, res);
    }

    connectGameServer(data: any) {
        this.roomServerIp = data.ip + ":" + data.port
        Common.net.connect();
    }

    isRoomOwner() {
        return this.seatIndex === 0;
    }

    //获取用户当前显示索引
    getLocalIndex(index: number) {
        return (index - this.seatIndex + 4) % 4;
    }

    getSeatIndexById(userId: number) {
        for (let i = 0; i < this.seats.length; i++) {
            const seat = this.seats[i];
            if (seat.userId === userId) {
                return i;
            }
        }
        return -1;
    }

    getSeatById(userId: number) {
        const seatIndex = this.getSeatIndexById(userId);
        const seat = this.seats[seatIndex];
        return seat;
    }

    doGuo(seatIndex: number, pai: number) {
        const seatData = this.seats[seatIndex];
        const folds = seatData.folds;
        folds.push(pai);
        this.dispatchEvent('guo_notify', seatData);
    }

    doMopai(seatIndex: number, pai: number) {
        const seatData = this.seats[seatIndex];
        if (seatData.holds) {
            seatData.holds.push(pai);
            this.dispatchEvent('game_mopai', { seatIndex, pai });
        }
    }

    doTurnChange(seatIndex: number) {
        const data = { last: this.turn, turn: seatIndex };
        this.turn = seatIndex;
        this.dispatchEvent('game_chupai', data);
    }

    doHu(data: any) {
        this.dispatchEvent('hupai', data);
    }

    doChupai(seatIndex: number, pai: number) {
        this.chupai = pai;
        const seatData = this.seats[seatIndex];
        if (seatData.holds) {
            const index = seatData.holds.indexOf(pai);
            seatData.holds.splice(index, 1);
        }
        this.dispatchEvent('game_chupai_notify', { seatData, pai });
    }

    doPeng(seatIndex: number, pai: number) {
        const seatData = this.seats[seatIndex];
        // 移除手牌
        if (seatData.holds) {
            for (let i = 0; i < 2; ++i) {
                const index = seatData.holds.indexOf(pai);
                seatData.game_holds_push.splice(index, 1);
            }
        }

        //更新碰牌数据
        const pengs = seatData.pengs;
        pengs.push(pai);
        this.dispatchEvent('peng_notify', seatData);
    }

    getGangType(seatData: RoomSeat, pai: number) {
        if (seatData.pengs.indexOf(pai) > -1) {
            return 'wangang';
        } else {
            let cnt = 0;
            for (let i = 0; i < seatData.holds.length; ++i) {
                if (seatData.holds[i] === pai) {
                    cnt++;
                }
            }
            if (cnt === 3) {
                return "dinggang";
            } else {
                return "angang";
            }
        }
    }

    doGang(seatIndex: number, pai: number, gangtype: string) {
        const seatData = this.seats[seatIndex];
        if (!gangtype) {
            gangtype = this.getGangType(seatData, pai);
        }
        if (gangtype === 'wangang') {
            const index = seatData.pengs.indexOf(pai);
            if (index > -1) {
                seatData.pengs.splice(index, 1);
            }
            seatData.wangangs.push(pai);
        }
        if (seatData.holds) {
            for (let i = 0; i <= 4; ++i) {
                const index = seatData.holds.indexOf(pai);
                if (index > -1) {
                    seatData.holds.splice(index, 1);
                }
            }
        }
        if (gangtype === 'angang') {
            seatData.angangs.push(pai);
        } else {
            seatData.diangangs.push(pai);
        }
        this.dispatchEvent('gang_notify', { seatData, gangtype });
    }

    addGameEvent(event: string, cb: (res: any) => void) {
        this.gameEvents[event] = cb;
    }

    dispatchEvent(event: string, data?: any) {
        if (this.gameEvents[event]) {
            this.gameEvents[event](data);
        }
    }

    getWanfa() {
        const conf = this.conf;
        if (conf && conf.maxGames && conf.maxFan) {
            const strArr = [];
            strArr.push(`${conf.maxGames}局`);
            strArr.push(`${conf.maxFan}番封顶`);
            if (conf.hsz) {
                strArr.push('换三张')
            }
            return strArr.join(' ');
        }
        return '';
    }
}