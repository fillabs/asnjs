import {DataCursor} from './DataCursor.mjs';
import {Length} from './Length.mjs';
import {Uint8} from './Uint8.mjs';

export var BitString = function (fixedLength) {

    var C = class BitString extends Array {
        constructor(len) {
            super(len);
        }

        static from_oer(dc, bitLength) {
            // read data
            var len, idx, unused;

            var fill = (a, o, u) => {
                for (let b = 7; b >= u; b--) {
                    a[idx++] = (o >> b) & 1 ? true : false;
                }
            };

            if (fixedLength !== undefined) {
                bitLength = fixedLength;
            }

            if (bitLength !== undefined) {
                len = Math.floor((bitLength + 7) / 8);
                unused = len * 8 - bitLength;
            } else {
                len = Length.from_oer(dc) - 1;
                unused = dc.getUint8();
                bitLength = len * 8 - unused;
            }

            var a = new BitString(bitLength);

            idx = 0;
            for (; len > 1; len--) {
                var l = Uint8.from_oer(dc);
                fill(a, l, 0);
            }
            fill(a, Uint8.from_oer(dc), unused);

            return a;
        }
        static from_uper(dc, bitLength) {
        }
    };
    if (fixedLength !== undefined)
        C.fixedLength = fixedLength;

    return C;
};

BitString.from_oer = BitString().from_oer;

//module.exports = BitString;
