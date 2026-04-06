import { _decorator, Component, math, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScaleReactor')
export class ScaleReactor extends Component {

    @property({ tooltip: 'Scale tại vị trí 0' })
    minScale: number = 0;

    @property({ tooltip: 'Scale tại vị trí 1' })
    maxScale: number = 1;

    @property({ tooltip: 'Đảo ngược giá trị' })
    invert: boolean = false;

    /**
     * Hàm public — kéo thả vào EventHandler[] của ProgressRelay.
     */
    public onProgress(value: number) {
        const t = this.invert ? 1 - value : value;
        const s = math.lerp(this.minScale, this.maxScale, t);
        this.node.setScale(new Vec3(s, s, s));
    }


}
