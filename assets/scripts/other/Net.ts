const io = window['io'];

export class Net {
    ip = '';
    handlers = {};
    socket: any;
    connect() {
        this.socket = io(this.ip);
        this.socket.on("connect", (data: any) => {
            console.log(this.socket.id); // x8WIv7-mJelg7on_ALbx
        });

        this.socket.on("disconnect", () => {
            console.log(this.socket.id); // undefined
        });

        for (const key in this.handlers) {
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

}