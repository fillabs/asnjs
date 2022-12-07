import {StringBase} from './String.mjs';

export var UTF8String = function UTFString(fixedLength) {
	return StringBase(fixedLength, "utf-8");
}
