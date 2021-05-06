const fs = require('fs');
const readFile = function(filePath) {
    return new Promise((res, rej)=>{
        let readStream = fs.createReadStream(filePath);
        let data = '';
        readStream
        .on('data', (chunk) => {
            data+=chunk;
        })
        .on('end', function () {
            res(data);
        })
        .on('error', (err) => {
            rej(err);
        });
    });
};
readFile('./data/train-images.idx3-ubyte').then(data => {

});
