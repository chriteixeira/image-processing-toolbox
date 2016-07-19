'use strict'
const fs = require('fs');
const readimage = require("readimage");
var PNG = require("pngjs").PNG;

var ImageToolbox = function(){

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

            var result = new PNG({width: image1Data.width, heigth: image1Data.heigth});
            result.data = [];

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
                        result.data[i] = 0xff;
                        result.data[i+1] = 0xff;
                        result.data[i+2] = 0xff;
                        result.data[i+3] = 0xff;
                }
                else{
                    result.data[i] = 0xff;
                    result.data[i+1] = 0xff;
                    result.data[i+2] = 0xff;
                    result.data[i+3] = 0xff;
                }
            }
            result.pack().pipe(fs.createWriteStream('result.png')).on('close', function(){
                console.log('Result done!');
            });
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