import {Integer} from './Integer.mjs';

class LengthOfSequence extends Integer(0)
{ }

export var SequenceOf = function (T) {
    var C = class SequenceOf extends Array {
        static from_oer(dc, options) {
            var idx = dc.index;
            var count = LengthOfSequence.from_oer(dc);
            let keep_buffer;
            if (options) {
                keep_buffer = options.keep_buffer;
                options.keep_buffer = undefined;
            }

            // filter out 
            var a = new this(count);
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
            LengthOfSequence.to_oer(dc, count);
            for (let i = 0; i < count; i++) {
                C.Type.to_oer(dc, r[i], options)
            }
            return dc;
        }
        get Type() {
            return C.Type;
        }
    };
    C.Type = T;
    return C;
};
