import {DataCursor} from './DataCursor.mjs';

export class Length extends Number {

    static from_oer(dc) {
        var l = dc.getUint8();
        if (l < 128) {
            return l;
        }
        l -= 128; // l - length of length
        var v = 0;
        for (; l > 0; l--) {
            v = (v * 256) + dc.getUint8(); // big endian mode
        }
        return v;
    }

    static to_oer(dc, r) {
        if (r < 128) {
            dc.setUint8(r);
        } else {
            var l = BigInt.byteCount(r);
            dc.setUint8(128 + l);
            var idx = dc.index;
            var n = r;
            for (let i = l - 1; i >= 0; i--) {
                dc.setUint8(n & 0xFF, idx + i);
                n >>= 8;
            }
            dc.index = idx + l;
        }
        return r;
    }

    to_oer(dc) {
        return Length.to_oer(dc, this);
    }
}
