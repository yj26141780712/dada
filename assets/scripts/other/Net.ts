const io = window['io'];

export class Net {
    constructor() {

    }
    ip = '';
    handlers = {};
    socket: any;
    heartTimer;
    closeTimer;
    connect(success: () => void, fail: () => void) {
        console.log(this);
        this.socket = io(this.ip);
        this.socket.on("connect", () => {
            console.log('连接成功！');
            // console.log(socket.id); // x8WIv7-mJelg7on_ALbx
            success();
        });
        this.socket.on("disconnect", () => {
            console.log('断连');
            //console.log(socket.id); // undefined
        });

        this.socket.on('connect_error', err => {
            console.log(err);
        })

        this.socket.on('connect_failed', err => {
            console.log(err);
        })

        this.socket.on('game_pang', () => {
            console.log('game_pang');
            this.resetHeart();
            this.startHeart();
        });
        console.log(this.handlers);
        for (const key in this.handlers) {
            console.log(key);
            this.socket.on(key, (res: any) => {
                if (this.handlers[key]) {
                    this.handlers[key](res);
                }
            });
        }
    }

    addHandler(event: string, cb: (res: any) => void) {
        this.handlers[event] = cb;
    }

    resetHeart() {
        clearTimeout(this.heartTimer);
        clearTimeout(this.closeTimer);
    }

    startHeart() { // 开启心跳
        this.heartTimer = setTimeout(() => {
            this.socket.emit('game_ping');
            this.closeTimer = setTimeout(() => {
                //this.close();
            }, 10000);
        }, 5000)
    }

    close() {
        if (this.socket && this.socket.connected) {
            this.socket.connected = false;
            this.socket.disconnect();
            this.socket = null;
        }
    }


    send(event: string, data: any) {
        console.log(this);
        console.log(event,data);
        if (this.socket&&this.socket.connected) {
            console.log(event, JSON.stringify(data));
            this.socket.emit(event, JSON.stringify(data));
        }
    }
}

