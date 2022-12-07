import {Integer} from './Integer.mjs';

const Extension = 'EXTENSION';

export var Enumerated = function (fields) {

    let extIndex = undefined;
    fields = fields.reduce((a, v, i) => {
        if (v === Extension) {
            extIndex = i;
        }else
            a.push(v);
        return a;
    }, []);
    
    var C = class Enumerated extends Number {
        constructor(x) {
            super(x);
            this.fields = fields;
        }

        static from_oer(dc) {
            var x = dc.getUint8();
            if (x === 0x80) {
                throw new Error("inconsistent enumeration length");
            }
            if (x > 0x80) {
                var l = x - 0x80;
                x = 0;
                for (; l > 0; l--) {
                    x = x * 256 + dc.getInt8();
                }
            }
            return new this(x);
        }
        
        static to_oer(dc, x) {
            x = Number.parseInt(x);
            if (x > 127) {
                throw new Error("Enum > 127");
            }
            dc.setUint8(x);
            return dc;
        }

        static from_uper(dc) {
            let x = undefined;
            let lb = 0;
            if (extIndex !== undefined) {
                if (1 === ds.getBits(1))
                    lb = extIndex;
            }
            return lb + Integer(0, fields.length - lb - 1).from_uper(dc);
        }

    };
    C.Extension = Extension;
    C.isExtension = function (x) {
        return x === Extension;
    };
    return C;
};

export default Enumerated;
