import {StringBase} from './String.mjs';

export const IA5String = function IA5String(options) {
	return StringBase(options);
};

IA5String.create = function(v) {
    return IA5String().create(v)
}
IA5String.from_oer = function (dc, len) {
    return IA5String(len).from_oer(dc, len);
};

IA5String.to_oer = function (dc, v, len) {
    return IA5String(len).to_oer(dc, v, len);
};
