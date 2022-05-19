
type actionType = '' | '' | '' | '' | ''

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
        return true;
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
        if (this.lastAction != null && this.lastAction.typ)
    }
}
