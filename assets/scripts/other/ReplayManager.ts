import { Common } from "./Common";

const ACTION_CHUPAI = 1;
const ACTION_MOPAI = 2;
const ACTION_PENG = 3;
const ACTION_GANG = 4;
const ACTION_HU = 5;

export class ReplayManager {
    lastAction = null;
    actionRecords: any[] = null;
    currentIndex = 0;

    clear() {
        this.lastAction = null;
        this.actionRecords = null;
        this.currentIndex = 0;
    }

    init(data: any) {
        this.actionRecords = data.action_records;
        if (this.actionRecords === null) {
            this.actionRecords = [];
        }
        this.currentIndex = 0;
        this.lastAction = null;
    }

    isReplay() {
        return this.actionRecords !== null;
    }

    getNextAction() {
        if (this.currentIndex >= this.actionRecords.length) {
            return null;
        }
        const seatIndex = this.actionRecords[this.currentIndex++];
        const action = this.actionRecords[this.currentIndex++];
        const pai = this.actionRecords[this.currentIndex++];
        return { seatIndex, type: action, pai };
    }

    takeAction() {
        const action = this.getNextAction();
        if (this.lastAction != null && this.lastAction.type == ACTION_CHUPAI) {
            if (action != null && action.type != ACTION_PENG && action.type != ACTION_GANG && action.type != ACTION_HU) {
                Common.gameNetManager.doGuo(this.lastAction.si, this.lastAction.pai);
            }
        }
        this.lastAction = action;
        if (action == null) {
            return -1;
        }
        const nextActionDelay = 1.0;
        if (action.type == ACTION_CHUPAI) {
            Common.gameNetManager.doChupai(action.seatIndex, action.pai);
            return 1.0;
        }
        else if (action.type == ACTION_MOPAI) {
            Common.gameNetManager.doMopai(action.seatIndex, action.pai);
            Common.gameNetManager.doTurnChange(action.seatIndex);
            return 0.5;
        }
        else if (action.type == ACTION_PENG) {
            Common.gameNetManager.doPeng(action.seatIndex, action.pai);
            Common.gameNetManager.doTurnChange(action.seatIndex);
            return 1.0;
        }
        else if (action.type == ACTION_GANG) {
            Common.gameNetManager.dispatchEvent('hangang_notify', action.seatIndex);
            Common.gameNetManager.doGang(action.seatIndex, action.pai);
            Common.gameNetManager.doTurnChange(action.seatIndex);
            return 1.0;
        }
        else if (action.type == ACTION_HU) {
            Common.gameNetManager.doHu({
                seatindex: action.seatIndex,
                hupai: action.pai,
                iszimo: false
            });
            return 1.5;
        }
    }
}
