import { Common } from "./Common";
import { RoomSeat } from "../prefabs/Seat";

export class GameNetManager {
    roomId: string; //房间号
    roomServerIp: string; //房间服务器Id
    seatIndex = -1; //用户实际索引
    seats: RoomSeat[] = []; // 当前房间里面的已被使用位置
    numOfGames = 0;
    numOfMJ = 0;
    button = -1;
    connectGameServer(data: any) {
        this.roomServerIp = data.ip + ":" + data.port
        Common.net.connect((data: any) => {
            console.log('连接成功！');
            console.log(data);
        }, () => {
            console.log();
        });
    }

    isRoomOwner() {
        return this.seatIndex === 0;
    }

    //获取用户当前显示索引
    getLocalIndex(index: number) {
        return (index - this.seatIndex + 4) % 4;
    }
}