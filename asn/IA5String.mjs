import {DataCursor} from './DataCursor.mjs';
import {Length} from './Length.mjs';
import {Uint8} from './Uint8.mjs';

export var IA5String = function IA5String(fixedLength) {
    var C = class IA5String extends String {
        get fixedLength() {
            return C.fixedLength;
        }
        static from_oer(dc, options) {
            let len = (typeof options === 'object') ? options.length : options;
            if (len === undefined)
                len = this.fixedLength;
            if (len === undefined)
                len = Length.from_oer(dc);
            var v = new Uint8Array(dc.buffer, dc.byteOffset + dc.proceed(len), len);
            var s = String.fromCharCode.apply(null, v);
            return new this(s);
        }
    };
    if (fixedLength !== undefined) {
        C.fixedLength = fixedLength;
    }
    return C;
};

IA5String.from_oer = function (dc, len) {
    return IA5String(len).from_oer(dc, len);
};

//module.exports = IA5String;
