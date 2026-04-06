import { _decorator, Component, Vec3, v3, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShakeEffect')
export class ShakeEffect extends Component {
    @property({ tooltip: 'Biên độ X' })
    amplitudeX: number = 10;

    @property({ tooltip: 'Biên độ Y' })
    amplitudeY: number = 10;

    @property({ tooltip: 'Vận tốc rung (pixel/giây). Càng cao rung càng gắt.' })
    speed: number = 300;

    @property({ range: [0, 1, 0.1], tooltip: 'Cường độ tổng quát' })
    shakeStrength: number = 1.0;

    @property playOnStart: boolean = true;

    private _initialPos: Vec3 = v3();
    private _isShaking: boolean = false;
    private _currentTween: Tween<any> = null;

    onLoad() {
        this._initialPos.set(this.node.position);
    }

    start() {
        if (this.playOnStart) this.playShake();
    }

    public playShake() {
        if (this._isShaking) return;
        this._isShaking = true;
        this.runNextShakeStep();
    }

    private runNextShakeStep() {
        if (!this._isShaking) return;

        // 1. Tính toán điểm đến ngẫu nhiên
        const offset = v3(
            (Math.random() - 0.5) * 2 * this.amplitudeX * this.shakeStrength,
            (Math.random() - 0.5) * 2 * this.amplitudeY * this.shakeStrength,
            0
        );
        const targetPos = v3().set(this._initialPos).add(offset);

        // 2. Tính quãng đường thực tế từ vị trí hiện tại đến điểm đến
        const distance = Vec3.distance(this.node.position, targetPos);

        // 3. Tính thời gian dựa trên vận tốc: t = d / v
        // Tránh chia cho 0 nếu speed = 0
        const duration = distance / (this.speed > 0 ? this.speed : 1);

        this._currentTween = tween(this.node)
            .to(duration, { position: targetPos }, { easing: 'sineInOut' })
            .call(() => this.runNextShakeStep())
            .start();
    }

    public stopShake() {
        this._isShaking = false;
        if (this._currentTween) this._currentTween.stop();
        
        // Trả về vị trí gốc với tốc độ ổn định
        const distToOrigin = Vec3.distance(this.node.position, this._initialPos);
        const returnDuration = distToOrigin / this.speed;
        tween(this.node).to(returnDuration, { position: this._initialPos }).start();
    }

    public refreshInitialPosition() {
        this._initialPos.set(this.node.position);
    }
}