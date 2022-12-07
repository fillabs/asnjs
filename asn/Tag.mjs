export class Tag {
    constructor(c, t) {
        this.class = c;
        this.index = t;
    }

    get tag() {
        return this.index;
    }

    static from_oer(dc) {
        var x = dc.getUint8();
        var c = x >> 6;
        var t = x & 0x3F;
        if (t === 0x3F) {
            t = 0;
            do {
                x = dc.getUint8();
                t = t * 128 + (x & 0x7F);
            } while (x & 0x80);
        }
        return new Tag(c, t);
    }
    static to_oer(dc, c, t) {
        c = c & 0x03;
        if (t < 64) {
            dc.setUint8((c << 6) | t);
        } else {
            dc.setUint8((c << 6) | 0x3F);

            var f = (x) => {
                let q = ~~(x / 128);
                let r = x - (q * 128);
                if (q) {
                    r += 128;
                    f(q);
                }
                dc.setUint8(r);
            }

            f(t);
        }
        return dc;
    }
};

Tag.UNIVARSAL = 0;
Tag.APPLICATION = 1;
Tag.CONTEXT_SPEC = 2;
Tag.PRIVATE = 3;
