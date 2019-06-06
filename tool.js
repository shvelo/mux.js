const fs = require('fs'),
    muxjs = require('./lib'),
    { exec } = require('child_process'),
    input = process.argv[2],
    output = process.argv[3] || "output.mp4",
    dumpOutput = [output, 'txt'].join('.');

if (!input) {
    throw new Error('please specify input file!');
}

const transmuxer = new muxjs.mp4.Transmuxer({
    'keepOriginalTimestamps': true,
    'iv': new Uint8Array([0xf3, 0xc5, 0xe0, 0x36, 0x1e, 0x66, 0x54, 0xb2, 0x8f, 0x80, 0x49, 0xc7, 0x78, 0xb2, 0x39, 0x46]),
    'iv_size': 16,
    'pssh': "AAAANHBzc2gBAAAAEHfv7MCyTQKs4zweUuL7SwAAAAHzxeA2HmZUso+AScd4sjlGAAAAAA==",
    'kid': new Uint8Array([0xf3, 0xc5, 0xe0, 0x36, 0x1e, 0x66, 0x54, 0xb2, 0x8f, 0x80, 0x49, 0xc7, 0x78, 0xb2, 0x39, 0x46])
});

var first = true,
    dataToWrite;

fs.unlinkSync(output);

transmuxer.on('data', (data) => {
    if (first) {
        console.log("writing to", output);
        console.log("writing init segment", data.initSegment.length, 'bytes');
        dataToWrite = Buffer.concat([data.initSegment, data.data]);
        first = false;
    } else {
        dataToWrite = data.data;
    }
    console.log("writing data", data.data.length, 'bytes');
    fs.appendFile(output, dataToWrite, (err) => { if (err) throw err; });
});

transmuxer.on('done', () => {
    console.log('done');
    exec(['mp4dump', '--verbosity 3', output].join(' '), (err, stdout) => {
        if (err) {
            console.error('error running mp4dump', err);
            return;
        }
        
        
        console.log('writing mp4dump output', dumpOutput);
        fs.writeFileSync(dumpOutput, stdout);
    });
});

console.log("reading", input);
const stream = fs.createReadStream(input);
stream.on('error', (error) => {
    throw error;
})
stream.on('data', (data) => {
    console.log("read", data.length, 'bytes');
    transmuxer.push(data);
});
stream.on('end', () => {
    transmuxer.flush();
});

