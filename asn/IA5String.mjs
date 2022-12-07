import {StringBase} from './String.mjs';

export var IA5String = function IA5String(fixedLength) {
	return StringBase(fixedLength);
};

IA5String.from_oer = function (dc, len) {
    return IA5String(len).from_oer(dc, len);
};

IA5String.to_oer = function (dc, v, len) {
    return IA5String(len).to_oer(dc, v, len);
};
