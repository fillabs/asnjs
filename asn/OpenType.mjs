import {DataCursor} from "./DataCursor.mjs";
import {Length} from "./Length.mjs";
import {OctetString} from "./OctetString.mjs";

export var OpenType = function OpenType(variants, varName) {
    if (varName === undefined) varName = 'variant';
    var C = class OpenType {
        
        static from_oer(dc, options) {
            let variant = (options && options[varName] !== undefined) ? options[varName] : options;
            let v = variants[variant];
            let s = OctetString.from_oer(dc);
            if(v !== undefined) {
	            return v.from_oer(s.dataCursor());
	        }
            return s;
        }
        
        static from_uper(dc, options) {
            let variant = (options && options[varName] !== undefined) ? options[varName] : options;
            let v = variants[variant];
            let s = OctetString.from_uper(dc);
            if(v !== undefined) {
                return v.from_uper(s.dataCursor(), options); // TODO: DataBitCirsor
	        }
            return s;
        }

        to_oer(dc, inner) {
            Length.to_oer(dc, 0);
            if (inner !== undefined) {
                let startIndex = dc.index;
                if (typeof inner === 'function') {
                    inner(dc);
                } else if (typeof (inner['to_oer']) === 'function') {
                    inner.to_oer(dc);
                } else {
                    throw new TypeError('unknown inner object for OpenType');
                }
                if ((dc.index - startIndex) < 128) {
                    dc.setUint8(dc.index - startIndex, startIndex - 1);
                } else {
                    let d = new DataCursor(new Buffer(32));
                    Length.to_oer(d, dc.index - startIndex);
                    let a = new Uint8Array(dc.buffer(), startIndex - 1);
                    a.copyWithin(d.index, 1, dc.index - startIndex);
                    a.set(d);
                }
            }
            return dc;
        }
    };
    C.variants = variants;
    return C;
};
/*
OpenType.from_oer = function (dc) {
    return OctetString().from_oer(dc);
};
OpenType.from_uper = function (dc, len) {
    return OctetString().from_uper(dc);
};
*/
