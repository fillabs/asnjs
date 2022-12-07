/**
 * @param {DataCursor} dc 
 * @returns {boolean}
 */
Boolean.from_oer = function (dc) {
    return dc.getUint8() ? true : false;
};

/**
 * @param {DataCursor} dc 
 * @returns {boolean}
 */
 Boolean.from_uper = function (dc) {
    return dc.getBits(1) ? true : false;
};

/**
 * @param {DataCursor} dc 
 * @param {boolean|Boolean} b 
 * @returns {DataCursor}
 */
 Boolean.to_oer = function (dc, b) {
    dc.setUint8(b ? 255 : 0);
    return dc;
};

const B = Boolean;
export {B as Boolean};
export default B;
