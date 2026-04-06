import { _decorator, Component, Node, EventHandler, Button, Label, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CooldownTimer')
export class CooldownTimer extends Component {

    // bat dau dem nguoc khi enable node
    @property
    startOnEnable: boolean = false;

    @property
    autoStart: boolean = false; // Tự động bắt đầu cooldown khi khởi động

    @property
    cooldownTime: number = 5; // Thời gian cooldown (giây)

    @property({ tooltip: 'Chỉ cho phép chạy cooldown một lần duy nhất' })
    onlyOnce: boolean = false;

    @property({ tooltip: 'Tự động lặp lại cooldown khi hoàn thành' })
    loop: boolean = false;

    @property({ type: Label, tooltip: 'Label để hiển thị thời gian cooldown (định dạng 00:00)' })
    cooldownLabel: Label = null;

    @property([EventHandler])
    onCooldownComplete: EventHandler[] = []; // Event được kích hoạt sau khi cooldown xong

    @property([EventHandler])
    onStartCooldown: EventHandler[] = []; // Event được kích hoạt khi nhấn nút

    private isOnCooldown: boolean = false;
    private currentCooldownTime: number = 0;
    private hasCompletedOnce: boolean = false;
    private isScheduled: boolean = false;

    start() {
        if (this.autoStart) {
            this.startCooldownWithTime(this.cooldownTime);
        }
    }

    onEnable() {
        if (this.startOnEnable) {
            this.startCooldownWithTime(this.cooldownTime);
        }
    }

    public startCooldownWithTime(number: number) {
        this.cooldownTime = number;
        this.startCooldown();
    }

    public startCooldown() {
        if (this.onlyOnce && (this.isOnCooldown || this.hasCompletedOnce)) {
            // Đã chạy hoặc hoàn tất một lần và cấu hình chỉ cho chạy 1 lần
            return;
        }
        // Dừng bất kỳ cooldown nào đang chạy để tránh memory leak
        this.unschedule(this.updateCooldown);

        // console.log("Starting cooldown countdown...");
        this.isOnCooldown = true;
        this.currentCooldownTime = this.cooldownTime;
        EventHandler.emitEvents(this.onStartCooldown);

        this.updateLabel();

        // Bắt đầu đếm ngược
        this.schedule(this.updateCooldown, 0.1);
        this.isScheduled = true;
    }

    // tôi cần một hàm dủy bỏ mọi đếm ngược hiện tại
    public cancelCooldown() {
        // Hủy mọi lịch updateCooldown hiện tại
        this.unschedule(this.updateCooldown);
        this.isScheduled = false;
        this.isOnCooldown = false;
        this.currentCooldownTime = 0;
        this.updateLabel();
    }

    private updateCooldown() {
        // Nếu đã bị hủy giữa chừng, dừng ngay
        if (!this.isScheduled || !this.isOnCooldown) {
            this.unschedule(this.updateCooldown);
            return;
        }

        this.currentCooldownTime -= 0.1;
        this.updateLabel();

        if (this.currentCooldownTime <= 0) {
            this.completeCooldown();
        }
    }

    private completeCooldown() {
        log("Cooldown complete.", this.node.name, this.currentCooldownTime);
        this.isOnCooldown = false;
        this.isScheduled = false;
        this.currentCooldownTime = 0;
        this.updateLabel();

        if (this.onlyOnce) {
            this.hasCompletedOnce = true;
        }

        // Dừng đếm ngược
        this.unschedule(this.updateCooldown);

        // Kích hoạt tất cả EventHandler
        EventHandler.emitEvents(this.onCooldownComplete);

        // Nếu loop được bật và không phải onlyOnce, tự động bắt đầu lại
        if (this.loop && !this.onlyOnce) {
            this.startCooldown();
        }
    }

    private updateLabel() {
        if (this.cooldownLabel) {
            this.cooldownLabel.string = this.formatTime(this.currentCooldownTime);
        }
    }

    private formatTime(seconds: number): string {
        if (seconds < 0) seconds = 0;
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const minStr = mins < 10 ? '0' + mins : mins.toString();
        const secStr = secs < 10 ? '0' + secs : secs.toString();
        return `${minStr}:${secStr}`;
    }

    // Getter để kiểm tra trạng thái cooldown từ bên ngoài
    public get IsOnCooldown(): boolean {
        return this.isOnCooldown;
    }

    // Getter để lấy thời gian cooldown còn lại
    public get RemainingCooldownTime(): number {
        return this.currentCooldownTime;
    }

    // Method để reset cooldown từ bên ngoài nếu cần
    public resetCooldown() {
        this.isOnCooldown = false;
        this.isScheduled = false;
        this.currentCooldownTime = 0;
        this.hasCompletedOnce = false;
        this.updateLabel();
        this.unschedule(this.updateCooldown);
    }
}