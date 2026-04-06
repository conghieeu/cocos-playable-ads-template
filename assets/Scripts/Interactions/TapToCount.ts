import { _decorator, Component, Node, input, Input, EventTouch, Label, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TapToCount')
export class TapToCount extends Component {
    @property({ type: [EventHandler] })
    tapCompleteEvents: EventHandler[] = [];

    @property({ type: Label })
    countLabel: Label = null;

    @property({})
    private tapCount: number = 0;

    @property({})
    maxTapCount: number = 2;

    start() {
        // Đăng ký sự kiện touch
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

        // Cập nhật label ban đầu
        this.updateCountLabel();
    }

    onDestroy() {
        // Hủy đăng ký sự kiện khi component bị destroy
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    private onTouchStart(event: EventTouch) {
        this.tapCount++; 
        // Cập nhật label hiển thị
        this.updateCountLabel();

        // Kích hoạt event mỗi lần tap khi đạt hoặc vượt maxTapCount
        if (this.tapCount >= this.maxTapCount) {
            this.triggerTapCompleteEvents();
        }
    }

    private triggerTapCompleteEvents() {
        EventHandler.emitEvents(this.tapCompleteEvents);  
    }

    // Hàm cập nhật label hiển thị số đếm
    private updateCountLabel() {
        if (this.countLabel) {
            this.countLabel.string = `${this.tapCount}/${this.maxTapCount}`;
        }
    }

    // Hàm public để reset tap count từ bên ngoài nếu cần
    public resetTapCount() {
        this.tapCount = 0;
        this.updateCountLabel();  
    }

    // Hàm public để lấy tap count hiện tại
    public getCurrentTapCount(): number {
        return this.tapCount;
    }
}


