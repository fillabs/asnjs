
import {Int8} from "./asn/Int8.mjs";
import {Int16} from "./asn/Int16.mjs";
import {Int32} from "./asn/Int32.mjs";
import {Int64} from "./asn/Int64.mjs";
import {Uint8} from "./asn/Uint8.mjs";
import {Uint16} from "./asn/Uint16.mjs";
import {Uint32} from "./asn/Uint32.mjs";
import {Uint64} from "./asn/Uint64.mjs";
import {Integer} from "./asn/Integer.mjs";
import {Length} from "./asn/Length.mjs";
import {Boolean} from "./asn/Boolean.mjs";
import {Enumerated} from "./asn/Enumerated.mjs";
import {BitString} from "./asn/BitString.mjs";
import {IA5String} from "./asn/IA5String.mjs";
import {UTF8String} from "./asn/UTF8String.mjs";
import {OctetString} from "./asn/OctetString.mjs";
import {Choice} from "./asn/Choice.mjs";
import {DataCursor} from "./asn/DataCursor.mjs";
import {Sequence} from "./asn/Sequence.mjs";
import {SequenceOf} from "./asn/SequenceOf.mjs";
import {Tag} from "./asn/Tag.mjs";
import {OpenType} from "./asn/OpenType.mjs";
import {Null} from "./asn/Null.mjs";

function createSpanElement(t, v) {
    let s =document.createElement('SPAN');
    s.classList.add('value');
    s.classList.add(t);
    if(v != null){
        if(typeof v === 'function'){
            s.textContent = v();
        }else if(typeof v.toString === 'function'){
            s.textContent = v.toString();
        }else{
          s.textContent = v;
        }
    }
    return s;
}

function createHtmlElement( v ){
    let el;
    if(v == null){
        el = document.createElement('SPAN');
        el.classList.add('null');
        return el;
    }else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'bigint' ){
        return createSpanElement('string', v);
    } else if (typeof v === 'boolean'){
        return createSpanElement('boolean', v?'true':'false');
    }else if (typeof v === 'object'){
        if (typeof v.htmlElement === 'function'){
            return v.htmlElement();
        }else if(Array.isArray(v)){
            el = document.createElement('DIV');
            el.classList.add('array');
            for(let i=0; i<v.length; i++){
                el.appendChild(createHtmlElement( v[i] ));
            }
            return el;
        }else if (typeof v.toString === 'function'){
            return createSpanElement(v.constructor.name.toLowerCase(), v.toString());
        }
    }
    return createSpanElement('unknown', v);
}

var SequenceWeb = function (fields, options) {
    var C = Sequence(fields, options);
    C.prototype.htmlElement = function(){
        let el = document.createElement('DIV');
        el.classList.add('sequence');
        for (let i = 0; i < fields.length; i++) {
            let f = fields[i];
            if (f.name) {
                let v = this[f.name]
                if(v !==  undefined) {
                    let d = document.createElement('DIV');
                    d.classList.add('field');
                    let s = document.createElement('SPAN');
                    s.classList.add('name');
                    s.textContent = f.name;
                    d.appendChild(s);
                    d.appendChild(createHtmlElement(v));
                    el.appendChild(d);
                }
            }
        }
        return el;
    }
    return C;
}

var ChoiceWeb = function (fields, options) {
    var C = Choice(fields, options);
    C.prototype.htmlElement = function(){
        let el = document.createElement('DIV');
        el.classList.add('choice');
        for (let i = 0; i < fields.length; i++) {
            let f = fields[i];
            if (f.name && this[f.name] !== undefined) {
                let d = document.createElement('DIV');
                d.classList.add('field');
                let s = document.createElement('SPAN');
                s.classList.add('name');
                s.textContent = f.name;
                d.appendChild(s);
                d.appendChild(createHtmlElement(this[f.name]));
                el.appendChild(d);
                break;
            }
        }
        return el;
    }
    return C;
}

var BitStringWeb  = function(fixedLength) {
    var C = BitString(fixedLength);
    C.prototype.htmlElement = function() {
        return createSpanElement('bitstring', this);
    }
    return C;
}

BitStringWeb.from_oer = BitStringWeb().from_oer;

var EnumeratedWeb = function(fields){
    var C = Enumerated(fields);
    C.prototype.htmlElement = function(){
        return createSpanElement('enumerated', fields[this.valueOf()] + ' (' + this.toString()+')');
    }
    return C;
}

var IA5StringWeb = function (fixedLength) {
    var C = IA5String(fixedLength);
    C.prototype.htmlElement = function() {
        return createSpanElement('string', this);
    };
    return C;
}
IA5StringWeb.from_oer = function (dc, len) {
    return IA5StringWeb(len).from_oer(dc, len);
};

var UTF8StringWeb = function (fixedLength) {
    var C = UTF8String(fixedLength);
    C.prototype.htmlElement = function() {
        return createSpanElement('string', this);
    };
    return C;
}
UTF8StringWeb.from_oer = function (dc, len) {
    return UTF8StringWeb(len).from_oer(dc, len);
};

var OctetStringWeb = function (fixedLength) {
    var C = OctetString(fixedLength);
    C.prototype.htmlElement = function() {
        return createSpanElement('octetstring', this.toHex());
    }
    return C;
}
OctetStringWeb.from_oer = function (dc, len) {
    return OctetStringWeb(len).from_oer(dc, len);
};
OctetStringWeb.from_uper = function (dc, len) {
    return OctetStringWeb(len).from_uper(dc, len);
};
var IntegerWeb = function(options, max){
    var C = Integer(options, max);
    C.prototype.htmlElement = function(){
        return createSpanElement('number', this);
    }
    return C;
}
IntegerWeb.from_oer = Integer.from_oer;
IntegerWeb.to_oer = Integer.to_oer;
IntegerWeb.from_uper = Integer.from_uper;

export {
    DataCursor,
    Int8, Int16, Int32, Int64, Uint8, Uint16, Uint32, Uint64, Length, Boolean,
    IntegerWeb as Integer,
    EnumeratedWeb as Enumerated,
    BitStringWeb as BitString,
    IA5StringWeb as IA5String,
    UTF8StringWeb as UTF8String,
    OctetStringWeb as OctetString,
    ChoiceWeb as Choice,
    SequenceWeb as Sequence,
    SequenceOf, Tag, OpenType, Null,
    createHtmlElement
} ;
