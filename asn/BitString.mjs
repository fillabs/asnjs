import {DataCursor} from './DataCursor.mjs';
import {Length} from './Length.mjs';
import {Uint8} from './Uint8.mjs';

/**
 * @param {number|object} typeOptions 
 * @returns {iBitString}
 */
export var BitString = function (typeOptions) {
    var _fixedLength;
    if(typeof typeOptions === 'object'){
        _fixedLength = typeOptions.size;
    }else if(typeOptions !== undefined){
        _fixedLength = Number.parseInt(typeOptions);
    }

    /**
     * @class
     * @extends {boolean[]}
     * @param {number} len
     */
    return class iBitString extends Array {
        get fixedLength() {
            return _fixedLength;
        }
        static get fixedLength() {
            return _fixedLength;
        }
        
        constructor(len) {
            if(len === undefined)
                len = _fixedLength;
	        super(len);
        }
        /**
         * @param {number} len Number of bits 
         * @param {number|Array} v  
         * @returns {iBitString} Newly created BITSTRING
         */
        static create(v) {
            var r = new this();
            if(v !== undefined && r.length > 0){
                if(Array.isArray(v)){
                    let l = (r.length < v.length) ? r.length : v.length;
                    let i = 0;
                    for (; i<l; i++){
                        r[i] = (v[i] ? true : false);
                    }
                    for (; i<r.length; i++){
                        r[i] = false;
                    }
                }else{
                    v = Number.parseInt(v);
                    for (let i=0; i<r.length; i++){
                        r[i] = (v & (1 << (r.length-i-1)));
                    }
                }
            }
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

            if (_fixedLength !== undefined) {
                bitLength = _fixedLength;
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
                bitLength = _fixedLength;
            else if (typeof bitLength === 'object')
                bitLength = bitLength.length??bitLength.size;
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
