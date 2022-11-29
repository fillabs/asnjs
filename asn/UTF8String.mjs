import {StringBase} from './String.mjs';

export var UTF8String = function UTFString(fixedLength) {
	return StringBase(fixedLength, new TextDecoder("utf-8"));
}
