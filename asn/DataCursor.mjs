const IsLittleEndian = false;

export class DataCursor {
    constructor(buffer, byteOffset, byteLength) {
        if(byteOffset === undefined) byteOffset = 0;
        if (buffer.buffer !== undefined) { // typedarray || DataCursor
            let idx = ((buffer.index !== undefined) ? buffer.index : 0);
            byteOffset += buffer.byteOffset + idx;
            if(byteLength === undefined)
                byteLength = buffer.byteLength - idx;
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
        if (index !== undefined) {
            this.dv.setInt8(index, r);
        } else {
            this.dv.setInt8(this.index++, r);
        }
        return this;
    }
    getUint8(index) {
        if (index !== undefined) this.index = index;
        return this.dv.getUint8(this.index++);
    }
    setUint8(r, index) {
        if (index !== undefined)
            this.dv.setUint8(index, r);
        else
            this.dv.setUint8(this.index++, r);
        return this;
    }
    getInt16(index) {
        if (index !== undefined) this.index = index;
        var r = this.dv.getInt16(this.index, IsLittleEndian);
        this.index += 2;
        return r;
    }
    setInt16(r, index) {
        if (index !== undefined)
            this.dv.setInt16(index, r, IsLittleEndian);
        else {
            this.dv.setInt16(this.index, r, IsLittleEndian);
            this.index += 2;
        }
        return this;
    }
    getUint16(index) {
        if (index !== undefined) this.index = index;
        let r = this.dv.getUint16(this.index, IsLittleEndian);
        this.index += 2;
        return r;
    }
    setUint16(r, index) {
        if (index !== undefined)
            this.dv.setUint16(index, r, IsLittleEndian);
        else {
            this.dv.setUint16(this.index, r, IsLittleEndian);
            this.index += 2;
        }
        return this;
    }
    getInt32(index) {
        if (index !== undefined) this.index = index;
        let r = this.dv.getInt32(this.index, IsLittleEndian);
        this.index += 4;
        return r;
    }
    setInt32(r, index) {
        if (index !== undefined)
            this.dv.setInt32(index, r, IsLittleEndian);
        else {
            this.dv.setInt32(this.index, r, IsLittleEndian);
            this.index += 4;
        }
        return this;
    }
    getUint32(index) {
        if (index !== undefined) this.index = index;
        let r = this.dv.getUint32(this.index, IsLittleEndian);
        this.index += 4;
        return r;
    }
    setUint32(r, index) {
        if (index !== undefined)
            this.dv.setUint32(index, r, IsLittleEndian);
        else {
            this.dv.setUint32(this.index, r, IsLittleEndian);
            this.index += 4;
        }
        return this;
    }
    getInt64(index) {
        if (index !== undefined) this.index = index;
        var h = this.dv.getInt32(this.index, IsLittleEndian);
        var l = this.dv.getInt32(this.index + 4, IsLittleEndian);
        this.index += 8;
        return BigInt(h, l);
    }
    setInt64(r, index) {
        var h, l;
        if (typeof r == 'bigint') {
            r = BigInt.asIntN(64, r);
            h = Number(r >> 32n);
            l = Number(BigInt.asIntN(32, r));
        } else {
            h = 0;
            l = r;
        }
        if (index !== undefined) {
            this.dv.setInt32(index, h, IsLittleEndian);
            this.dv.setInt32(index + 4, l, IsLittleEndian);
        } else {
            this.dv.setInt32(this.index, h, IsLittleEndian);
            this.dv.setInt32(this.index + 4, l, IsLittleEndian);
            this.index += 8;
        }
        return this;
    }
    getUint64(index) {
        if (index !== undefined) this.index = index;
        var h = this.dv.getUint32(this.index, IsLittleEndian);
        var l = this.dv.getUint32(this.index + 4, IsLittleEndian);
        this.index += 8;
        return BigInt(h, l);
    }

    setUint64(r, index) {
        var h, l;
        if (typeof r == 'bigint') {
            r = BigInt.asUintN(64, r);
            h = Number(r >> 32n);
            l = Number(BigInt.asUintN(32, r));
        } else {
            h = 0;
            l = r;
        }
        if (index !== undefined) {
            this.dv.setUint32(index, h, IsLittleEndian);
            this.dv.setUint32(index + 4, l, IsLittleEndian);
        } else {
            this.dv.setUint32(this.index, h, IsLittleEndian);
            this.dv.setUint32(this.index + 4, l, IsLittleEndian);
            this.index += 8;
        }
        return this;
    }

    hasNext() {
        return this.index < this.byteLength;
    }

    proceed(len) {
        var x = this.index;
        this.index += len;
        return x;
    }
    writen() {
        return new DataView(this.dv.buffer, this.dv.byteOffset, this.index);
    }
    copyWithin(tgtIndex, startIndex, endIndex){
        new Uint8Array(this.dv.buffer, this.dv.byteOffset).copyWithin(tgtIndex, startIndex, endIndex)
    }
    
    data(startIndex, len) {
        return new Uint8Array(this.dv.buffer, this.dv.byteOffset + startIndex, len)
    }
}

BigInt.from_oer = function (dc) {
    return dc.getInt64();
};

BigInt.prototype.to_oer = function (dc) {
    return dc.setInt64(this);
};
 