import {DataCursor} from './DataCursor.mjs';
import {Length} from './Length.mjs';

const inspect_custom = Symbol.for('nodejs.util.inspect.custom');

export var OctetString = function OctetString(typeOptions) {
    const _fixedLength = (typeof typeOptions === 'object') ? (typeOptions.fixedLength??typeOptions.length??typeOptions.size)
                                                           : ((typeOptions !== undefined) ? Number.parseInt(typeOptions) : undefined);
    
    return class OctetString extends Uint8Array {
        constructor(buffer, offset, len) {
            super(buffer, offset, len);
        }
        get fixedLength() {
            return _fixedLength;
        }
        static get fixedLength() {
            return _fixedLength;
        }
       
        static create(v){
            var blen, len;
            if(_fixedLength !== undefined){
                blen = len = _fixedLength;
            } else if(v){
                if(v.length){
                    blen = len = v.length;
                } else if(v.byteLength){
                    blen = len = v.byteLength;
                    v = Buffer.from(v);
                }
            } else {
                256; len =0;
            }
            return new this(Buffer.alloc(blen, v), 0, len);
        }
    
        static from_oer(dc, options) {
            let len = (typeof options === 'object') ? options.length : options;
            if (len === undefined)
                len = _fixedLength;
            if (len === undefined)
                len = Length.from_oer(dc);
            return new this(dc.buffer, dc.byteOffset + dc.proceed(len), len);
        }
        static from_uper(dc, options) {
            let len = (typeof options === 'object') ? options.length : options;
            if (len === undefined)
                len = _fixedLength;
            if (len === undefined)
                len = Length.from_uper(dc);
            let a = dc.slice(len * 8);
            return new this(a, 0, len);
        }
        static to_oer(dc, v, options) {
            let len = _fixedLength;
            if(options !== undefined && options.length !== undefined)
                len = options.length;
            if(len === undefined){
                len = v.length;
                Length.to_oer(dc, len, options);
            }else if(v.length != len){
                throw new RangeError( this.constructor.name + ': Length must be ' + len);
            }
            let a = new Uint8Array(dc.buffer, dc.byteOffset + dc.index, dc.byteLength - dc.index);
            a.set(v);
            dc.index += len;
            return dc;
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
        [inspect_custom]() {
            let r = "";
            const delim = (this.length > 16) ? "\n  " : ""; 
            let b = Buffer.from(this);
            for(let i=0; i < this.length; i+=16)
                r += delim + b.toString('hex', i, i+16);
            return r;
        }
        dataBitCursor() {
            return new DataBitCursor(this.buffer, this.byteOffset, this.byteLength);
        }
    };
};

OctetString.from_oer = function (dc, fixedLen) {
    return OctetString(fixedLen).from_oer(dc, fixedLen);
};
OctetString.from_uper = function (dc, fixedLen) {
    return OctetString(fixedLen).from_uper(dc, fixedLen);
};

OctetString.to_oer = function (dc, r, fixedLen) {
    return OctetString(fixedLen).to_oer(dc, r, fixedLen);
};

OctetString.to_uper = function (dc, r, fixedLen) {
    return OctetString(fixedLen).to_uper(dc, r, fixedLen);
};

OctetString.create = function (v, fixedLen) {
    return OctetString(fixedLen).create(v);
};

