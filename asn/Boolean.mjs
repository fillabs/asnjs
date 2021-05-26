Boolean.from_oer = function (dc) {
    return dc.getUint8() ? true : false;
};

Boolean.from_uper = function (dc) {
    return dc.getBits(1) ? true : false;
};

Boolean.to_oer = function (dc) {
    return dc.setUint8() ? true : false;
};

//module.exports = Boolean;

const B = Boolean;
export {B as Boolean};
export default B;
