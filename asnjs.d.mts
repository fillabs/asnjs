declare module "asnjs"{
    export class DataCursor {
        constructor(buffer: Uint8Array|ArrayBuffer, byteOffset?: number, byteLength?: number);
        dv: DataView;
        index?: number;
        get buffer(): ArrayBuffer;
        get byteOffset(): number;
        get byteLength(): number;
        getInt8(index?: number): number;
        setInt8(r: number, index?: number): DataCursor;
        getUint8(index?: number): number;
        setUint8(r: number, index?: number): DataCursor;
        getInt16(index?: number): number;
        setInt16(r: number, index?: number): DataCursor;
        getUint16(index?: number): number;
        setUint16(r: number, index?: number): DataCursor;
        getInt32(index?: number): number;
        setInt32(r: number, index?: number): DataCursor;
        getUint32(index?: number): number;
        setUint32(r: number, index?: number): DataCursor;
        getInt64(index?: number): bigint;
        setInt64(r: number|bigint, index?: number): DataCursor;
        getUint64(index?: number): bigint;
        setUint64(r: number|bigint, index?: number): DataCursor;
        hasNext(): boolean;
        proceed(len: number): number;
    }

    export class iBitString extends Array<boolean>{
        static from_oer(dc: DataCursor, bitLength?: number): iBitString;
        static from_uper(dc: DataCursor, bitLength?: number): iBitString;
        static to_oer(dc: DataCursor, r: any, bitLength?: number): DataCursor;
        to_oer(dc: DataCursor, bitLength?:number):DataCursor;
        readonly fixedLength: number;
    }
    export function BitString(fixedLength?: number): iBitString;

    class NumberOerInterface {
        from_oer(dc: DataCursor): number;
        to_oer(dc: DataCursor, r: number|bigint): DataCursor;
        from_uper(dc: DataCursor): number;
        to_oer(dc: DataCursor): DataCursor;
    }
    export class Int8   extends NumberOerInterface {}
    export class Int16  extends NumberOerInterface {}
    export class Int32  extends NumberOerInterface {}
    export class Int64  extends NumberOerInterface {}
    export class Uint8  extends NumberOerInterface {}
    export class Uint16 extends NumberOerInterface {}
    export class Uint32 extends NumberOerInterface {}
    export class Uint64 extends NumberOerInterface {}
    
    class iInteger extends Number {
        readonly min: number | bigint;
        readonly max: number | bigint;
        readonly extendable: boolean;
        readonly MAX_VALUE: number|bigint;
        readonly MIN_VALUE: number|bigint;
        to_oer(dc: DataCursor): DataCursor;
        static from_oer(dc: DataCursor): number|bigint;
        static to_oer(dc: DataCursor, r: number|bigint): DataCursor;
        static from_uper(dc: DataCursor): number|bigint;
    }
    export default function Integer(options?: {
        min?: number | bigint;
        max?: number | bigint;
        length?: number;
    } | number | bigint, max?: number|bigint): iInteger;
    
    export class Length extends Number {
        static from_oer(dc: DataCursor): Length;
        static to_oer(dc: DataCursor, r: number): DataCursor;
        to_oer(dc: DataCursor): DataCursor;
    }
    
    class iEnumerated extends Number{
        fields: string [];
        to_oer(dc: DataCursor): DataCursor;
        isExtension(x: string): boolean;
    }
    export function Enumerated(fields: string []):{
        new (x: any): iEnumerated;
        from_oer(dc: DataCursor): iEnumerated;
        from_uper(dc: DataCursor): iEnumerated;
        to_oer(dc: DataCursor, r:number): DataCursor;
    };
    export namespace Enumerated {
        function from_uper(dc: DataCursor): iEnumerated;
        function to_oer(dc: DataCursor, r:number): DataCursor;
    }

    export function IA5String(fixedLength?: number): string;
    export namespace IA5String {
        function from_oer(dc: DataCursor, len?: number): string;
        function from_uper(dc: DataCursor, len?: number): string;
    }

    export class iOctetString extends Uint8Array{
        readonly fixedLength: number|undefined;
        readonly BYTES_PER_ELEMENT: number;
        readonly buffer: ArrayBuffer;
        readonly byteLength: number;
        readonly byteOffset: number;
        dataCursor(): DataCursor;
        to_oer(ds:DataCursor):DataCursor;
    }
    export function OctetString(fixedLength?: number):{
        new (buffer: string|ArrayBuffer|Uint8Array, offset?: number, len?: number): iOctetString;
        from_oer(dc: DataCursor,  options?: number|{length:number}): iOctetString;
        from_uper(dc: DataCursor, options?: number|{length:number}): iOctetString;
        equal(b:iOctetString):boolean;
    };
    export namespace OctetString {
        function from_oer(dc: DataCursor,  options?: number|{length:number}): iOctetString;
        function from_uper(dc: DataCursor, options?: number|{length:number}): iOctetString;
        function equal(a:iOctetString, b:iOctetString): boolean;
    }

    export class iChoice {
        to_oer(dc: DataCursor, options?:{
            keep_buffer?:boolean,
        }):DataCursor;
        fields:{
            name:string,
            type:any,
            extension?:boolean 
        }[];
        oer?:Uint8Array;
    }
    export function Choice(
        fields: {
            name:string,
            type:any,
            keep_buffer?:boolean,
            extension?:boolean 
        }[],
        options: {
            extendable?:boolean,
        }
    ): {
        new (): iChoice;
        from_oer(dc: DataCursor, options?: {keep_buffer?:boolean}): {
            tagName:string,
            tagIndex:number,
            [key:string]: any
        };
    }

    export class iSequence {
        to_oer(dc:DataCursor, options?:{
            keep_buffer?:boolean
        }):DataCursor;
        [key:string]:any;
        oer?:Uint8Array
    }
    export function Sequence(
        fields: {
            type?:any,
            key?:any
            name?:string,
            extension?:boolean,
            default?:any,
            optional?:boolean
        }[], options: {
            extendable?:boolean
    }): {
        new (): iSequence;
        from_oer(dc: DataCursor, options: {}): iSequence;
        fields: {
            type?:any,
            key?:any
            name?:string,
            extension?:boolean,
            default?:any,
            optional?:boolean
        }[];
    };

    export class iSequenceOf<T> extends Array<T> {
        oer?:Uint8Array
        Type():T
    }

    export function SequenceOf<T>(type:T):{
        new():iSequenceOf<T>;
        from_oer(dc:DataCursor, options:{keep_buffer?:boolean}):iSequenceOf<T>
        from_uper(dc:DataCursor, options:{keep_buffer?:boolean}):iSequenceOf<T>
    }

    export class Tag {
        static from_oer(dc: DataCursor): Tag;
        static to_oer(dc: DataCursor, c: any, t: any): void;
        constructor(c: any, t: any);
        class: number;
        index: number;
        get tag(): any;
        to_oer(dc: DataCursor): DataCursor;
    }
    export namespace Tag {
        const UNIVARSAL: number;
        const APPLICATION: number;
        const CONTEXT_SPEC: number;
        const PRIVATE: number;
    }
    
    export function OpenType(variants: [], varName?: string): {
        new (): {
            to_oer(dc: DataCursor, inner: Function|Object): DataCursor;
        };
        from_oer(dc: DataCursor, options: any): any;
        from_uper(dc: DataCursor, options: any): any;
        variants: {};
    };
}
