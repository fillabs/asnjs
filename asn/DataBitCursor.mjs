import {DataCursor} from './DataCursor.mjs';

export class DataBitCursor extends DataCursor{
    constructor(buffer, byteOffset, byteLength) {
        super(buffer, byteOffset, byteLength);
        this.avail = 8;
    }

    slice(bits) {
        let r = floor(bits / 8);
        let s = bits % 8;
        if (s > this.avail) r++;
        let a = new Uint8Array(this.buffer.slice(this.index, r));
        this.index += r;
        this.avail = 8 - (bits - this.avail) % 8;

        // TODO: shift a to the left


        

    }

    getIntBits(bits, index) {
        if (index !== undefined) this.index = index;

        let toGet = (bits - this.fb + 7) / 8;
        if (this.index + toGet <= this.byteLength) {
            let r = this.getBytes(toGet);
            r = r >> floor((bits - this.fb) / 8);

            let r = this.byte;
            let n = this.fb;
            if (toGet) {
                r <<= 8 * toGet;

                while (toGet) {
                r <<= 8;
                r |= this.dv.getUint8(this.index++);
                toGet--;
            }
            let c = 
                let r = this.byte;

            if (bits > 32) {
                // bigint version
            }

        }

        if (bits <= this.fb) {
            let r = this.byte;
            r >>= (this.fb - bits);
            this.byte <<=


        }
        return this.dv.getInt8(this.index++);
    }
    getUint8(index) {
        if (index !== undefined) this.index = index;
        return this.dv.getUint8(this.index++);
    }
    getInt16(index) {
        if (index !== undefined) this.index = index;
        var r = his.dv.getInt16(this.index, littleEndian);
        this.index += 2;
        return r;
    }
    getUint16(index) {
        if (index !== undefined) this.index = index;
        let r = this.dv.getUint16(this.index, littleEndian);
        this.index += 2;
        return r;
    }
    getInt32(index) {
        if (index !== undefined) this.index = index;
        let r = this.dv.getInt32(this.index, littleEndian);
        this.index += 4;
        return r;
    }
    getUint32(index) {
        if (index !== undefined) this.index = index;
        let r = this.dv.getUint32(this.index, littleEndian);
        this.index += 4;
        return r;
    }
    getInt64(index) {
        if (index !== undefined) this.index = index;
        var h = this.dv.getInt32(this.index, littleEndian);
        var l = this.dv.getInt32(this.index + 4, littleEndian);
        this.index += 8;
        return BigInt(h, l);
    }
    getUint64(index) {
        if (index !== undefined) this.index = index;
        var h = this.dv.getUint32(this.index, littleEndian);
        var l = this.dv.getUint32(this.index + 4, littleEndian);
        this.index += 8;
        return BigInt(h, l);
    }
    hasNext() {
        return this.index < this.byteLength;
    }

    proceed(len) {
        var x = this.index;
        this.index += len;
        return x;
    }
}

BigInt.from_oer = function (dc) {
    return dc.getInt64(dc);
};

//module.exports = DataCursor;
