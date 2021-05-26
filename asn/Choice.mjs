import {DataCursor} from './DataCursor.mjs';
import {Length} from './Length.mjs';
import {Tag} from './Tag.mjs';

export var Choice = function (fields, options) {

    var Options = Object.assign({}, options);
    var extendable = false;
    var a = new Array();

    for (let i = 0; i < fields.length; i++) {
        let f = fields[i];
        if (f.extension) {
            Options.extendable = extendable = true;
        } else if (extendable) {
            f.extension = true;
        }
        if (f.name !== undefined || f.type !== undefined) {
            a.push(f);
        }
    }
    fields = a;

    var C = class Choice {
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
                var tag = Tag.from_oer(dc);
                var e_end;
                if (tag.index >= fields.length) {
                    throw new RangeError('[' + initIndex + '] ' + x.constructor.name + ': tag ' + tag.index + ' is greater then field count');
                }
                var f = fields[tag.index];
                if (f === undefined) {
                    console.log("Oups!");
                }
                //                    console.log('' + dc.index + ' Choice [' + tag.index + '] = ' + f.name + (f.extension ? ' (extension)' : ''));
                if (f.extension) {
                    let l = Length.from_oer(dc);
                    e_end = dc.index + l;
                }
                if (f.name) {
                    Object.defineProperty(x, f.name, {
                        __proto__: null, enumerable: true, writable: true,
                        value: f.type ? f.type.from_oer(dc, options) : null
                    });
                    if (e_end !== undefined && e_end !== dc.index) {
                        throw new RangeError('[' + initIndex + '] ' + x.constructor.name + ':  ' + f.name + ': oversized extension');
                    }
                    x.tagIndex = tag.index;
                    x.tagName = f.name;
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
    C.Fields = fields;
    return C;
};
export default Choice;
//module.exports = Choice;
