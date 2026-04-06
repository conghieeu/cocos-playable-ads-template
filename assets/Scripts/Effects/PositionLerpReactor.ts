import { _decorator, Component, Vec3, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PositionLerpReactor')
export class PositionLerpReactor extends Component {

    @property({ type: Vec3, tooltip: 'Vị trí tại giá trị 0' })
    startPos: Vec3 = new Vec3(0, 0, 0);

    @property({ type: Vec3, tooltip: 'Vị trí tại giá trị 1' })
    endPos: Vec3 = new Vec3(0, 0, 0);

    @property({ tooltip: 'Đảo ngược giá trị' })
    invert: boolean = false;

    private _tempVec: Vec3 = new Vec3();

    /**
     * Hàm test — kéo thả trực tiếp vào Slide Events của Slider.
     */
    public onSliderTest(slider: Slider, customEventData: string) {
        if (slider && slider.progress !== undefined) {
            const t = this.invert ? 1 - slider.progress : slider.progress;
            Vec3.lerp(this._tempVec, this.startPos, this.endPos, t);
            this.node.setPosition(this._tempVec);
        }
    }
}
