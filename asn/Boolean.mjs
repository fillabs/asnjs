Boolean.from_oer = function (dc) {
    return dc.getUint8() ? true : false;
};

Boolean.from_uper = function (dc) {
    return dc.getBits(1) ? true : false;
};

Boolean.to_oer = function (dc, b) {
    dc.setUint8(b ? 1 : 0);
};

Boolean.prototype.to_oer = function (dc) {
    dc.setUint8(this ? 1 : 0);
}

const B = Boolean;
export {B as Boolean};
export default B;
