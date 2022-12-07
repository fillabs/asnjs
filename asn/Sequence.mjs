import {DataCursor} from './DataCursor.mjs';
import {BitString} from './BitString.mjs';
import {Length} from './Length.mjs';
import { OpenType } from 'asnjs';

export var Sequence = function (fields, options) {

    var OptCount = 0;
    var ExtCount = 0;
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
        if(f.extension && f.name){
            ExtCount++;
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
                for (;i < fields.length; i++) {
                    let f = fields[i];
                    if (f.extension){
                        break;    
                    }
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
                        value: f.type ? ((dc, options)=>{
                            if(typeof f.type.from_oer === 'function'){
                                return f.type.from_oer(dc, options);
                            }
                            console.log("Oups!!!");
                            return null;
                        })(dc, options) : null
                    });
                    if (f.key) {
                        options = Object.assign({}, options);
                        options[f.key]  = x[f.name];
                    }
                }
                if (extBit) {
                    // read extensions
                    let exts = BitString.from_oer(dc);
                    for (; i < fields.length; i++) {
                        let f = fields[i];
                        if (f.name === undefined) continue;
                        if (exts[exIdx++]) {
                            var l = Length.from_oer(dc);
                            var odc = new DataCursor(dc, 0, l);
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
                    value: dc.data(initIndex, dc.index - initIndex)
                });
            }
            return x;
        }

        static to_oer(dc, r, options){
            let ext_map;
            let ei = 0, ext_len;
            var keep_buffer;
            if (options) {
                keep_buffer = options.keep_buffer;
                options.keep_buffer = undefined;
            }
            var initIndex = dc.index;
            if(OptCount){
                // write optional map
                let OptMapType = BitString(OptCount)
                let opt_map = new OptMapType;
                let oi = 0;
                if(Options.extendable){
                    oi++;
                    ext_map = new Uint8Array(32);
                    opt_map[0] = false;
                    ext_len = 0;
                }
                for (let i = 0; i < fields.length; i++) {
                    let f = fields[i];
                    if(f.name){
                        if (f.extension){
                            if((ext_map[ei++] = r.hasOwnProperty(f.name))){
                                ext_len = ei;
                            }
                        }else if(f.optional){
                            let v = r[f.name];
                            opt_map[oi++] = (v !== undefined && v != f.default);
                        }
                    }
                }
                if(ext_len > 0){
                    opt_map[0] = true;
                }
                OptMapType.to_oer(dc, opt_map, OptCount);
            }
            // write base part
            for (let i = 0; i < fields.length; i++) {
                let f = fields[i];
                if(f.extension && ext_len > 0 ){
                    // write extension map
                    ext_map = ext_map.subarray(0, ext_len);
                    BitString.to_oer(dc, ext_map)
                    ext_len = 0;
                }
                if(f.name){
                    let v = r[f.name];
                    if(v !== undefined && v != f.default){
                        if(typeof f.type.to_oer != 'function'){
                            throw new TypeError(f.type.name + " has no oer writer");
                        }
                        if(f.extension){
                            dc = OpenType.to_oer(dc, f.type, v, options);
                        } else {
                            dc = f.type.to_oer(dc, v, options);
                        }
                    }
                    if (f.key) {
                        options = Object.assign({}, options);
                        options[f.key]  = v;
                    }
                }
            }
            if (keep_buffer) {
                Object.defineProperty(r, 'oer', {
                    __proto__: null,
                    value: dc.data(initIndex, dc.index - initIndex)
                });
            }
            return dc;
        }
    };

    C.fields = fields;
    return C;
};

