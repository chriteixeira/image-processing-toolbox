'use strict'
const fs = require('fs');
const readimage = require("readimage");

var ImageToolbox = function(){

};

ImageToolbox.prototype.imageDiff = function(image1Path, image2Path){
    var file1 = fs.readFileSync(image1Path);
    var file2 = fs.readFileSync(image2Path);

    var image1Data = null;
    var image2Data = null;

    function calculateDiff(){
        if(image1Data !== undefined && image2Data !== undefined){

            console.log(image1Data);

            var result = [];

            for(var i=0; i < image1Data.data.length; i+=4){
                var r1 = image1Data.data[i];
                var g1 = image1Data.data[i+1];
                var b1 = image1Data.data[i+2];
                var a1 = image1Data.data[i+3];
                var r2 = image2Data.data[i];
                var g2 = image2Data.data[i+1];
                var b2 = image2Data.data[i+2];
                var a2 = image2Data.data[i+3];
                if(r1 !== r2 || 
                    b1 !== b2 ||
                    r1 !== r2){
                        result.push(255);
                        result.push(255);
                        result.push(255);
                        result.push(0);
                }
                else{
                    result.push(0);
                    result.push(0);
                    result.push(0);
                    result.push(0);
                }

                //TODO: write image to file
            }
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