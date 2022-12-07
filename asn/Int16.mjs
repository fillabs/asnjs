export class Int16 {
    static from_oer(dc) {
        return dc.getInt16();
    }
    static to_oer(dc, r) {
        return dc.setInt16(r);
    }
    static from_uper(dc) {
        return dc.getUIntBits(16);
    }
}
