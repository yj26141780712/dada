import { assert, assetManager, AudioClip, AudioSource, clamp01 } from "cc";

export class AudioManager {

    private static _audioSource?: AudioSource;
    private static _cachedAudioClipMap: Record<string, AudioClip> = {};

    // init AudioManager in GameRoot component.
    public static init(audioSource: AudioSource) {
        AudioManager._audioSource = audioSource;
    }

    public static playMusic(name: string) {
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');
        const path = `sounds/${name}`;
        let cachedAudioClip = AudioManager._cachedAudioClipMap[path];
        if (cachedAudioClip) {
            AudioManager._audioSource.clip = cachedAudioClip;
            AudioManager._audioSource.play();
        } else {
            assetManager.resources?.load(path, AudioClip, (err, clip) => {
                if (err) {
                    console.warn(err);
                    return;
                }
                AudioManager._cachedAudioClipMap[path] = clip;
                AudioManager._audioSource.clip = clip;
                AudioManager._audioSource.play();
            });
        }
    }

    public static playSound(name: string) {
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');
        const path = `sounds/${name}`;
        let cachedAudioClip = AudioManager._cachedAudioClipMap[path];
        if (cachedAudioClip) {
            audioSource.playOneShot(cachedAudioClip, 1);
        } else {
            assetManager.resources?.load(path, AudioClip, (err, clip) => {
                if (err) {
                    console.warn(err);
                    return;
                }
                AudioManager._cachedAudioClipMap[path] = clip;
                audioSource.playOneShot(clip, 1);
            });
        }
    }


}