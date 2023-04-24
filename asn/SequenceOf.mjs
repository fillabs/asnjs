import {Integer} from './Integer.mjs';

class LengthOfSequence extends Integer(0)
{ }

export var SequenceOf = function (T, options) {
    const _fixedSize = (typeof options ==='object') ? options.size
                                                    : (options !== undefined)?Number.parseInt(options):undefined;

    return class SequenceOf extends Array {
        static get Type() {
            return T;
        }
        get Type() {
            return T;
        }
        get fixedSize() {
            return _fixedSize;
        }
        static get fixedSize() {
            return _fixedSize;
        }

        static create(v) {
            var x;
            if(_fixedSize !== undefined){
                x = new this(_fixedSize);
            }else if(Array.isArray(v)){
                x = new this(v.length);
            }else if(v !== undefined){
                x = new this(Number.parseInt(v));
                v = undefined;
            }
            for(i=0; i<x.length; i++){
                if(Array.isArray(v) && i < v.length){
                    x[i] = T.create(v[i]);
                }else{
                    x[i] = T.create();
                }
            }
            return x;
        }

        static from_oer(dc, options) {
            var count = LengthOfSequence.from_oer(dc);
            let keep_buffer;
            
            if(options){
                keep_buffer = options.keep_buffer;
                options.keep_buffer = undefined;
            }

            // filter out 
            var a = new this(count);
            if(_fixedSize !== undefined && _fixedSize != count){
                console.error("%s: Count of elements (%d) is not conformed to the fixed size constraint(%d)", this.name, count, _fixedSize);
            }
            for (let i = 0; i < count; i++) {
                a[i] = T.from_oer(dc, options);
            }
            if (keep_buffer) {
                Object.defineProperty(a, 'oer', {
                    __proto__: null,
                    value: new Uint8Array(dc.buffer, dc.byteOffset + initIndex, dc.index - initIndex)
                });
            }
            return a;
        }
        static to_oer(dc, r, options){
            var count = r.length;
            if(_fixedSize !== undefined && _fixedSize != count){
                console.error("%s: Count of elements (%d) is not conformed to the fixed size constraint(%d)", this.name, count, _fixedSize);
            }
            LengthOfSequence.to_oer(dc, count);
            for (let i = 0; i < count; i++) {
                T.to_oer(dc, r[i], options)
            }
            return dc;
        }
    };
};
