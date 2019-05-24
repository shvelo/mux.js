var uint8ToBase64 = function (u8Arr) {
    var CHUNK_SIZE = 0x8000; //arbitrary number
    var index = 0;
    var length = u8Arr.length;
    var result = '';
    var slice;
    while (index < length) {
        slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
        result += String.fromCharCode.apply(null, slice);
        index += CHUNK_SIZE;
    }
    return btoa(result);
};

var base64ToUint8 = function (base64) {
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
};

var hexStringToUint8 = function (hexString) {
    return new Uint8Array(
        hexString
            .match(/.{1,4}(?=(.{4})+(?!.))|.{1,4}$/g)
            .map(function(hexNum){ return parseInt('0x' + hexNum) })
    );
};

var uint8ToHexString = function (u8arr) {
    return u8arr.reduce(function(hexString, u8) {
        return hexString + ('0' + u8.toString(16)).substr(-2);
    }, "");
};

module.exports = {
    uint8ToBase64: uint8ToBase64,
    base64ToUint8: base64ToUint8,
    hexStringToUint8: hexStringToUint8,
    uint8ToHexString: uint8ToHexString
};