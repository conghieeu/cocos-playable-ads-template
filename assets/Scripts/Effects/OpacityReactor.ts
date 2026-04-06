import { _decorator, Component, UIOpacity, math, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OpacityReactor')
export class OpacityReactor extends Component {

    @property({ tooltip: 'Opacity tại vị trí 0 (0-255)', min: 0, max: 255 })
    minOpacity: number = 0;

    @property({ tooltip: 'Opacity tại vị trí 1 (0-255)', min: 0, max: 255 })
    maxOpacity: number = 255;

    @property({ tooltip: 'Đảo ngược giá trị (1 thành 0, 0 thành 1)' })
    invert: boolean = false;

    private _uiOpacity: UIOpacity | null = null;

    onLoad() {
        this._uiOpacity = this.node.getComponent(UIOpacity);
        if (!this._uiOpacity) {
            this._uiOpacity = this.node.addComponent(UIOpacity);
        }
    }

    /**
     * Hàm test — kéo thả trực tiếp vào Slide Events của Slider.
     */
    public onProcess(slider: Slider, customEventData: string) {
        if (slider && slider.progress !== undefined) {
            const t = this.invert ? 1 - slider.progress : slider.progress;
            const opacity = math.lerp(this.minOpacity, this.maxOpacity, t);
            if (this._uiOpacity) {
                this._uiOpacity.opacity = opacity;
            }
        }
    }
}
