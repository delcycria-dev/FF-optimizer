class TouchSmoother {
    constructor(factor = 0.08) {
        this.x = 0; this.y = 0;
        this.factor = factor;
        this.initialized = false;
    }
    update(tx, ty) {
        if (!this.initialized) { this.x = tx; this.y = ty; this.initialized = true; return {x: tx, y: ty}; }
        this.x += (tx - this.x) * this.factor;
        this.y += (ty - this.y) * this.factor;
        return { x: this.x, y: this.y };
    }
    reset() { this.initialized = false; }
}

class RecoilSystem {
    constructor() {
        this.active = false; this.frame = 0;
        this.pattern = [[0,-2], [0,-5], [0,-8], [0.2,-10], [-0.2,-10]]; 
        this.strength = 1.5;
    }
    getCompensation() {
        if (!this.active) return {x:0, y:0};
        let p = this.pattern[this.frame < this.pattern.length ? this.frame : this.pattern.length - 1];
        this.frame++;
        return { x: -p[0] * (this.strength * 0.5), y: -p[1] * this.strength };
    }
    start() { this.active = true; this.frame = 0; }
    stop() { this.active = false; }
}

class BezierProfile {
    constructor() { this.ax = 0.5; this.bx = 0.2; }
    sample(t) { return (this.ax * t * t) + (this.bx * t); }
}
