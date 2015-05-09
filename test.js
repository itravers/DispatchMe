var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1/DispatchMe');
var conn = mongoose.connection;
 
var fs = require('fs');
 
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
 
conn.once('open', function () {
    console.log('open');
    var gfs = Grid(conn.db);
 
    // streaming to gridfs
    //filename to store in mongodb
    var writestream = gfs.createWriteStream({
        filename: 'views/grayScale.jade'
    });
    fs.createReadStream('./views/site2.jade').pipe(writestream);
 
    writestream.on('close', function (file) {
        // do something with `file`
        console.log(file.filename + 'Written To DB');
    });
});