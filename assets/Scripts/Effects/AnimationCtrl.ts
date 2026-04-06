import { _decorator, Component, Node, Animation, warn, Event, EventHandler, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationCtrl')
export class AnimationCtrl extends Component {
    @property({ type: [EventHandler] })
    onFinished: EventHandler[] = [];

    @property({ displayName: 'Chỉ chạy 1 lần duy nhất' })
    playOnce: boolean = false;

    private animation: Animation | null = null;
    private hasPlayed: boolean = false;

    protected start(): void {
        if (!this.animation) {
            this.animation = this.getComponent(Animation);
            if (!this.animation) {
                warn('Không tìm thấy Animation component. Vui lòng kéo Animation vào hoặc thêm Animation component.');
            } else {
                // Đăng ký sự kiện khi animation kết thúc
                this.animation.on(Animation.EventType.FINISHED, this.onAnimationFinished, this);
                log("AnimationCtrl component registered on node %s", this.node.name);
            }
        }
    }

    protected onDestroy() {
        // Hủy đăng ký sự kiện khi component bị destroy
        if (this.animation) {
            this.animation.off(Animation.EventType.FINISHED, this.onAnimationFinished, this);
        }
    }

    // Callback khi animation kết thúc
    private onAnimationFinished() {
        log("AnimationCtrl finished on node %s", this.node.name);
        // Phát các EventHandler đã đăng ký
        EventHandler.emitEvents(this.onFinished);
    }

    jumpToFrame(frame: number) {
        if (!this.animation) {
            warn('Animation component không tồn tại.', this.node.name);
            return;
        }

        const clips = this.animation.clips;
        if (clips.length === 0) {
            warn('Không có animation clip nào.', this.node.name);
            return;
        }

        const clip = clips[0];
        const duration = clip.duration;
        const frameRate = clip.sample || 30;
        const frameCount = Math.floor(duration * frameRate);

        if (frame < 0 || frame >= frameCount) {
            warn(`Frame ${frame} không hợp lệ. Phạm vi: 0-${frameCount - 1}`, this.node.name);
            return;
        }

        const time = frame / frameRate;

        // Dừng animation hiện tại
        this.animation.stop();

        // Lấy state và đặt thời gian
        const state = this.animation.getState(clip.name);
        if (state) {
            // Đặt thời gian trước khi play
            state.time = time;
            // Phát animation từ frame đã chỉ định
            this.animation.play(clip.name);
        }
    }

    playDefaultClip() {
        if (this.playOnce && this.hasPlayed) {
            warn('Animation đã được phát một lần và không thể phát lại (playOnce enabled).', this.node.name);
            return;
        }
        if (!this.animation) {
            warn('Animation component không tồn tại.', this.node.name);
            return;
        }
        const clips = this.animation.clips;
        if (clips.length === 0) {
            warn('Không có animation clip nào để phát.', this.node.name);
            return;
        }
        // Phát clip đầu tiên làm mặc định
        this.animation.play(clips[0].name);
        this.hasPlayed = true;
    }

    playNextClip() {
        if (this.playOnce && this.hasPlayed) {
            warn('Animation đã được phát một lần và không thể phát lại (playOnce enabled).', this.node.name);
            return;
        }
        if (!this.animation) {
            warn('Animation component không tồn tại.', this.node.name);
            return;
        }
        const clips = this.animation.clips;
        if (clips.length === 0) {
            warn('Không có animation clip nào để phát.', this.node.name);
            return;
        }
        const currentState = this.animation.getState(this.animation.defaultClip ? this.animation.defaultClip.name : '');
        let currentIndex = -1;
        if (currentState) {
            currentIndex = clips.findIndex(c => c.name === currentState.clip.name);
        }
        const nextIndex = (currentIndex + 1) % clips.length;
        this.animation.play(clips[nextIndex].name);
        this.hasPlayed = true;
    }

    // Play animation by name; compatible with Cocos EventHandler CustomEventData
    // When called from UI EventHandler, signature should be (event?: Event, customEventData?: string)
    playClipByName(event?: Event, clipName?: string) {
        if (this.playOnce && this.hasPlayed) {
            warn('Animation đã được phát một lần và không thể phát lại (playOnce enabled).', this.node.name);
            return;
        }
        if (!this.animation) {
            warn('Animation component không tồn tại.', this.node.name);
            return;
        }
        const clips = this.animation.clips;
        if (!clipName || clipName.length === 0) {
            warn('Tên clip trống hoặc không được truyền từ CustomEventData.', this.node.name);
            // Gợi ý các clip hiện có
            for (let i = 0; i < clips.length; i++) {
                const c = clips[i];
                console.log(`Clip ${i}: ${c.name}`);
            }
            return;
        }
        // Tùy chọn: xác thực clip có tồn tại
        const found = clips.find(c => c.name === clipName);
        if (!found) {
            warn(`Không tìm thấy clip '${clipName}'.`, this.node.name);
            for (let i = 0; i < clips.length; i++) {
                const c = clips[i];
                console.log(`Clip ${i}: ${c.name}`);
            }
            return;
        }
        this.animation.play(clipName);
        this.hasPlayed = true;
    }

    // play animation by index
    playClipByIndex(event?: Event, clipIndexStr?: string) {
        if (this.playOnce && this.hasPlayed) {
            warn('Animation đã được phát một lần và không thể phát lại (playOnce enabled).', this.node.name);
            return;
        }
        if (!this.animation) {
            warn('Animation component không tồn tại.', this.node.name);
            return;
        }
        const clips = this.animation.clips;
        if (!clipIndexStr || clipIndexStr.length === 0) {
            warn('Chỉ số clip trống hoặc không được truyền từ CustomEventData.', this.node.name);
            // Gợi ý các clip hiện có
            for (let i = 0; i < clips.length; i++) {
                const c = clips[i];
                console.log(`Clip ${i}: ${c.name}`);
            }
            return;
        }
        const clipIndex = parseInt(clipIndexStr);
        if (isNaN(clipIndex) || clipIndex < 0 || clipIndex >= clips.length) {
            warn(`Chỉ số clip không hợp lệ: '${clipIndexStr}'. Phạm vi: 0-${clips.length - 1}`, this.node.name);
            return;
        }
        this.animation.play(clips[clipIndex].name);
        this.hasPlayed = true;
    }
}


