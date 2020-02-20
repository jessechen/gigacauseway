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
const HEX_RADIUS = 5;
const ARRAY_SIZE = HEX_RADIUS * 2 + 1;
const STEP_SIZE = 0.005;
const MAX_DEPTH = 10;
const numberFormat = Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
});
let canvasWidth, canvasHeight;
let biases;
let depths;

function draw() {
    background(240);
    const centerWidth = canvasWidth / 2;
    const centerHeight = canvasHeight / 2;
    for (let q = -HEX_RADIUS; q <= HEX_RADIUS; q++) {
        for (let r = -HEX_RADIUS; r <= HEX_RADIUS; r++) {
            const point = new Point(q, r);
            if (point.inBounds())  {
                updateDepth(point);
                drawHexagon(
                    centerWidth + (3 / 2 * HEX_SIZE * q),
                    centerHeight + (HEX_SIZE * sqrt(3) / 2 * (2 * r + q)),
                    point.getDepth(),
                    point.getBias());
            }
        }
    }
}

function setup() {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    createCanvas(canvasWidth, canvasHeight);
    background(240);
    biases = Array.from(Array(ARRAY_SIZE),
        () => Array.from(Array(ARRAY_SIZE),
            () => randomGaussian()));
    depths = Array.from(Array(ARRAY_SIZE),
        () => Array.from(Array(ARRAY_SIZE),
            () => randomGaussian()));
}

function drawHexagon(x, y, depth, bias) {
    const height = Math.sqrt(3) * HEX_SIZE;
    const width = 2 * HEX_SIZE;
    stroke(0, 15, 85);
    noFill();
    beginShape();
    vertex(x - 1/4 * width, y - height / 2);
    vertex(x + 1/4 * width, y - height / 2);
    vertex(x + 1/2 * width, y);
    vertex(x + 1/4 * width, y + height / 2);
    vertex(x - 1/4 * width, y + height / 2);
    vertex(x - 1/2 * width, y);
    endShape(CLOSE);
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(80, 0, 80);
    text(numberFormat.format(depth), x, y - 15);
    textSize(16);
    fill(0, 15, 85);
    text(numberFormat.format(bias), x, y + 20);
}

function updateDepth(point) {
    const neighbors = point.getNeighbors();
    const sumDepths = neighbors.map(p => p.getDepth())
        .reduce((acc, depth) => acc + depth);
    const target = sumDepths / neighbors.length;
    const drift = point.getDepth() - point.getBias();
    point.setDepth(point.getDepth() + (STEP_SIZE * (target - 2 * drift)));
}
