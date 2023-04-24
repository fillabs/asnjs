export class Uint64 {
    static create(v){
        return v ? v : 0;
    }
    static from_oer(dc) {
        return dc.getUint64();
    }
    static to_oer(dc, r) {
        return dc.setUint64(r);
    }
    static from_uper(dc) {
        return dc.getUIntBits(64);
    }
}
