import {DataCursor} from './DataCursor.mjs';
import {Length} from './Length.mjs'

export var Integer = function (options, max) {
    var Options = {};
    if (typeof options === 'object') {
        Options = Object.assign(Options, options);
    } else if (typeof options === 'number' || typeof options === 'bigint') {
        Options.min = options;
        if (typeof max === 'number' || typeof max === 'bigint') {
            Options.max = max;
        }
    }
/*
    if (Options.min === undefined) {
        Options.min = Number.MIN_SAFE_INTEGER;
    }
    if (Options.max === undefined) {
        Options.max = Number.MAX_SAFE_INTEGER;
    }
*/
    var C = class Integer extends Number {
        constructor(x) {
            super(x);
        }
        get min() {
            return Options.min;
        }
        get max() {
            return Options.max;
        }
        get extendable() {
            return Integer.Options.extendable;
        }

        static from_oer(dc) {
            var l = Length.from_oer(dc);
            var x = 0;
            if (Options.min >= 0) {
                for (; l > 0; l--) {
                    x = x * 256 + dc.getUint8();
                }
            } else {
                for (; l > 0; l--) {
                    x = x * 256 + dc.getInt8();
                }
            }
            return x;
        }
        static to_oer(dc, r) {
            let l;
            if (typeof r === 'bigint')
                l = BigInt.byteCount(r);
            else {
                r = Number.parseInt(r);
                l = Number.byteCount(r);
            }
            Length.to_oer(dc, l);
            let n = r;
            let idx = dc.index;
            if (Options.min >= 0) {
                for (let i = l - 1; i >= 0; i--) {
                    dc.setUint8(dc, n & 0xFF, idx + i);
                }
                dc.index = idx + l;
            } else {
                for (let i = l - 1; i >= 0; i--) {
                    dc.setInt8(dc, n & 0xFF, idx + i);
                }
                dc.index = idx + l;
            }
            return x;
        }

        static from_uper(dc) {
        }
    };
    C.Options = Options;
    if (Options.min !== undefined) {
        if (Options.max !== undefined) {
            if (!Options.extendable) {
                if (Options.min >= 0) {
                    if (Options.max < 256) {
                        C.from_oer = (dc) => dc.getUint8();
                        C.to_oer = (dc, r) => dc.setUint8(r);
                    }
                    else if (Options.max < 0x10000) {
                        C.from_oer = (dc) => dc.getUint16();
                        C.to_oer = (dc, r) => dc.setUint16(r);
                    }
                    else if (Options.max < 0x100000000) {
                        C.from_oer = (dc) => dc.getUint32();
                        C.to_oer = (dc, r) => dc.setUint32(r);
                    }
                    else if (Options.max < Number.MAX_SAFE_INTEGER) {
                        C.from_oer = (dc) => dc.getUint64();
                        C.to_oer = (dc, r) => dc.setUint64(r);
                    }
                } else {
                    if (Options.min >= -128 && Options.max < 128) {
                        C.from_oer = (dc) => dc.getInt8();
                        C.to_oer = (dc, r) => dc.setInt8(r);
                    }
                    else if (Options.min >= -32768 && Options.max < 32768) {
                        C.from_oer = (dc) => dc.getInt16();
                        C.to_oer = (dc, r) => dc.setInt16(r);
                    }
                    else if (Options.min >= -2147483648 && Options.max < 2147483648) {
                        C.from_oer = (dc) => dc.getInt32();
                        C.to_oer = (dc, r) => dc.setInt32(r);
                    }
                    else if (Options.min >= Number.MIN_SAFE_INTEGER && Options.max < Number.MAX_SAFE_INTEGER) {
                        C.from_oer = (dc) => dc.getInt32();
                        C.to_oer = (dc, r) => dc.setInt32(r);
                    }
                }
            }
            let range = Options.max - Options.min + 1;
            Options.length = Math.log2(range);
            C._from_uper = (dc) => { return Options.min + dc.getBits(Options.length); };
        } else {
            // semi-constraied
            C._from_uper = (dc) => {
                // read length
                var l = Length.from_uper(dc);
                // read bits
                return Options.min + dc.getBits(l);
            };
        }
    } else {
        C._from_uper = (dc) => {
            // read length
            var l = Length.from_uper(dc);
            // read bits
            return dc.getBits(l);
        };
    }
    if (Options.extendable) {
        C.from_uper = (dc) => {
            if (1 === dc.getBits(1)) {
                // read length
                var l = Length.from_uper(dc);
                // read bits
                return dc.getBits(l);
            }
            return this._from_uper(dc);
        };
    } else {
        C.from_uper = C._from_uper;
    }
    return C;
};

//module.exports = Integer;

Integer.from_oer = function (dc) {
    return Integer().from_oer(dc);
};

Integer.to_oer = function (dc, r) {
    return Integer().to_oer(dc, r);
};

Integer.from_uper = function (dc) {
    return Integer().from_uper(dc);
};

