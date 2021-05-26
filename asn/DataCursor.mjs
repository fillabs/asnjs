const littleEndian = false;

export class DataCursor {
    constructor(buffer, byteOffset, byteLength) {
        if (byteOffset === undefined) byteOffset = 0;
        if (buffer.buffer !== undefined) {
            if (byteLength === undefined)
                byteLength = buffer.byteLength;
            byteOffset = buffer.byteOffset + byteOffset;
            buffer = buffer.buffer;
        }
        this.dv = new DataView(buffer, byteOffset, byteLength);
        this.index = 0;
    }
    get buffer () {
        return this.dv.buffer;
    }

    get byteOffset() {
        return this.dv.byteOffset;
    }

    get byteLength() {
        return this.dv.byteLength;
    }

    getInt8(index) {
        if (index !== undefined) this.index = index;
        return this.dv.getInt8(this.index++);
    }
    setInt8(r, index) {
        if (index !== undefined) this.index = index;
        this.dv.setInt8(this.index++, r);
        return r;
    }
    getUint8(index) {
        if (index !== undefined) this.index = index;
        return this.dv.getUint8(this.index++);
    }
    setUint8(r, index) {
        if (index !== undefined) this.index = index;
        this.dv.setUint8(this.index++, r);
        return r;
    }
    getInt16(index) {
        if (index !== undefined) this.index = index;
        var r = this.dv.getInt16(this.index, littleEndian);
        this.index += 2;
        return r;
    }
    setInt16(r, index) {
        if (index !== undefined) this.index = index;
        this.dv.getInt16(this.index, r, littleEndian);
        this.index += 2;
        return r;
    }
    getUint16(index) {
        if (index !== undefined) this.index = index;
        let r = this.dv.getUint16(this.index, littleEndian);
        this.index += 2;
        return r;
    }
    setUint16(r, index) {
        if (index !== undefined) this.index = index;
        this.dv.setUint16(this.index, r, littleEndian);
        this.index += 2;
        return r;
    }
    getInt32(index) {
        if (index !== undefined) this.index = index;
        let r = this.dv.getInt32(this.index, littleEndian);
        this.index += 4;
        return r;
    }
    setInt32(r, index) {
        if (index !== undefined) this.index = index;
        this.dv.setInt32(this.index, r, littleEndian);
        this.index += 4;
        return r;
    }
    getUint32(index) {
        if (index !== undefined) this.index = index;
        let r = this.dv.getUint32(this.index, littleEndian);
        this.index += 4;
        return r;
    }
    setUint32(r, index) {
        if (index !== undefined) this.index = index;
        this.dv.getUint32(this.index, r, littleEndian);
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
    setInt64(r, index) {
        if (index !== undefined) this.index = index;
        var h, l;
        if (typeof r == 'bigint') {
            r = BigInt.asIntN(64, r);
            h = Number(r >> 32n);
            l = Number(BigInt.asIntN(32, r));
        } else {
            h = 0;
            l = r;
        }
        this.dv.setInt32(this.index, h, littleEndian);
        this.dv.setInt32(this.index + 4, l, littleEndian);
        this.index += 8;
        return r;
    }
    getUint64(index) {
        if (index !== undefined) this.index = index;
        var h = this.dv.getUint32(this.index, littleEndian);
        var l = this.dv.getUint32(this.index + 4, littleEndian);
        this.index += 8;
        return BigInt(h, l);
    }

    setUint64(r, index) {
        if (index !== undefined) this.index = index;
        var h, l;
        if (typeof r == 'bigint') {
            r = BigInt.asUintN(64, r);
            h = Number(r >> 32n);
            l = Number(BigInt.asUintN(32, r));
        } else {
            h = 0;
            l = r;
        }

        var h = this.dv.setUint32(this.index, h, littleEndian);
        var l = this.dv.setUint32(this.index + 4, l, littleEndian);
        this.index += 8;
        return r;
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
    return dc.getInt64();
};

BigInt.prototype.to_oer = function (dc) {
    return dc.setInt64(this);
};

//module.exports = DataCursor;
