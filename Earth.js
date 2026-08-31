const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ------------------------------------
// Responsive Canvas
// ------------------------------------

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 400;
const ASPECT_RATIO = WORLD_WIDTH / WORLD_HEIGHT;

function resizeCanvas() {

    const maxWidth =
        Math.min(
            window.innerWidth - 20,
            WORLD_WIDTH
        );

    const width =
        Math.max(maxWidth, 300);

    const height =
        width / ASPECT_RATIO;

    const dpr =
        window.devicePixelRatio || 1;

    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";

    canvas.width =
        width * dpr;

    canvas.height =
        height * dpr;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    updateScale();
}

window.addEventListener(
    "resize",
    resizeCanvas
);


// ------------------------------------
// Scaling
// ------------------------------------

let scale = 1;

function updateScale() {

    scale =
        canvas.clientWidth /
        WORLD_WIDTH;

}


// ------------------------------------
// Simulation Constants
// ------------------------------------

const FPS = 60;
const DT = 1 / FPS;

const PIXELS_PER_METER = 100;


// ------------------------------------
// Voltage
// ------------------------------------

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
        voltage + " V";

};


// ------------------------------------
// Thruster Button
// ------------------------------------

let thrusterOn = false;

document.getElementById("toggle").onclick =
    () => {

        thrusterOn =
            !thrusterOn;

        document.getElementById(
            "toggle"
        ).textContent =
            thrusterOn
                ? "Stop Thruster"
                : "Start Thruster";

    };


// ------------------------------------
// Cart
// ------------------------------------

const cart = {

    x: 1.2,

    velocity: 0,

    mass: 2

};


// ------------------------------------
// Particles
// ------------------------------------

const particles = [];

function createParticle() {

    const cartPixelX =
        cart.x *
        PIXELS_PER_METER;

    const groundHeight =
        canvas.clientHeight * 0.2;

    const cartPixelY =
        canvas.clientHeight -
        groundHeight;


    particles.push({

        x:
            cartPixelX -
            8 * scale,

        y:
            cartPixelY -
            18 * scale +
            Math.random() *
            20 * scale,

        vx:
            (
                -2 -
                voltage / 2500
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
                2 +
                Math.random() * 2
            ) *
            scale,

        life: 1

    });

}


// ------------------------------------
// Update Particles
// ------------------------------------

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
            p.life <= 0
        ) {

            particles.splice(
                i,
                1
            );

        }

    }

}


// ------------------------------------
// Draw Particles
// ------------------------------------

function drawParticles() {

    particles.forEach(
        p => {

            ctx.beginPath();

            ctx.fillStyle =
                "blue";

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

            ctx.globalAlpha = 1;

        }
    );

}


// ==================================================
// CLOUD SYSTEM
// ==================================================

const clouds = [];


// ------------------------------------
// Create Clouds
// ------------------------------------

function createClouds() {

    clouds.length = 0;

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        clouds.push({

            x:
                Math.random() *
                WORLD_WIDTH,

            y:
                70 +
                Math.random() *
                100,

            width:
                70 +
                Math.random() *
                70,

            height:
                25 +
                Math.random() *
                20,

            speed:
                0.15 +
                Math.random() *
                0.3,

            opacity:
                0.45 +
                Math.random() *
                0.35

        });

    }

}


// ------------------------------------
// Update Clouds
// ------------------------------------

function updateClouds() {

    for (
        const cloud of clouds
    ) {

        cloud.x -=
            cloud.speed *
            scale;


        // --------------------------------
        // CLOUD LOOP
        // --------------------------------

        if (
            cloud.x +
            cloud.width <
            0
        ) {

            cloud.x =
                canvas.clientWidth +
                Math.random() *
                100;

            cloud.y =
                70 +
                Math.random() *
                100;

        }

    }

}


// ------------------------------------
// Draw Cloud
// ------------------------------------

function drawCloud(cloud) {

    const x =
        cloud.x;

    const y =
        cloud.y;

    const w =
        cloud.width *
        scale;

    const h =
        cloud.height *
        scale;


    ctx.save();

    ctx.globalAlpha =
        cloud.opacity;


    // Cloud shadow

    ctx.fillStyle =
        "rgba(170, 180, 190, 0.8)";


    ctx.beginPath();

    ctx.ellipse(
        x + w * 0.5,
        y + h * 0.75,
        w * 0.5,
        h * 0.35,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Main cloud

    ctx.fillStyle =
        "rgba(255, 255, 255, 0.9)";


    ctx.beginPath();


    // Left cloud

    ctx.arc(
        x + w * 0.25,
        y + h * 0.55,
        h * 0.45,
        0,
        Math.PI * 2
    );


    // Middle cloud

    ctx.arc(
        x + w * 0.48,
        y + h * 0.35,
        h * 0.65,
        0,
        Math.PI * 2
    );


    // Right cloud

    ctx.arc(
        x + w * 0.72,
        y + h * 0.55,
        h * 0.5,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.restore();

}


// ------------------------------------
// Draw All Clouds
// ------------------------------------

function drawClouds() {

    for (
        const cloud of clouds
    ) {

        drawCloud(cloud);

    }

}


// ------------------------------------
// Ground
// ------------------------------------

function drawGround() {

    const groundHeight =
        canvas.clientHeight *
        0.2;


    ctx.fillStyle =
        "#555";


    ctx.fillRect(

        0,

        canvas.clientHeight -
        groundHeight,

        canvas.clientWidth,

        groundHeight

    );

}


// ------------------------------------
// Cart
// ------------------------------------

function drawCart() {

    const cartX =
        cart.x *
        PIXELS_PER_METER;

    const groundHeight =
        canvas.clientHeight *
        0.2;

    const cartY =
        canvas.clientHeight -
        groundHeight;


    const cartWidth =
        40 * scale;

    const cartHeight =
        25 * scale;

    const wheelRadius =
        6 * scale;


    // --------------------------------
    // Cart body
    // --------------------------------

    ctx.fillStyle =
        "silver";


    ctx.fillRect(

        cartX,

        cartY -
        cartHeight,

        cartWidth,

        cartHeight

    );


    // --------------------------------
    // Wheels
    // --------------------------------

    ctx.fillStyle =
        "black";


    ctx.beginPath();


    ctx.arc(

        cartX +
        8 * scale,

        cartY,

        wheelRadius,

        0,

        Math.PI * 2

    );


    ctx.arc(

        cartX +
        32 * scale,

        cartY,

        wheelRadius,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // --------------------------------
    // Thruster
    // --------------------------------

    ctx.fillStyle =
        "black";


    ctx.fillRect(

        cartX -
        6 * scale,

        cartY -
        18 * scale,

        6 * scale,

        10 * scale

    );

}


// ------------------------------------
// Animation
// ------------------------------------

function animate() {

    updateScale();


    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;


    // --------------------------------
    // Clear
    // --------------------------------

    ctx.clearRect(

        0,
        0,
        width,
        height

    );


    // --------------------------------
    // Sky
    // --------------------------------

    const sky =
        ctx.createLinearGradient(

            0,
            0,
            0,
            height

        );


    sky.addColorStop(
        0,
        "#4aaee8"
    );

    sky.addColorStop(
        1,
        "#a9e1ff"
    );


    ctx.fillStyle =
        sky;


    ctx.fillRect(

        0,
        0,
        width,
        height

    );


    // --------------------------------
    // CLOUD ANIMATION
    // --------------------------------

    updateClouds();

    drawClouds();


    // --------------------------------
    // Ground
    // --------------------------------

    drawGround();


    // --------------------------------
    // Physics
    // --------------------------------

    let thrust = 0;

    let acceleration = 0;


    if (thrusterOn) {

        // Educational model
        // 10000 V = 0.1 N

        thrust =
            voltage *
            0.00001;


        // Newton's Second Law

        acceleration =
            thrust /
            cart.mass;


        // Update velocity

        cart.velocity +=
            acceleration *
            DT;


        // Rolling friction

        cart.velocity *=
            0.995;


        // Position in meters

        cart.x +=
            cart.velocity *
            DT;


        // Ion particles

        createParticle();

        createParticle();

    }


    // --------------------------------
    // Reset Cart
    // --------------------------------

    const cartWidthMeters =
        40 /
        PIXELS_PER_METER;


    if (
        cart.x >
        width /
        PIXELS_PER_METER
    ) {

        cart.x =
            -cartWidthMeters;

    }


    // --------------------------------
    // Draw Particles
    // --------------------------------

    updateParticles();

    drawParticles();


    // --------------------------------
    // Draw Cart
    // --------------------------------

    drawCart();


    // --------------------------------
    // Information
    // --------------------------------

    ctx.fillStyle =
        "white";


    const textSize =
        Math.max(
            12,
            width / 45
        );


    ctx.font =
        `${textSize}px Arial`;


    const textX = 20;

    const lineHeight =
        textSize * 2;


    ctx.fillText(

        "Voltage: " +
        voltage +
        " V",

        textX,

        lineHeight

    );


    ctx.fillText(

        "Velocity: " +
        cart.velocity.toFixed(3) +
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

        "Environment: Earth",

        textX,

        lineHeight * 5

    );


    // --------------------------------
    // Animation Loop
    // --------------------------------

    requestAnimationFrame(
        animate
    );

}


// ------------------------------------
// Start
// ------------------------------------

resizeCanvas();

createClouds();

animate();