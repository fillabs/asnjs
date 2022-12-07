import {DataCursor} from "./DataCursor.mjs";
import {Length} from "./Length.mjs";
import {OctetString} from "./OctetString.mjs";

export var OpenType = function OpenType(variants, varName) {
    if (varName === undefined) varName = 'variant';
    var C = class iOpenType {
        
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

        static to_oer(dc, value, options) {
            let variant = (options && options[varName] !== undefined) ? options[varName] : options;
            let v = variants[variant];
            return OpenType.to_oer(dc, v, value, options);
        }
    };
    C.variants = variants;
    return C;
};

OpenType.to_oer = function(dc, inner, value, options) {
    Length.to_oer(dc, 0, options);
    if (inner !== undefined) {
        let startIndex = dc.index;
        if (typeof (inner['to_oer']) === 'function') {
            inner.to_oer(dc, value, options);
        }else if (typeof inner === 'function') {
            inner(dc, value, options);
        } else {
            throw new TypeError('unknown inner type object for OpenType');
        }
        let len = dc.index - startIndex;
        if (len < 128) {
            dc.setUint8(len, startIndex - 1);
        } else {
            let dcLen = new DataCursor(new ArrayBuffer(32));
            Length.to_oer(dcLen, len, options);
            let a = dc.data(startIndex);
            a.copyWithin(dcLen.index, 1, dc.index - startIndex);
            a.set(dcLen);
        }
    }
    return dc;
}

/*
OpenType.from_oer = function (dc, inner) {
    return OctetString().from_oer(dc);
};
OpenType.from_uper = function (dc, len) {
    return OctetString().from_uper(dc);
};
*/
