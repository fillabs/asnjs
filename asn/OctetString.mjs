import {DataCursor} from './DataCursor.mjs';
import {Length} from './Length.mjs';
import {Uint8} from './Uint8.mjs';

export var OctetString = function OctetString(fixedLength) {
    var C;
    C = class OctetString extends Uint8Array {
        constructor(buffer, offset, len) {
            super(buffer, offset, len);
        }
        get fixedLength() {
            return C.fixedLength;
        }
        static from_oer(dc, options) {
            let len = (typeof options === 'object') ? options.length : options;
            if (len === undefined)
                len = this.fixedLength;
            if (len === undefined)
                len = Length.from_oer(dc);
            return new this(dc.buffer, dc.byteOffset + dc.proceed(len), len);
        }
        static from_uper(dc, options) {
            let len = (typeof options === 'object') ? options.length : options;
            if (len === undefined)
                len = this.fixedLength;
            if (len === undefined)
                len = Length.from_uper(dc);
            let a = dc.slice(len * 8);
            return new this(a, 0, len);
        }
        dataCursor() {
            return new DataCursor(this.buffer, this.byteOffset, this.byteLength);
        }
        equal(b){
            if(b instanceof Uint8Array){
                if(this === b) return true;
                    if(!b || this.length !== b.length) return false;
                for(let i=0; i<this.length; i++){
                    if(this[i] !== b[i]) return false;
                }
                return true;
            }
            return false;
        }
        static equal(a,b){
            if(a instanceof OctetString)
                return a.equal(b);
            return false; 
        }
        toHex() { // buffer is an ArrayBuffer
            return this
                .map(x => x.toString(16).padStart(2, '0'))
                .join('');
        }
//        [inspect_custom]() {
//            let r = "";
//            let b = Buffer.from(this);
//            for(let i=0; i< this.length; i++)
//                r += "\n  " + b.toString('hex', i, i+16);
//            return r;
//        }
//        dataBitCursor() {
//            return new DataBitCursor(this.buffer, this.byteOffset, this.byteLength);
//        }
    };
    if (fixedLength !== undefined) {
        C.fixedLength = fixedLength;
    }
    return C;
};

OctetString.from_oer = function (dc, len) {
    return OctetString(len).from_oer(dc, len);
};
OctetString.from_uper = function (dc, len) {
    return OctetString(len).from_uper(dc, len);
};

