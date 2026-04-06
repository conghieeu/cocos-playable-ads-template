import { _decorator, Component, EventHandler, VideoPlayer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VideoController')
export class VideoController extends Component {
    @property(VideoPlayer)
    videoPlayer: VideoPlayer = null;

    @property([EventHandler])
    onVideoEnd: EventHandler[] = [];

    onLoad() {
        if (this.videoPlayer) {
            this.videoPlayer.node.on(VideoPlayer.EventType.COMPLETED, this.invokeVideoEndEvents, this);
        }
    }

    cleanupCameraResources() {
        if (this.videoPlayer) {
            this.videoPlayer.node.off(VideoPlayer.EventType.COMPLETED, this.invokeVideoEndEvents, this);
        }
    }

    private invokeVideoEndEvents() {
        EventHandler.emitEvents(this.onVideoEnd);
    }
}