import {DataCursor} from './DataCursor.mjs';
import {Length} from './Length.mjs';
import {Uint8} from './Uint8.mjs';

/**
 * @param {number} fixedLength 
 * @returns {iBitString}
 */
export var BitString = function (fixedLength) {
    var C;
    /**
     * @class
     * @extends {boolean[]}
     * @param {number} len
     */
    C = class iBitString extends Array {
        constructor(len) {
            super(len);
        }
        /**
         * @param {DataCursor} dc 
         * @param {number} bitLength 
         * @returns {iBitString}
         */
        static from_oer(dc, bitLength) {
            // read data
            var len, idx, unused;

            const fill = (a, o, u) => {
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

            var a = new this(bitLength);

            idx = 0;
            for (; len > 1; len--) {
                var l = Uint8.from_oer(dc);
                fill(a, l, 0);
            }
            fill(a, Uint8.from_oer(dc), unused);

            return a;
        }

        /**
         * @param {DataCursor} dc 
         * @param {number} bitLength 
         * @returns {iBitString}
         */
        static from_uper(dc, bitLength) {
        }

        /**
         * @param {DataCursor} dc 
         * @param {number|object} bitLength 
         * @returns {DataCursor}
         */
        static to_oer(dc, r, bitLength) {
            if(bitLength === undefined)
                bitLength = fixedLength;
            else if (typeof bitLength === 'object')
                bitLength = bitLength.length;
            if(bitLength === undefined){
                let len = ~~((r.length + 7) / 8);
                // write len including unused bits octet and the unused bits octet
                Length.to_oer(dc, len + 1);
                dc.setUint8(len * 8 - r.length);
                bitLength = r.length;
            }else{
                bitLength = Number.parseInt(bitLength);
            }            
            let x, v = 0;
            for (x = 0; x < bitLength; x++) {
                let bx = x & 7;
                v = v | ((x < r.length && r.at(x)) ? (0x80 >> bx) : 0);
                if (bx == 7) {
                    dc.setUint8(v);
                    v = 0;
                }
            }
            if (x & 7) {
                dc.setUint8(v);
            }
            return dc;
        }
    };

    if (fixedLength !== undefined)
        C.fixedLength = fixedLength;

    return C;
};

/**
 * @function
 * @param {DataCursor} dc 
 * @param {number} bitLength 
 * @returns {iBitString}
 */
 BitString.from_oer = BitString().from_oer;

 /**
 * @function
 * @param {DataCursor} dc 
 * @param {number} bitLength 
 * @returns {iBitString}
 */
 BitString.from_uper = BitString().from_uper;

 /**
 * @function
 * @param {DataCursor} dc
 * @param {Array} r Array of bits to write to OER buffer
 * @param {number} bitLength
 * @returns {iBitString}
 */
  BitString.to_oer = BitString().to_oer;

  /**
 * @function
 * @param {DataCursor} dc
 * @param {Array} r Array of bits to write to OER buffer
 * @param {number} bitLength
 * @returns {iBitString}
 */
  BitString.to_uper = BitString().to_uper;
