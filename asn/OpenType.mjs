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
    };
    C.variants = variants;
    return C;
};

OpenType.from_oer = function (dc) {
    return OctetString().from_oer(dc);
};
OpenType.from_uper = function (dc, len) {
    return OctetString().from_uper(dc);
};

