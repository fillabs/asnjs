export class Uint16 {
    static from_oer(dc) {
        return dc.getUint16();
    }
    static to_oer(dc, r) {
        return dc.setUint16(r);
    }
    static from_uper(dc) {
        return dc.getUIntBits(16);
    }
}
