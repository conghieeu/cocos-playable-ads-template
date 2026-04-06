import { _decorator, Component, UITransform, view, sys, screen, Size, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FullScreenNodeLimited')
export class FullScreenNodeLimited extends Component {

    // --- GIỚI HẠN TỐI ĐA ---
    @property({
        type: CCInteger,
        tooltip: 'Giới hạn chiều rộng TỐI ĐA (tính bằng đơn vị Design Resolution).'
    })
    maxWidth: number = 720;

    @property({
        type: CCInteger,
        tooltip: 'Giới hạn chiều cao TỐI ĐA (tính bằng đơn vị Design Resolution).'
    })
    maxHeight: number = 960;

    // --- GIỚI HẠN TỐI THIỂU ---
    @property({
        type: CCInteger,
        tooltip: 'Giới hạn chiều rộng TỐI THIỂU (tính bằng đơn vị Design Resolution).'
    })
    minWidth: number = 100;

    @property({
        type: CCInteger,
        tooltip: 'Giới hạn chiều cao TỐI THIỂU (tính bằng đơn vị Design Resolution).'
    })
    minHeight: number = 100;

    /**
     * Lấy kích thước pixel vật lý thực tế của màn hình.
     */
    getRealFrameSize(): Size {
        if (screen?.windowSize) return screen.windowSize;
        if (sys.windowPixelResolution) return new Size(sys.windowPixelResolution.width, sys.windowPixelResolution.height);
        return view.getFrameSize();
    }

    /**
     * Cập nhật kích thước của Node, nhưng áp dụng các giới hạn min và max.
     */
    updateSize() {
        const frameSize = this.getRealFrameSize();
        const scaleX = view.getScaleX();
        const scaleY = view.getScaleY();
        const uiTrans = this.node.getComponent(UITransform);

        if (uiTrans) {
            // 1. Tính toán kích thước "full screen" lý tưởng (như code cũ)
            const targetWidth = frameSize.width / scaleX;
            const targetHeight = frameSize.height / scaleY;

            // 2. Kẹp (clamp) kích thước giữa min và max.
            // Logic: Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, VALUE))
            uiTrans.width = Math.min(this.maxWidth, Math.max(this.minWidth, targetWidth));
            uiTrans.height = Math.min(this.maxHeight, Math.max(this.minHeight, targetHeight));
        }
    }

    onLoad() {
        this.updateSize();
        view.on('design-resolution-changed', this.updateSize, this);
    }

    onDestroy() {
        view.off('design-resolution-changed', this.updateSize, this);
    }
}