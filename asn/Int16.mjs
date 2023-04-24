export class Int16 {
    static create(v){
        return v ? v : 0;
    }
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
