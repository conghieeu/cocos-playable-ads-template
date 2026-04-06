import { _decorator, Component, Slider, EventHandler } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

/**
 * SliderThresholdTrigger
 * Kích hoạt một mảng EventHandler[] khi Slider.progress vượt qua một ngưỡng (threshold) nhất định.
 * Thường dùng để gọi các hành động khi thanh trượt đạt đến hoặc giảm xuống dưới một mức nào đó.
 */
@ccclass('SliderThresholdTrigger')
export class SliderThresholdTrigger extends Component {

    @property({
        tooltip: 'Giá trị ngưỡng (0.0 - 1.0)',
        min: 0,
        max: 1
    })
    public threshold: number = 0.5;

    @property({
        type: [EventHandler],
        tooltip: 'Danh sách các sự kiện được gọi khi progress GIẢM XUỐNG DƯỚI hoặc BẰNG ngưỡng'
    })
    public onBelowThreshold: EventHandler[] = [];

    @property({
        type: [EventHandler],
        tooltip: 'Danh sách các sự kiện được gọi khi progress TĂNG LÊN TRÊN ngưỡng'
    })
    public onAboveThreshold: EventHandler[] = [];

    @property({
        tooltip: 'Nếu bật, sự kiện sẽ chỉ kích hoạt một lần duy nhất kể từ khi script được bật'
    })
    public triggerOnce: boolean = false;

    private _wasBelow: boolean = false;
    private _hasTriggeredBelow: boolean = false;
    private _hasTriggeredAbove: boolean = false;
    private _isInitialized: boolean = false;

    protected onLoad() {
        // Tự động tìm Slider trên cùng Node
        const slider = this.getComponent(Slider);
        if (slider) {
            this.registerSlider(slider);
        }
    }

    private registerSlider(slider: Slider) {
        // Kiểm tra xem đã có event này chưa để tránh đăng ký lặp
        const alreadyRegistered = slider.slideEvents.some(evt =>
            evt.target === this.node &&
            evt.component === 'SliderThresholdTrigger' &&
            evt.handler === 'onSliderUpdate'
        );

        if (!alreadyRegistered) {
            const eventHandler = new EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = 'SliderThresholdTrigger';
            eventHandler.handler = 'onSliderUpdate';
            slider.slideEvents.push(eventHandler);
        }
    }

    /**
     * Hàm này có thể được kéo thả trực tiếp vào Slide Events của thành phần Slider
     */
    public onSliderUpdate(slider: Slider, customEventData?: string) {
        if (!slider) return;

        const currentProgress = slider.progress;
        const isBelow = currentProgress <= this.threshold;

        // Khởi tạo trạng thái lần đầu để tránh trigger ngay khi vừa chạy nếu không cần thiết
        if (!this._isInitialized) {
            this._wasBelow = isBelow;
            this._isInitialized = true;
            return;
        }

        // Kiểm tra xem có sự thay đổi trạng thái (vượt ngưỡng) hay không
        if (isBelow !== this._wasBelow) {
            if (isBelow) {
                // Vừa giảm xuống dưới hoặc bằng ngưỡng
                if (!this.triggerOnce || !this._hasTriggeredBelow) {
                    EventHandler.emitEvents(this.onBelowThreshold, this, currentProgress);
                    this._hasTriggeredBelow = true;
                }
            } else {
                // Vừa tăng lên trên ngưỡng
                if (!this.triggerOnce || !this._hasTriggeredAbove) {
                    EventHandler.emitEvents(this.onAboveThreshold, this, currentProgress);
                    this._hasTriggeredAbove = true;
                }
            }
        }

        this._wasBelow = isBelow;
    }

    /**
     * Reset trạng thái trigger nếu cần dùng lại component (khi triggerOnce = true)
     */
    public resetTrigger() {
        this._hasTriggeredBelow = false;
        this._hasTriggeredAbove = false;
        this._isInitialized = false;
    }
}
