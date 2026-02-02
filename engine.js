const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
const debugEl = document.getElementById('debug');

const CONFIG = { baseSens: 2.2, deadzone: 2, smoothing: 0.08 };
const smoother = new TouchSmoother(CONFIG.smoothing);
const recoilSys = new RecoilSystem();
const bezier = new BezierProfile();

let input = { x: window.innerWidth/2, y: window.innerHeight/2, lastX: 0, lastY: 0, active: false, firing: false };

// Sincroniza Sliders
const ids = ['sens', 'smooth', 'recoil', 'dead'];
ids.forEach(id => {
    document.getElementById(id).oninput = (e) => {
        let v = parseFloat(e.target.value);
        document.getElementById('val-'+id).innerText = v;
        if(id === 'sens') CONFIG.baseSens = v;
        if(id === 'smooth') smoother.factor = v;
        if(id === 'recoil') recoilSys.strength = v;
        if(id === 'dead') CONFIG.deadzone = v;
    };
});

canvas.width = window.innerWidth; canvas.height = window.innerHeight;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    let t = e.touches[0];
    if (t.clientX > window.innerWidth - 120 && t.clientY > window.innerHeight - 120) {
        input.firing = true; recoilSys.start();
    } else {
        input.active = true; input.lastX = t.clientX; input.lastY = t.clientY;
        smoother.reset();
    }
}, {passive: false});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    let t = e.touches[0];
    if (input.active) {
        let dx = t.clientX - input.lastX;
        let dy = t.clientY - input.lastY;
        if (Math.abs(dx) > CONFIG.deadzone || Math.abs(dy) > CONFIG.deadzone) {
            input.x += dx * CONFIG.baseSens;
            input.y += dy * CONFIG.baseSens;
        }
        input.lastX = t.clientX; input.lastY = t.clientY;
    }
}, {passive: false});

canvas.addEventListener('touchend', () => { 
    input.firing = false; input.active = false; recoilSys.stop(); 
});

function loop() {
    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (input.firing) {
        let comp = recoilSys.getCompensation();
        input.x += comp.x; input.y += comp.y;
    }

    let pos = smoother.update(input.x, input.y);
    
    ctx.strokeStyle = input.firing ? "#ff4500" : "#00ffcc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 8, 0, Math.PI*2);
    ctx.stroke();

    // Botão de Tiro (área invisível no canto)
    ctx.fillStyle = "rgba(255,69,0,0.1)";
    ctx.fillRect(window.innerWidth - 110, window.innerHeight - 110, 100, 100);

    requestAnimationFrame(loop);
}
loop();
