var M3 = {
    identity: function() {
     return [
       1, 0, 0,
       0, 1, 0,
       0, 0, 1,
     ];
    },
    
    projection: function(width, height) {
     return [
       1/width, 0, 0,
       0, 1/height, 0,
       0, 0, 1
     ];
    },
 
   translation: function(tx, ty) {
     return [
       1, 0, 0,
       0, 1, 0,
       0, 0, 1,
     ];
   },
 
   rotation: function(angleInRadians) {
     var c = Math.cos(angleInRadians);
     var s = Math.sin(angleInRadians);
     return [
       c,-s, 0,
       s, c, 0,
       0, 0, 1,
     ];
   },
 
   scaling: function(sx, sy) {
     return [
       sx, 0, 0,
       0, sy, 0,
       0, 0, 1,
     ];
   },
 
   multiply: function(a, b) {
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
 

class Pokemon {
    matrix;
    mesh;
    color;
    gl;

    constructor(gl, name, id) {
        this.gl = gl
        this.name = name
        this.id = id
        this.mesh = []
        this.color = []
        this.matrix = []
    }

    async initPaintedVoxels() {
        var textureCanvas = document.getElementById('texture'+this.id);
        var context = textureCanvas.getContext('2d');
    
        return new Promise ((resolve) => {
            var texture = new Image();
            texture.crossOrigin = "Anonymous"
            texture.src = 'https://raw.githubusercontent.com/egiffari/grafkom-uts/main/images/'+pokemon1+'.png';
            texture.onload = async () => {
                context.drawImage(texture, 0, 0);
                for (let i = 0; i < 64; i++) {
                    var row = []
                    for (let j = 63; j >= 0; j--) {
                        var imgData = context.getImageData(i, j, 1, 1).data;
                        row.push([imgData[0] / 255, imgData[1] / 255, imgData[2] / 255, imgData[3] / 255])
                    }
                    colorArray.push(row)
                }
                resolve(true)
            }
        })
    }

    voxel(x, y, color) {
        quad(x, y, 1, 0, 3, 2, color);
        quad(x, y, 2, 3, 7, 6, color);
        quad(x, y, 3, 0, 4, 7, color);
        quad(x, y, 6, 5, 1, 2, color);
        quad(x, y, 4, 5, 6, 7, color);
        quad(x, y, 5, 4, 0, 1, color);
    }
    
    quad(x, y, a, b, c, d, color) {
        
        let L = OFFSET / 2 * x + START_X;
        let U = OFFSET * y - START_Y;
        let B = START_Z;
    
        let R = L + OFFSET / 2;
        let D = U + OFFSET;
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
            positions.push(vertices[indices[i]]);
            colors.push(vec4(color));
        }
    }
    

    makePixels(name) {

    }
}