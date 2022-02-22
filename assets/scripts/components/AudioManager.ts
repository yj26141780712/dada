import { assert, AudioSource, clamp01 } from "cc";

export class AudioManager {

    private static _instance: AudioManager;
    private static _audioSource?: AudioSource;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new AudioManager();
        return this._instance;
    }

    /**
     * 音频管理器初始化
     * @param audioSource 音频组件
     */
    init(audioSource: AudioSource) {
        AudioManager._audioSource = audioSource;
    }

    /**
     * 播放音乐
     * @param loop 是否循环播放
     */
    playMusic(loop: boolean) {
        console.log(AudioManager._audioSource);
        const audioSource = AudioManager._audioSource;
        assert(audioSource, 'audioManager not init!');
        audioSource.loop = loop;
        if (!audioSource.playing) {
            audioSource.play();
        }
    }

    /**
     * 播放音效
     * @param name 音效名称
     * @param volumeScale 播放音量倍数
     */
    playSound(name: string, volumeScale: number) {

    }

    setMusicVolume(flag: number) {
        const audioSource = AudioManager._audioSource;
        assert(audioSource, 'audioManager not init!');
        flag = clamp01(flag);
        audioSource.volume = flag;
    }
}