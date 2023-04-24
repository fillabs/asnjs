export class Int64 {
    static create(v){
        return v ? v : 0;
    }
    static from_oer(dc) {
        return dc.getInt64();
    }
    static to_oer(dc, r) {
        return dc.setInt64(r);
    }
    static from_uper(dc) {
        return dc.getUIntBits(64);
    }
}
