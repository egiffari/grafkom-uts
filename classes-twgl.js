class Pokemon3D {
    static OFFSET = 1;
    static START_X = Pokemon3D.OFFSET * 0.5 * -1;
    static START_Y = Pokemon3D.OFFSET * 0.5;
    static START_Z = Pokemon3D.OFFSET / 2 * -1;

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

        let L = Pokemon3D.OFFSET * x + Pokemon3D.START_X;
        let U = Pokemon3D.OFFSET * y - Pokemon3D.START_Y;
        let B = Pokemon3D.START_Z;

        let R = L + Pokemon3D.OFFSET;
        let D = U + Pokemon3D.OFFSET;
        let F = B + Pokemon3D.OFFSET;

        var vertices = [
            vec3(L, D, F),
            vec3(L, U, F),
            vec3(R, U, F),
            vec3(R, D, F),
            vec3(L, D, B),
            vec3(L, U, B),
            vec3(R, U, B),
            vec3(R, D, B)
        ];

        var indices = [a, b, c, a, c, d];


        for (var i = 0; i < indices.length; ++i) {
            this.mesh.push(vertices[indices[i]]);
            this.color.push(vec4(color));
        }
    }

}

function pseudoshadeColor(vertices, r, g, b, a) {
    let res = []
    let counter = 0
    let face = 0
    for (let { } in vertices) {
        if (counter == 6) {
            counter = 0
            face++;
        }
        if (face == 2) {
            face = 0;
        }
        let factor = 1 - (face * 0.1)
        res.push(r * factor)
        res.push(g * factor / 2)
        res.push(b * factor / 2)
        res.push(a)

        counter++;
    }
    return new Uint8Array(res)
}


function solidColor(vertices, r, g, b, a) {
    let res = []
    for (let { } in vertices) {
        res.push(r)
        res.push(g)
        res.push(b)
        res.push(a)
    }
    return new Uint8Array(res)
}

function voxelNormals(normal, numVoxels) {
    let res = []
    let normArray = Array.prototype.slice.call(normal)
    for (let i = 0; i < numVoxels; i++) {
        res = res.concat(normArray)
    }
    return new Float32Array(res)
}

function voxelIndices(indices, numVoxels) {
    let res = []
    let normIndices = Array.prototype.slice.call(indices)
    for (let i = 0; i < numVoxels; i++) {
        for (let x of normIndices) {
            res.push(x + i)
        }
    }
    return new Uint8Array(res)
}