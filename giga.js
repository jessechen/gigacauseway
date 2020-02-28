class Point {
    constructor(q, r) {
        this.q = q;
        this.r = r;
        this.s = -(q + r);
    }

    static get origin() {
        return new Point(0, 0);
    }

    getBias() {
        if (!this.inBounds()) {
            return 0;
        }
        return biases[this.q + HEX_RADIUS][this.r + HEX_RADIUS];
    }

    getDepth() {
        if (!this.inBounds()) {
            return 0;
        }
        return depths[this.q + HEX_RADIUS][this.r + HEX_RADIUS];
    }

    getNeighbors() {
        return [this,
            new Point(this.q, this.r + 1), new Point(this.q, this.r - 1),
            new Point(this.q + 1, this.r), new Point(this.q - 1, this.r),
            new Point(this.q + 1, this.r - 1), new Point(this.q - 1, this.r + 1)];
    }

    setDepth(depth) {
        if (!this.inBounds()) {
            return;
        }
        if (depth > MAX_DEPTH) {
            depth = MAX_DEPTH;
        }
        if (depth < -MAX_DEPTH) {
            depth = -MAX_DEPTH;
        }
        depths[this.q + HEX_RADIUS][this.r + HEX_RADIUS] = depth;
    }

    inBounds() {
        return this.distance(Point.origin) <= HEX_RADIUS;
    }

    distance(other) {
        return (Math.abs(this.q - other.q)
            + Math.abs(this.r - other.r) +
            Math.abs(this.s - other.s)) / 2
    }
}

const HEX_SIZE = 50;
const HEX_HEIGHT_MULTIPLIER = 100;
const HEX_RADIUS = 5;
const ARRAY_SIZE = HEX_RADIUS * 2 + 1;
const STEP_SIZE = 0.005;
const MAX_DEPTH = 5;
let canvasWidth, canvasHeight;
let biases;
let depths;

function draw() {
    background(240);
    noStroke();
    ambientLight(127);
    pointLight(255, 255, 255, 500, -500, 1200);
    for (let q = -HEX_RADIUS; q <= HEX_RADIUS; q++) {
        for (let r = -HEX_RADIUS; r <= HEX_RADIUS; r++) {
            const point = new Point(q, r);
            if (point.inBounds()) {
                updateDepth(point);
                drawPrism(
                    3 / 2 * HEX_SIZE * q,
                    HEX_SIZE * sqrt(3) / 2 * (2 * r + q),
                    point);
            }
        }
    }
}

function setup() {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    createCanvas(canvasWidth, canvasHeight, WEBGL);
    background(240);
    const bounds = HEX_SIZE * 2 * HEX_RADIUS;
    ortho(-bounds, bounds, -bounds + HEX_HEIGHT_MULTIPLIER, bounds + HEX_HEIGHT_MULTIPLIER, -500, 1000);
    biases = Array.from(Array(ARRAY_SIZE),
        () => Array.from(Array(ARRAY_SIZE),
            () => randomGaussian()));
    depths = Array.from(Array(ARRAY_SIZE),
        () => Array.from(Array(ARRAY_SIZE),
            () => randomGaussian()));
}

function drawPrism(z, x, point) {
    const depth = (point.getDepth() + MAX_DEPTH / 2) * HEX_HEIGHT_MULTIPLIER;
    if (depth > 0) {
        push();
        fill(192);
        if (Math.abs(z - (-mouseY + canvasHeight / 2) + depth / 2) < HEX_SIZE) {
            if (Math.abs(x - (mouseX - canvasWidth / 2)) < HEX_SIZE) {
                point.setDepth(MAX_DEPTH / 2);
            }
        }
        rotateX(3 * TAU / 8);
        translate(x, depth / 2, z);
        cylinder(HEX_SIZE, depth, 6);
        pop();
    }
}

function updateDepth(point) {
    const neighbors = point.getNeighbors();
    const sumDepths = neighbors.map(p => p.getDepth())
        .reduce((acc, depth) => acc + depth);
    const target = sumDepths / neighbors.length;
    const drift = point.getDepth() - point.getBias();
    point.setDepth(point.getDepth() + (STEP_SIZE * (target - 2 * drift)));
}
