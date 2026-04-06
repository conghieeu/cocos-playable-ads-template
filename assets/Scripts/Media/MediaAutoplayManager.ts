import { _decorator, Component, VideoPlayer, AudioSource, Node, log, sys, input, Input, Button, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MediaAutoplayManager')
export class MediaAutoplayManager extends Component {
    // Danh sách VideoPlayer cần quản lý
    @property([VideoPlayer])
    managedVideos: VideoPlayer[] = [];

    // Danh sách AudioSource cần quản lý
    @property([AudioSource])
    managedAudios: AudioSource[] = [];

    // Danh sách Button cần lắng nghe (có thể assign manually trong editor)
    @property([Button])
    priorityButtons: Button[] = [];

    // Phát sự kiện khi click lần đầu
    @property({ type: [EventHandler], tooltip: 'Sự kiện phát ra ngay lần đầu click' })
    firstClickHandlers: EventHandler[] = [];

    private hasTriggeredFirstTouch: boolean = false;

    onLoad() {
        // Tự động thu thập tất cả VideoPlayer và AudioSource trên scene
        this.collectAllMedia();

        // Bước 1: Mute tất cả video và cho nó chạy
        this.managedVideos.forEach(video => {
            video.mute = true;
            // video.play();
        });

        // Bước 2: Lắng nghe sự kiện chạm đầu tiên trên toàn scene
        this.setupGlobalTouchListener();
    }

    protected start(): void {
        if (sys.isMobile) {
            console.log("Tương tác người dùng trên thiết bị di động...");
            this.handleFirstTouch();
        }
    }

    collectAllMedia() {
        // Khởi tạo arrays để tránh null
        this.managedVideos = this.managedVideos || [];
        this.managedAudios = this.managedAudios || [];

        // Reset arrays
        this.managedVideos.length = 0;
        this.managedAudios.length = 0;

        const videoPlayers: VideoPlayer[] = [];
        const audioSources: AudioSource[] = [];

        // Kiểm tra scene tồn tại
        if (!this.node || !this.node.scene) {
            console.warn('Scene not available for media collection');
            return;
        }

        // Duyệt toàn bộ cây node
        const traverse = (node: Node) => {
            if (!node || !node.isValid) return;

            if (typeof VideoPlayer !== 'undefined' && VideoPlayer) {
                const video = node.getComponent(VideoPlayer);
                if (video) videoPlayers.push(video);
            }

            if (typeof AudioSource !== 'undefined' && AudioSource) {
                const audio = node.getComponent(AudioSource);
                if (audio) audioSources.push(audio);
            }

            node.children.forEach(child => traverse(child));
        };

        traverse(this.node.scene);

        this.managedVideos = videoPlayers;
        this.managedAudios = audioSources;

        console.log(`Collected ${videoPlayers.length} videos, ${audioSources.length} audios.`);
    }

    setupGlobalTouchListener() {
        // Cách 1: Lắng nghe trên tất cả button trong scene
        this.registerButtonListeners();

        // Cách 2: Backup - lắng nghe touch event toàn cục cho trường hợp touch không phải button
        input.once(Input.EventType.TOUCH_START, this.handleFirstTouch, this);
        console.log('Global touch and button listeners registered');
    }

    registerButtonListeners() {
        let allButtons: Button[] = [];

        // Ưu tiên sử dụng danh sách button được assign manually
        if (this.priorityButtons.length > 0) {
            allButtons = this.priorityButtons;
            console.log(`Using ${allButtons.length} manually assigned priority buttons`);
        } else {
            // Fallback: Tự động tìm tất cả button trong scene
            const traverse = (node: Node) => {
                if (typeof Button !== 'undefined' && Button) {
                    const button = node.getComponent(Button);
                    if (button) {
                        allButtons.push(button);
                    }
                }
                node.children.forEach(child => traverse(child));
            };

            traverse(this.node.scene);
            console.log(`Auto-found ${allButtons.length} buttons in scene`);
        }

        // Đăng ký listener cho tất cả button
        allButtons.forEach(button => {
            if (button && button.node) {
                button.node.once(Node.EventType.TOUCH_START, this.handleFirstTouch, this);
            }
        });

        console.log(`Registered touch listeners on ${allButtons.length} buttons`);
    }

    handleFirstTouch() {
        // Tránh gọi nhiều lần
        if (this.hasTriggeredFirstTouch) {
            console.log('First touch already handled, ignoring...');
            return;
        }

        this.hasTriggeredFirstTouch = true;
        console.log('First touch detected! Unmuting and playing all media.');

        // Phát sự kiện ngay lần đầu click
        EventHandler.emitEvents(this.firstClickHandlers);
        console.log('First click event handlers triggered');

        // Kiểm tra và thu thập lại media nếu cần
        if (!this.managedVideos || !this.managedAudios ||
            this.managedVideos.length === 0 && this.managedAudios.length === 0) {
            console.log('Media arrays are null or empty, re-collecting...');
            this.collectAllMedia();
        }

        // Bước 3.1: Bật lại tiếng cho tất cả video với null check
        if (this.managedVideos && this.managedVideos.length > 0) {
            this.managedVideos.forEach(video => {
                if (video && video.isValid) {
                    video.mute = false;
                }
            });
            console.log(`Unmuted ${this.managedVideos.length} videos`);
        }

        // Bước 3.2: Bật (play) tất cả các nguồn âm thanh với null check
        if (this.managedAudios && this.managedAudios.length > 0) {
            this.managedAudios.forEach(audio => {
                if (audio && audio.isValid) {
                    // audio.play();
                }
            });
            console.log(`Started ${this.managedAudios.length} audios`);
        }
    }
}
