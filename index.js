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
    var cb = callback;
    readimage(imageData, cb(err, image));
};

var im = new ImageToolbox();

im.readImage('test/img.png');

module.exports = ImageToolbox;