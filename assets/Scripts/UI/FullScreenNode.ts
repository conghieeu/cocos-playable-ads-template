import { _decorator, Component, UITransform, view, sys, screen, Size } from 'cc';
const { ccclass } = _decorator;

@ccclass('FullScreenNode')
export class FullScreenNode extends Component {
    getRealFrameSize(): Size {
        if (screen?.windowSize) return screen.windowSize;
        if (sys.windowPixelResolution) return new Size(sys.windowPixelResolution.width, sys.windowPixelResolution.height);
        return view.getFrameSize();
    }

    updateSize() {
        const frameSize = this.getRealFrameSize();
        const scaleX = view.getScaleX();
        const scaleY = view.getScaleY();
        const uiTrans = this.node.getComponent(UITransform);
        if (uiTrans) {
            uiTrans.width = frameSize.width / scaleX;
            uiTrans.height = frameSize.height / scaleY;
        }
    }

    onLoad() {
        this.updateSize();
        view.on('design-resolution-changed', this.updateSize, this);
    }

    cleanupCameraResources() {
        view.off('design-resolution-changed', this.updateSize, this);
    }
}
