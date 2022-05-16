const io = window['io'];

export class Net {
    ip = '';
    handlers = {};

    addHandler() {

    }

    connect(success: (data: any) => void, fail: () => void) {
        const socket = io(this.ip);
        socket.on("connect", () => {
            console.log(socket.id); // x8WIv7-mJelg7on_ALbx
        });

        socket.on("disconnect", () => {
            fail();
            console.log(socket.id); // undefined
        });
    }
}