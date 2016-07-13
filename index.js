'use strict'
const fs = require('fs');
const readimage = require("readimage");

var ImageToolbox = function(){

}

ImageToolbox.prototype.readImage = function(filename, callback){
    fs.readFile(filename, function(err, data){
        if(err) throw err;
        console.log(data);
        if(callback)
            callback(err,data);
    });
}

var im = new ImageToolbox();

im.readImage('test/img.png');

module.exports = ImageToolbox;