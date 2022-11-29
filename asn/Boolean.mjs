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
    dc.setUint8(b ? 1 : 0);
    return dc;
};

/**
 * @param {DataCursor} dc 
 * @returns {DataCursor}
 */
 Boolean.prototype.to_oer = function (dc) {
    dc.setUint8(this ? 1 : 0);
    return dc
}

const B = Boolean;
export {B as Boolean};
export default B;
