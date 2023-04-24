import {Length} from './Length.mjs';

export function StringBase(typeOptions, encoding='utf-8') {
    const _fixedLength = (typeof typeOptions === 'object') ? (typeOptions.fixedLength??typeOptions.length??typeOptions.size)
                                                           : ((typeOptions !== undefined) ? Number.parseInt(typeOptions) : undefined);

    return class StringBase extends String {
        static {
            this.textDecoder = new TextDecoder(encoding);
            this.textEncoder = new TextEncoder(encoding);
        }
        static get fixedLength() {
            return _fixedLength;
        }
        get fixedLength() {
            return _fixedLength;
        }
        static create (v) {
            var blen;
            if(_fixedLength !== undefined){
                blen = _fixedLength;
            } else if(v && v.length){
                blen = v.length
            } else {
                blen = 256;
            }
            return new this(Buffer.alloc(blen, v));
        }

        static from_oer(dc, options) {
            let len = (typeof options === 'object') ? options.length : options;
            if (len === undefined)
                len = _fixedLength;
            if (len === undefined)
                len = Length.from_oer(dc);
            var v = new Uint8Array(dc.buffer, dc.byteOffset + dc.proceed(len), len);
          	v = this.textDecoder.decode(v);
            return new this(v);
        }
        static to_oer(dc, v, options) {
            let len = _fixedLength;
            if(options !== undefined && options.length !== undefined)
                len = options.length;
            if(len === undefined){
                len = this.length;
                Length.to_oer(dc, len);
            }
            var a = new Uint8Array(dc.buffer, dc.byteOffset + dc.proceed(len), len);
            this.textEncoder.encodeInto(v, a);
            return dc;
        }
    };
};

StringBase.from_oer = function (dc, fixedLength) {
    return StringBase(fixedLength).from_oer(dc, fixedLength);
};

StringBase.to_oer = function (dc, v, fixedLength) {
    return StringBase(fixedLength).to_oer(dc, v, fixedLength);
};
