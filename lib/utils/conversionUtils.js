var btoa, atob;

// btoa and atob for Node
if (typeof window === 'undefined') {
    btoa = function btoa(str) {
        return Buffer.from(str).toString('base64');
    }
    atob = function atob(str) {
        return Buffer.from(str, 'base64').toString();
    }
} else {
    btoa = window.btoa;
    atob = window.atob;
}

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
    var raw = atob(base64);
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
            .map(function (hexNum) { return parseInt('0x' + hexNum) })
    );
};

var uint8ToHexString = function (u8arr) {
    return u8arr.reduce(function (hexString, u8) {
        return hexString + ('0' + u8.toString(16)).substr(-2);
    }, "");
};

function bigintToUint8(bn) {
    var hex = BigInt(bn).toString(16);
    if (hex.length % 2) { hex = '0' + hex; }

    var len = hex.length / 2;
    var u8 = new Uint8Array(len);

    var i = 0;
    var j = 0;
    while (i < len) {
        u8[i] = parseInt(hex.slice(j, j + 2), 16);
        i += 1;
        j += 2;
    }

    return u8;
}

function uint8ToBigInt(buf) {
    var hex = [];
    u8 = Uint8Array.from(buf);

    u8.forEach(function (i) {
        var h = i.toString(16);
        if (h.length % 2) { h = '0' + h; }
        hex.push(h);
    });

    return BigInt('0x' + hex.join(''));
}

module.exports = {
    uint8ToBase64: uint8ToBase64,
    base64ToUint8: base64ToUint8,
    hexStringToUint8: hexStringToUint8,
    uint8ToHexString: uint8ToHexString,
    bigintToUint8: bigintToUint8,
    uint8ToBigInt: uint8ToBigInt
};