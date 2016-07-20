'use strict'
const fs = require('fs');
const readimage = require("readimage");
var PNG = require("pngjs").PNG;

var ImageToolbox = function(){

};

ImageToolbox.prototype.invert() = function(imagePath){
    fs.createReadStream(imagePath)
        .pipe(new PNG({
            filterType: 4
        }))
        .on('parsed', function() {

            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;

                    // invert color
                    this.data[idx] = 255 - this.data[idx];
                    this.data[idx+1] = 255 - this.data[idx+1];
                    this.data[idx+2] = 255 - this.data[idx+2];

                    // and reduce opacity
                    this.data[idx+3] = this.data[idx+3] >> 1;
                }
            }
            console.log(this);
            this.pack().pipe(fs.createWriteStream('out.png'));
        });
};

ImageToolbox.prototype.imageDiff = function(image1Path, image2Path){
    var file1 = fs.readFileSync(image1Path);
    var file2 = fs.readFileSync(image2Path);

    var image1Data = null;
    var image2Data = null;

    function calculateDiff(){
        if(image1Data !== null && image2Data !== null){

            console.log(image1Data);
            console.log(image2Data);

            var result = new PNG({width: image1Data.width, height: image1Data.height});
            var resultData = [];

            console.log(image1Data.frames[0].data.length);

            for(var i=0; i < image1Data.frames[0].data.length; i+=4){
                var r1 = image1Data.frames[0].data[i];
                var g1 = image1Data.frames[0].data[i+1];
                var b1 = image1Data.frames[0].data[i+2];
                var a1 = image1Data.frames[0].data[i+3];
                var r2 = image2Data.frames[0].data[i];
                var g2 = image2Data.frames[0].data[i+1];
                var b2 = image2Data.frames[0].data[i+2];
                var a2 = image2Data.frames[0].data[i+3];

                if(r1 !== r2 || 
                    b1 !== b2 ||
                    r1 !== r2){
                        resultData[i] = 0x00;
                        resultData[i+1] = 0xff;
                        resultData[i+2] = 0xff;
                        resultData[i+3] = 0x00;
                }
                else{
                    resultData[i] = 0x00;
                    resultData[i+1] = 0xff;
                    resultData[i+2] = 0xff;
                    resultData[i+3] = 0x00;
                }
            }
            result.data = new Buffer(resultData);
            console.log(result);
            result.pack().pipe(fs.createWriteStream('result.png'));
        }

    }

    readimage(file1, function(err, image){
        image1Data = image;
        calculateDiff();
    });

    readimage(file2, function(err, image){
        image2Data = image;
        calculateDiff();
    });

};

ImageToolbox.prototype.readImage = function(filename, callback){
    var imageData = fs.readFileSync(filename);
    readimage(imageData, callback);
};

var im = new ImageToolbox();

//im.readImage('test/img.png', function(){});
im.imageDiff('test/img.png','test/img.png');


module.exports = ImageToolbox;