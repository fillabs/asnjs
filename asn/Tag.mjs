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
}

//module.exports = Tag;