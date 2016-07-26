'use strict'
const fs = require('fs');
const readimage = require("readimage");
var PNG = require("pngjs").PNG;

var ImageToolbox = function () {

};

/*
 * 
 */
ImageToolbox.prototype.invert = function (imagePath) {
    fs.createReadStream(imagePath)
        .pipe(new PNG({
            filterType: 4
        }))
        .on('parsed', function () {

            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;

                    // invert color
                    this.data[idx] = 255 - this.data[idx];
                    this.data[idx + 1] = 255 - this.data[idx + 1];
                    this.data[idx + 2] = 255 - this.data[idx + 2];

                    // and reduce opacity
                    this.data[idx + 3] = this.data[idx + 3] >> 1;
                }
            }
            console.log(this);
            this.pack().pipe(fs.createWriteStream('out.png'));
        });
};

ImageToolbox.prototype.loadImage = function (image, options, callback) {
    //String = path to the file
    if (typeof image === 'string') {
        readimage(fs.readFileSync(image1Path), function (err, image) {
            callback(err, image);
        });
    }
    //Type = array - data array
    //Type = base64
}

ImageToolbox.prototype.diff = function (baseImage, compImage, options) {

    var result = {
        width: image1Data.width,
        height: image1Data.height,
        data: [],
        diffAvg: 0.0
    };

    var resultData = [];

    for (var i = 0; i < image1Data.frames[0].data.length; i += 4) {
        var r1 = image1Data.frames[0].data[i];
        var g1 = image1Data.frames[0].data[i + 1];
        var b1 = image1Data.frames[0].data[i + 2];
        var a1 = image1Data.frames[0].data[i + 3];
        var r2 = image2Data.frames[0].data[i];
        var g2 = image2Data.frames[0].data[i + 1];
        var b2 = image2Data.frames[0].data[i + 2];
        var a2 = image2Data.frames[0].data[i + 3];

        //Calculate the level of difference for each color (alpha will be ignored)
        var diffR = Math.abs(r1 - r2);
        var diffG = Math.abs(g1 - g2);
        var diffB = Math.abs(b1 - b2);

        //Average diff
        var diffAvg = (diffR + diffG + diffB) / 3;

        if (diffAvg == 0) {
            resultData[i] = 0xff;
            resultData[i + 1] = 0xff;
            resultData[i + 2] = 0xff;
            resultData[i + 3] = 0xff;
        }
        else {
            resultData[i] = 0x00;
            resultData[i + 1] = 0x00;
            resultData[i + 2] = 0x00;
            resultData[i + 3] = 0xff;
        }
    }
    result.data = new Buffer(resultData);
    return result;
};

ImageToolbox.prototype.add = function (baseImage, addedImage, options) {

    var result = {
        width: image1Data.width,
        height: image1Data.height,
        data: []
    };

    var resultData = [];

    for (var i = 0; i < image1Data.frames[0].data.length; i += 4) {
        var r1 = image1Data.frames[0].data[i];
        var g1 = image1Data.frames[0].data[i + 1];
        var b1 = image1Data.frames[0].data[i + 2];
        var a1 = image1Data.frames[0].data[i + 3];
        var r2 = image2Data.frames[0].data[i];
        var g2 = image2Data.frames[0].data[i + 1];
        var b2 = image2Data.frames[0].data[i + 2];
        var a2 = image2Data.frames[0].data[i + 3];


        var finalR = Math.min(r1 + r2, 255);
        var finalG = Math.min(g1 + g2, 255);
        var finalB = Math.min(b1 + b2, 255);

        resultData[i] = finalR;
        resultData[i + 1] = finalG;
        resultData[i + 2] = finalB;
        resultData[i + 3] = a2;
    }
    result.data = new Buffer(resultData);

    return result;
};

//Functions to add:
//scale
//tranforms
//pattern match
//filters

ImageToolbox.prototype.readImage = function (filename, callback) {
    var imageData = fs.readFileSync(filename);
    readimage(imageData, callback);
};

ImageToobox.prototype.saveToPNGFile = function (filename, callback) {

}

var im = new ImageToolbox();

//im.readImage('test/img.png', function(){});
im.imageDiff('test/img.png', 'test/img2.png');


module.exports = ImageToolbox;