const size = 50;
const hexRadius = 5;
const arraySize = hexRadius * 2 + 1;
const numberFormat = Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
});
let canvasWidth, canvasHeight;
let biases;

function draw() {
    const centerWidth = canvasWidth / 2;
    const centerHeight = canvasHeight / 2;
    for (let q = -hexRadius; q <= hexRadius; q++) {
        for (let r = -hexRadius; r <= hexRadius; r++) {
            let s = -1 * (q + r);
            if (s >= -hexRadius && s <= hexRadius) {
                drawHexagon(
                    centerWidth + (3 / 2 * size * q),
                    centerHeight + (size * sqrt(3) / 2 * (2 * r + q)),
                    biases[q + hexRadius][r + hexRadius]);
            }
        }
    }
}

function setup() {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    createCanvas(canvasWidth, canvasHeight);
    background(240);
    noLoop();
    biases = Array.from(Array(arraySize),
        () => Array.from(Array(arraySize),
            () => Math.random() * 2 - 1))
}

function mousePressed() {
    loop();
}

function mouseReleased() {
    noLoop();
}

function drawHexagon(x, y, bias) {
    const height = Math.sqrt(3) * size;
    const width = 2 * size;
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
    textSize(24);
    textAlign(CENTER, CENTER);
    fill(0, 15, 85);
    text(numberFormat.format(bias), x, y);
}
