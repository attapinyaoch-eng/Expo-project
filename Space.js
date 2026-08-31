const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ====================================
// RESPONSIVE CANVAS
// ====================================

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 400;
const ASPECT_RATIO = WORLD_WIDTH / WORLD_HEIGHT;

let scale = 1;

// ====================================
// SPACECRAFT
// ====================================

const ship = {
    x: 2.0,
    y: 2.0,
    velocity: 0,
    mass: 2
};

// ====================================
// RESPONSIVE CANVAS RESIZING
// ====================================

function resizeCanvas() {

    // Available screen width
    const maxWidth = Math.min(
        window.innerWidth - 20,
        WORLD_WIDTH
    );

    // Never make the canvas wider than the screen
    const width = Math.max(maxWidth, 1);

    // Maintain 800:400 aspect ratio
    const height = width / ASPECT_RATIO;

    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    updateScale();

    // --------------------------------
    // Keep spacecraft vertically centered
    // --------------------------------

    ship.y =
        (canvas.clientHeight / 2) /
        PIXELS_PER_METER;

    // --------------------------------
    // Keep spacecraft horizontally visible
    // --------------------------------

    const widthMeters =
        canvas.clientWidth / PIXELS_PER_METER;

    const margin =
        0.8;

    ship.x = Math.max(
        margin,
        Math.min(
            ship.x,
            widthMeters - margin
        )
    );
}

window.addEventListener(
    "resize",
    resizeCanvas
);

// ====================================
// SCALE
// ====================================

function updateScale() {

    scale =
        canvas.clientWidth /
        WORLD_WIDTH;
}

// ====================================
// SIMULATION CONSTANTS
// ====================================

const FPS = 60;
const DT = 1 / FPS;

// 100 pixels = 1 meter
const PIXELS_PER_METER = 100;

// ====================================
// CONTROLS
// ====================================

const voltageSlider =
    document.getElementById("voltage");

const voltageText =
    document.getElementById("voltageValue");

let voltage =
    Number(voltageSlider.value);

voltageSlider.oninput = () => {

    voltage =
        Number(
            voltageSlider.value
        );

    voltageText.textContent =
        voltage.toLocaleString() +
        " V";
};

// ====================================
// THRUSTER BUTTON
// ====================================

let thrusterOn = false;

const toggleButton =
    document.getElementById("toggle");

toggleButton.onclick = () => {

    thrusterOn =
        !thrusterOn;

    toggleButton.textContent =
        thrusterOn
            ? "Stop Thruster"
            : "Start Thruster";
};

// ====================================
// STARS
// ====================================

const stars = [];

function createStars() {

    stars.length = 0;

    for (
        let i = 0;
        i < 140;
        i++
    ) {

        stars.push({

            x:
                Math.random() *
                WORLD_WIDTH,

            y:
                Math.random() *
                WORLD_HEIGHT,

            size:
                Math.random() * 2 +
                0.5,

            speed:
                Math.random() * 0.8 +
                0.2
        });
    }
}

// ====================================
// ION PARTICLES
// ====================================

const particles = [];

function createParticle() {

    const shipPixelX =
        ship.x *
        PIXELS_PER_METER;

    const shipPixelY =
        ship.y *
        PIXELS_PER_METER;

    particles.push({

        x:
            shipPixelX -
            25 * scale,

        y:
            shipPixelY +
            (
                Math.random() -
                0.5
            ) *
            12 *
            scale,

        vx:
            (
                -2 -
                voltage / 3000
            ) *
            scale,

        vy:
            (
                Math.random() -
                0.5
            ) *
            scale,

        size:
            (
                1 +
                Math.random() * 2
            ) *
            scale,

        life: 1
    });
}

// ====================================
// UPDATE STARS
// ====================================

function updateStars() {

    for (
        const star of stars
    ) {

        star.x -=
            star.speed *
            scale;

        // Loop stars
        if (
            star.x < 0
        ) {

            star.x =
                canvas.clientWidth;

            star.y =
                Math.random() *
                canvas.clientHeight;
        }
    }
}

// ====================================
// DRAW STARS
// ====================================

function drawStars() {

    ctx.fillStyle =
        "white";

    for (
        const star of stars
    ) {

        ctx.globalAlpha =
            Math.random() *
            0.5 +
            0.5;

        ctx.beginPath();

        ctx.arc(

            star.x,

            star.y,

            star.size *
            scale,

            0,

            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

// ====================================
// UPDATE PARTICLES
// ====================================

function updateParticles() {

    for (
        let i =
            particles.length - 1;

        i >= 0;

        i--
    ) {

        const p =
            particles[i];

        p.x += p.vx;

        p.y += p.vy;

        p.life -= 0.02;

        if (
            p.life <= 0 ||
            p.x < 0
        ) {

            particles.splice(
                i,
                1
            );
        }
    }
}

// ====================================
// DRAW PARTICLES
// ====================================

function drawParticles() {

    particles.forEach(
        p => {

            ctx.beginPath();

            ctx.fillStyle =
                "#00d9ff";

            ctx.shadowBlur =
                8 * scale;

            ctx.shadowColor =
                "#00d9ff";

            ctx.globalAlpha =
                p.life;

            ctx.arc(

                p.x,

                p.y,

                p.size,

                0,

                Math.PI * 2
            );

            ctx.fill();
        }
    );

    ctx.globalAlpha = 1;

    ctx.shadowBlur = 0;
}

// ====================================
// SPACE BACKGROUND
// ====================================

function drawSpace() {

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;

    // --------------------------------
    // Deep space background
    // --------------------------------

    const gradient =
        ctx.createLinearGradient(

            0,
            0,
            0,
            height
        );

    gradient.addColorStop(
        0,
        "#02030b"
    );

    gradient.addColorStop(
        0.5,
        "#07142c"
    );

    gradient.addColorStop(
        1,
        "#010208"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(

        0,
        0,
        width,
        height
    );

    // --------------------------------
    // Blue nebula
    // --------------------------------

    const nebula =
        ctx.createRadialGradient(

            width * 0.75,
            height * 0.4,
            0,

            width * 0.75,
            height * 0.4,
            width * 0.5
        );

    nebula.addColorStop(
        0,
        "rgba(40,80,180,0.15)"
    );

    nebula.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
        nebula;

    ctx.fillRect(

        0,
        0,
        width,
        height
    );
}

// ====================================
// DRAW SPACECRAFT
// ====================================

function drawShip() {

    // =================================
    // Convert physics position to pixels
    // =================================

    const shipX =
        ship.x *
        PIXELS_PER_METER;

    const shipY =
        ship.y *
        PIXELS_PER_METER;

    // =================================
    // RESPONSIVE SHIP SIZE
    // =================================

    const shipWidth =
        Math.max(
            32,
            55 * scale
        );

    const shipHeight =
        Math.max(
            18,
            30 * scale
        );

    // =================================
    // BODY
    // =================================

    ctx.fillStyle =
        "#b8c5d6";

    ctx.beginPath();

    ctx.moveTo(

        shipX +
        shipWidth,

        shipY
    );

    ctx.lineTo(

        shipX +
        10 * scale,

        shipY -
        shipHeight / 2
    );

    ctx.lineTo(

        shipX,

        shipY
    );

    ctx.lineTo(

        shipX +
        10 * scale,

        shipY +
        shipHeight / 2
    );

    ctx.closePath();

    ctx.fill();

    // =================================
    // COCKPIT
    // =================================

    ctx.fillStyle =
        "#208cff";

    ctx.beginPath();

    ctx.arc(

        shipX +
        35 * scale,

        shipY,

        7 * scale,

        0,

        Math.PI * 2
    );

    ctx.fill();

    // =================================
    // SOLAR PANELS
    // =================================

    ctx.fillStyle =
        "#263f70";

    // Panel height automatically scales
    // with the available screen height.

    const panelHeight =
        Math.min(
            40 * scale,
            canvas.clientHeight * 0.20
        );

    const panelWidth =
        Math.max(
            5,
            7 * scale
        );

    // Upper solar panel
    ctx.fillRect(

        shipX +
        10 * scale,

        shipY -
        panelHeight,

        panelWidth,

        panelHeight
    );

    // Lower solar panel
    ctx.fillRect(

        shipX +
        10 * scale,

        shipY +
        15 * scale,

        panelWidth,

        panelHeight
    );

    // =================================
    // THRUSTER
    // =================================

    ctx.fillStyle =
        "#555";

    const thrusterWidth =
        Math.max(
            5,
            8 * scale
        );

    const thrusterHeight =
        Math.max(
            10,
            16 * scale
        );

    ctx.fillRect(

        shipX -
        7 * scale,

        shipY -
        thrusterHeight / 2,

        thrusterWidth,

        thrusterHeight
    );

    // =================================
    // ION EXHAUST
    // =================================

    if (thrusterOn) {

        const glow =
            10 +
            (
                voltage /
                50000
            ) *
            20;

        ctx.shadowBlur =
            glow * scale;

        ctx.shadowColor =
            "#00d9ff";

        ctx.fillStyle =
            "#00d9ff";

        // Make exhaust responsive
        // and prevent it from leaving
        // the left side of the canvas.

        const exhaustLength =
            Math.min(

                35 * scale,

                Math.max(
                    0,
                    shipX - 5
                )
            );

        ctx.beginPath();

        ctx.moveTo(

            shipX -
            7 * scale,

            shipY -
            6 * scale
        );

        ctx.lineTo(

            shipX -
            exhaustLength,

            shipY
        );

        ctx.lineTo(

            shipX -
            7 * scale,

            shipY +
            6 * scale
        );

        ctx.closePath();

        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

// ====================================
// KEEP SHIP COMPLETELY ON SCREEN
// ====================================

function keepShipOnScreen() {

    const widthMeters =
        canvas.clientWidth /
        PIXELS_PER_METER;

    const heightMeters =
        canvas.clientHeight /
        PIXELS_PER_METER;

    // --------------------------------
    // Approximate total ship dimensions
    // including solar panels.
    // --------------------------------

    const horizontalMargin =
        0.65;

    const verticalMargin =
        Math.min(
            0.55,
            heightMeters * 0.35
        );

    // --------------------------------
    // Horizontal boundary
    // --------------------------------

    ship.x =
        Math.max(
            horizontalMargin,

            Math.min(
                ship.x,

                widthMeters -
                horizontalMargin
            )
        );

    // --------------------------------
    // Vertical boundary
    // --------------------------------

    ship.y =
        Math.max(
            verticalMargin,

            Math.min(
                ship.y,

                heightMeters -
                verticalMargin
            )
        );
}

// ====================================
// ANIMATION
// ====================================

function animate() {

    updateScale();

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;

    // =================================
    // CLEAR
    // =================================

    ctx.clearRect(

        0,
        0,
        width,
        height
    );

    // =================================
    // SPACE
    // =================================

    drawSpace();

    updateStars();

    drawStars();

    // =================================
    // PHYSICS
    // =================================

    let thrust = 0;

    let acceleration = 0;

    if (thrusterOn) {

        /*
            Educational ion-thruster model.

            50,000 V =
            approximately 0.5 N
            in this simulation.
        */

        thrust =
            voltage *
            0.00001;

        // F = ma

        const force =
            thrust;

        acceleration =
            force /
            ship.mass;

        // Update velocity

        ship.velocity +=
            acceleration *
            DT;

        // Small numerical damping

        ship.velocity *=
            0.999;

        // Update position

        ship.x +=
            ship.velocity *
            DT;

        // Create ion particles

        createParticle();
        createParticle();
    }

    // =================================
    // KEEP SHIP INSIDE SCREEN
    // =================================

    keepShipOnScreen();

    // =================================
    // PARTICLES
    // =================================

    updateParticles();

    drawParticles();

    // =================================
    // SPACECRAFT
    // =================================

    drawShip();

    // =================================
    // INFORMATION
    // =================================

    ctx.fillStyle =
        "white";

    const textSize =
        Math.max(
            12,
            width / 45
        );

    ctx.font =
        `${textSize}px Arial`;

    const textX =
        15;

    const lineHeight =
        textSize * 1.8;

    ctx.fillText(

        "Voltage: " +
        voltage.toLocaleString() +
        " V",

        textX,
        lineHeight
    );

    ctx.fillText(

        "Velocity: " +
        ship.velocity.toFixed(3) +
        " m/s",

        textX,
        lineHeight * 2
    );

    ctx.fillText(

        "Acceleration: " +
        acceleration.toFixed(4) +
        " m/s²",

        textX,
        lineHeight * 3
    );

    ctx.fillText(

        "Estimated Thrust: " +
        thrust.toFixed(4) +
        " N",

        textX,
        lineHeight * 4
    );

    ctx.fillText(

        "Force: " +
        thrust.toFixed(4) +
        " N",

        textX,
        lineHeight * 5
    );

    ctx.fillText(

        "Environment: Space / Vacuum",

        textX,
        lineHeight * 6
    );

    // =================================
    // LOOP
    // =================================

    requestAnimationFrame(
        animate
    );
}

// ====================================
// START
// ====================================

resizeCanvas();

createStars();

animate();