import {Length} from './Length.mjs';

export function StringBase(fixedLength, encoding) {
    var C = class StringBase extends String {
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
          	v = C.textDecoder.decode(v);
            return new this(v);
        }
        static to_oer(dc, v, options) {
            let len = this.fixedLength;
            if(options !== undefined && options.length !== undefined)
                len = options.length;
            if(len === undefined){
                len = this.length;
                Length.to_oer(dc, len);
            }
            var a = new Uint8Array(dc.buffer, dc.byteOffset + dc.proceed(len), len);
            C.textEncoder.encodeInto(v, a);
            return dc;
        }
    };
    if (fixedLength !== undefined) {
        C.fixedLength = fixedLength;
    }
    if (encoding === undefined) {
        encoding = 'utf-8';
    }
    C.textDecoder = new TextDecoder(encoding);
    C.textEncoder = new TextEncoder(encoding);
    return C;
};

StringBase.from_oer = function (dc, len) {
    return StringBase(len).from_oer(dc, len);
};

StringBase.to_oer = function (dc, v, len) {
    return StringBase(len).to_oer(dc, v, len);
};
