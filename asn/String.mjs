import {Length} from './Length.mjs';

export function StringBase(fixedLength, textDecoder) {
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
            if(textDecoder){
            	v = textDecoder.decode(v);
            }else{
            	v = String.fromCharCode.apply(null, v);
            }
            return new this(v);
        }
    };
    if (fixedLength !== undefined) {
        C.fixedLength = fixedLength;
    }
    return C;
};

StringBase.from_oer = function (dc, len) {
    return StringBase(len).from_oer(dc, len);
};

//module.exports = IA5String;
