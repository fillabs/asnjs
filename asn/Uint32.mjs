export class Uint32 {
    static create(v){
        return v ? v : 0;
    }
    static from_oer(dc) {
        return dc.getUint32();
    }
    static to_oer(dc, r) {
        return dc.setUint32(r);
    }
    static from_uper(dc) {
        return dc.getUIntBits(32);
    }
}
