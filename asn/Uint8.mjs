export class Uint8 {
    static create(v){
        return v ? v : 0;
    }
    static from_oer(dc) {
        return dc.getUint8();
    }
    static to_oer(dc, r) {
        return dc.setUint8(r);
    }

    static from_uper(dc) {
        return dc.getUIntBits(8);
    }
}

