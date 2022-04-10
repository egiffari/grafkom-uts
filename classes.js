var M3 = { 						//setup 3x3 transformation matrix object
    identity: function () {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    },

    projection: function (width, height) {
        // Note: This matrix flips the Y axis so that 0 is at the top.
        return [
            1 / width, 0, 0,
            0, 1 / height, 0,
            0, 0, 1
        ];
    },

    translation: function (tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    },

    rotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    },

    scaling: function (sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    },

    multiply: function (a, b) {
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];
        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
};

function solidColor(vertices, r, g, b, a) {
    let res = []
    for (let {} in vertices) {
        res.push(r)
        res.push(g)
        res.push(b)
        res.push(a)
    }
    return new Float32Array(res)
}
class TransformationStep {
    amount;
    toggle;
    step;
    logicCallback;

    constructor(amount, logicCallback, step = 0) {
        this.amount = amount;
        this.toggle = true;
        this.step = step;
        this.logicCallback = logicCallback
    }

    next() {
        if (this.toggle) {
            this.step = this.logicCallback(this);
        }
    }
}

class Pokemon3D {
    static OFFSET = 1 / 16 * 1.25 / 4 * 64 * 10;
    static START_X = Pokemon3D.OFFSET * 32 * -1;
    static START_Y = Pokemon3D.OFFSET * 32;
    static START_Z = Pokemon3D.OFFSET / 2;

    mesh;
    color;
    palette;
    name;

    constructor(name) {
        this.mesh = [];
        this.color = [];
        this.palette = [];
        this.name = name;
    }

    async init() {
        await this.initPaintedVoxels()
        this.initVoxels()
    }

    async initPaintedVoxels() {
        var textureCanvas = document.createElement('canvas')
        var context = textureCanvas.getContext('2d');

        return new Promise((resolve) => {
            var texture = new Image();
            texture.crossOrigin = "Anonymous"
            texture.src = 'https://raw.githubusercontent.com/egiffari/grafkom-uts/main/images/' + this.name + '.png';
            texture.onload = async () => {
                context.drawImage(texture, 0, 0);
                for (let i = 0; i < 64; i++) {
                    var row = []
                    for (let j = 63; j >= 0; j--) {
                        var imgData = context.getImageData(i, j, 1, 1).data;
                        row.push([imgData[0] / 255, imgData[1] / 255, imgData[2] / 255, imgData[3] / 255])
                    }
                    this.palette.push(row)
                }
                resolve(true)
            }
        })
    }

    initVoxels() {
        for (let i = 63; i >= 0; i--) {
            for (let j = 63; j >= 0; j--) {
                let color = this.palette[i][j];
                if (color[3] != 0) {
                    this.voxel(i, j, vec4(color[0], color[1], color[2], color[3]))
                }
            }
        }
    }

    voxel(x, y, color) {
        this.quad(x, y, 1, 0, 3, 2, color);
        this.quad(x, y, 2, 3, 7, 6, color);
        this.quad(x, y, 3, 0, 4, 7, color);
        this.quad(x, y, 6, 5, 1, 2, color);
        this.quad(x, y, 4, 5, 6, 7, color);
        this.quad(x, y, 5, 4, 0, 1, color);
    }

    quad(x, y, a, b, c, d, color) {

        let L = Pokemon.OFFSET * x + Pokemon.START_X;
        let U = Pokemon.OFFSET * y - Pokemon.START_Y;
        let B = Pokemon.START_Z;

        let R = L + Pokemon.OFFSET;
        let D = U + Pokemon.OFFSET;
        let F = B + 0;

        var vertices = [
            vec4(L, D, F, 1.0),
            vec4(L, U, F, 1.0),
            vec4(R, U, F, 1.0),
            vec4(R, D, F, 1.0),
            vec4(L, D, B, 1.0),
            vec4(L, U, B, 1.0),
            vec4(R, U, B, 1.0),
            vec4(R, D, B, 1.0)
        ];

        var indices = [a, b, c, a, c, d];


        for (var i = 0; i < indices.length; ++i) {
            this.mesh.push(vertices[indices[i]]);
            this.color.push(vec4(color));
        }
    }

}

class Pokemon {
    static OFFSET = 1 / 16 * 1.25 / 4 * 64 * 10;
    static START_X = Pokemon.OFFSET * 32 * -1;
    static START_Y = Pokemon.OFFSET * 32;
    static START_Z = 0;

    mesh;
    color;
    palette;
    name;
    originMatrix;
    animationMatrix;
    matrixUpdateCallback;

    constructor(name, originMatrix, matrixUpdateCallback) {
        this.mesh = [];
        this.color = [];
        this.palette = [];
        this.name = name;
        this.originMatrix = originMatrix;
        this.animationMatrix = M3.identity();
        this.matrixUpdateCallback = matrixUpdateCallback;
    }

    updateMatrix() {
        this.animationMatrix = this.matrixUpdateCallback();
    }

    async init() {
        await this.initPaintedPixels()
        this.initPixels()
    }

    async initPaintedPixels() {
        var textureCanvas = document.createElement('canvas')
        var context = textureCanvas.getContext('2d');

        return new Promise((resolve) => {
            var texture = new Image();
            texture.crossOrigin = "Anonymous"
            texture.src = 'https://raw.githubusercontent.com/egiffari/grafkom-uts/main/images/' + this.name + '.png';
            texture.onload = async () => {
                context.drawImage(texture, 0, 0);
                for (let i = 0; i < 64; i++) {
                    var row = []
                    for (let j = 63; j >= 0; j--) {
                        var imgData = context.getImageData(i, j, 1, 1).data;
                        row.push([imgData[0] / 255, imgData[1] / 255, imgData[2] / 255, imgData[3] / 255])
                    }
                    this.palette.push(row)
                }
                resolve(true)
            }
        })
    }

    initPixels() {
        for (let i = 63; i >= 0; i--) {
            for (let j = 63; j >= 0; j--) {
                let color = this.palette[i][j];
                if (color[3] != 0) {
                    this.pixel(i, j, vec4(color[0], color[1], color[2], color[3]))
                }
            }
        }
    }

    pixel(x, y, color) {
        this.quad(x, y, 1, 0, 3, 2, color);
    }

    quad(x, y, a, b, c, d, color) {

        let L = Pokemon.OFFSET * x + Pokemon.START_X;
        let U = Pokemon.OFFSET * y - Pokemon.START_Y;
        let B = Pokemon.START_Z;

        let R = L + Pokemon.OFFSET;
        let D = U + Pokemon.OFFSET;
        let F = B + 0;

        var vertices = [
            vec4(L, D, F, 1.0),
            vec4(L, U, F, 1.0),
            vec4(R, U, F, 1.0),
            vec4(R, D, F, 1.0),
            vec4(L, D, B, 1.0),
            vec4(L, U, B, 1.0),
            vec4(R, U, B, 1.0),
            vec4(R, D, B, 1.0)
        ];

        var indices = [a, b, c, a, c, d];


        for (var i = 0; i < indices.length; ++i) {
            this.mesh.push(vertices[indices[i]]);
            this.color.push(vec4(color));
        }
    }
}