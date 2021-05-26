import {DataCursor} from './DataCursor.mjs';
import {BitString} from './BitString.mjs';

export var Sequence = function (fields, options) {

    var OptCount = 0;
    var Options = Object.assign({}, options);
    var extension = false;

    for (let i = 0; i < fields.length; i++) {
        let f = fields[i];
        if (f.extension) {
            Options.extendable = extension = true;
        } else if (extension) {
            f.extension = true;
        } else {
            if (f.default !== undefined)
                f.optional = true;
            if (f.optional)
                OptCount++;
        }
    }

    if (Options.extendable)
        OptCount++;

    var C = class Sequence {

        constructor() {

        }

        static from_oer(dc, options) {
            var x = new this();
            var initIndex = dc.index;
            var keep_buffer;
            if (options) {
                keep_buffer = options.keep_buffer;
                options.keep_buffer = undefined;
            }
            try {
                var extBit = 0;
                var opts;
                var opIdx = 0;
                var exIdx = 0;
                if (OptCount) {
                    // read optional map
                    opts = BitString.from_oer(dc, OptCount);
                    if (Options.extendable)
                        extBit = opts[opIdx++];
                }
                // read base part
                let i = 0;
                for (let i = 0; i < fields.length; i++) {
                    let f = fields[i];
                    if (f.extension) break;
                    if (f.name === undefined) continue;
                    if (f.optional) {
                        if (!opts[opIdx++]) {
                            if (f.default !== undefined) {
                                x[f.name] = f.default;
                            }
                            continue;
                        }
                    }
                    Object.defineProperty(x, f.name, {
                        __proto__: null, enumerable: true, writable: true,
                        value: f.type ? f.type.from_oer(dc, options) : null
                    });
                    if (f.key) {
                        options = Object.assign(options);
                        options[f.key]  = x[f.name];
                    }
                }
                if (extBit) {
                    // read extensions
                    let exts = BitString.from_oer(dc);
                    for (; i < fields.length; i++) {
                        if (f.name === undefined) continue;
                        if (exts[exIdx++]) {
                            var l = Length.read(dc);
                            var odc = new DataCursor(dc, l);
                            x[f.name] = f.type.from_oer(odc, options);
                            dc.proceed(l);
                        } else if (f.default !== undefined) {
                            x[f.name] = f.default;
                        }
                    }
                }
            }
            catch (e) {
                throw e;
            }
            if (keep_buffer) {
                Object.defineProperty(x, 'oer', {
                    __proto__: null,
                    value: new Uint8Array(dc.buffer, dc.byteOffset + initIndex, dc.index - initIndex)
                });
            }
            return x;
        }
    };

    C.fields = fields;
    return C;
};

//module.exports = Sequence;
