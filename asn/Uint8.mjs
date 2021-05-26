export class Uint8 {
    static from_oer(dc) {
        return dc.getUint8();
    }
    static to_oer(dc, r) {
        return dc.setUint8(r);
    }

    static from_uper(dc) {
        return dc.getUIntBits(8);
    }
    to_oer(dc) {
        return dc.setUint8(this);
    }
}

//module.exports = Uint8;
