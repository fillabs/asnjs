export class Int8 {
    static create(v){
        return v ? v : 0;
    }
    static from_oer(dc) {
        return dc.getInt8();
    }
    static to_oer(dc, r) {
        return dc.setInt8(r);
    }
    static from_uper(dc) {
        return dc.getIntBits(8);
    }
}
