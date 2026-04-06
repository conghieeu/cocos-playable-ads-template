import { _decorator, Component, Node, sys, AudioSource, VideoPlayer, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CheckDevice')
export class CheckDevice extends Component {
    // event handler để phát sự kiện khi phát hiện thiết bị Android
    @property({ type: [EventHandler] })
    androidDetectedHandlers: EventHandler[] = [];

    start() {
        // Kiểm tra nếu là mobile browser (web trên mobile/Android)
        const isMobileBrowser = sys.platform === sys.Platform.MOBILE_BROWSER; 
        if (isMobileBrowser) {
            // Delay nhỏ để đồng bộ với video1
            console.log("Playing videoPlayer2 on Android mobile browser");
            this.scheduleOnce(() => {
                EventHandler.emitEvents(this.androidDetectedHandlers);
            }, 0);
        }
    }
}