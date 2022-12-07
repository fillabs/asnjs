import {Integer, OctetString, OpenType, Uint8, Uint16, Uint32, Sequence, Boolean, Choice} from "../asnjs.mjs"
import {decode_oer, encode_oer} from "./test_utils.mjs"

function run_test(tname, Type, oer, js){
  decode_oer(tname, Type, oer, js);
  encode_oer(tname, Type, js, oer);
}

function testByteCount(v,n){
  let r = Integer.byteCount(v);
  console.log('ByteCount('+v+') == '+n+': ' + ((r == n) ? '\x1b[32mPASSED\x1b[0m' : '\x1b[31mFAILED\x1b[0m [' + r + ']'));
}
testByteCount(0,1);
testByteCount(128,1);
testByteCount(0x2FFFF,3);
testByteCount(0n,1);
testByteCount(0x7FFFFFF,4);
testByteCount(BigInt(0x80000000),4);
testByteCount(BigInt(0xFFFFFFFF) * 2n, 5);

run_test("OString-1", OctetString(), [0x04, 0x01, 0x02, 0x03, 0x04], Uint8Array.from([0x01, 0x02, 0x03, 0x04]));
run_test("OString-2", OctetString(4), [0x01, 0x02, 0x03, 0x04], Uint8Array.from([0x01, 0x02, 0x03, 0x04]));

let a1 = new Array(0x113); a1[0] = 130, a1[1] = 0x01; a1[2] = 0x10; a1.fill(0x20, 3);
run_test("OString-2", OctetString(), a1, Uint8Array.from(a1.slice(3)));
run_test("OString-2", OctetString(0x113), a1, Uint8Array.from(a1));

class SeqTest1 extends Sequence([
  { name: 'v1', type: Uint8 }
]){}
run_test("SeqTest1-1", SeqTest1, [0x10], { v1: 16 });

class SeqTest2 extends Sequence([
  { name: 'v1', type: Uint8 },
  { name: 'v2', type: Boolean, optional:true }
]){}
run_test("SeqTest2-1", SeqTest2, [0x80, 0x01, 0xFF], { v1: 1, v2: true })
run_test("SeqTest2-2", SeqTest2, [0x00, 0x01], { v1: 1 })

class SeqTest3 extends Sequence([
  { name: 'v1', type: Uint8 },
  { name: 'v2', type: Uint8, default:16 }
]){}
run_test("SeqTest3-1", SeqTest3, [0x80, 0x01, 0x01], { v1: 1, v2: 1 })
run_test("SeqTest3-2", SeqTest3, [0x00, 0x01], { v1: 1, v2: 16 })

class SeqTest4 extends Sequence([
  { name: 'v1', type: Uint8 },
  { extension: true}
]){}
run_test("SeqTest4-1", SeqTest4, [0x00, 0x01], { v1: 1 })

class SeqTest5 extends Sequence([
  { name: 'v1', type: Uint8 },
  { extension: true},
  { name: 'vex', type: Uint8 },
]){}
run_test("SeqTest5-1", SeqTest5, [0x00, 0x01], { v1: 1 })
run_test("SeqTest5-1", SeqTest5, [0x80, 0x01, 0x02, 0x07, 0x80, 0x01, 0x05], { v1: 1, vex: 5 })

class SeqTest6 extends Sequence([
  { name: 'v1', type: Uint8 },
  { name: 'vex', type: Uint8, extension:true },
]){}
run_test("SeqTest6-1", SeqTest6, [0x00, 0x01], { v1: 1 })
run_test("SeqTest6-1", SeqTest6, [0x80, 0x01, 0x02, 0x07, 0x80, 0x01, 0x05], { v1: 1, vex: 5 })

class SeqTest7 extends Sequence([
  { name: 'v1', type: Uint8 },
  {extension:true},
  { name: 'v2', type: Sequence([
    {name:'v', type:Uint8},
  ])},
]){}
run_test("SeqTest7-1", SeqTest7, [0x80, 0x01, 0x02, 0x07, 0x80, 0x01, 0x05], { v1:1, v2:{ v:5 } })

class SeqTest8 extends Sequence([
  { name: 'v1', type: Uint8 },
  { name: 'vo', type: Uint8, optional:true },
  {extension:true},
  { name: 'v2', type: Sequence([
    {name:'v', type:Uint8},
  ])},
]){}
run_test("SeqTest8-1", SeqTest8, [0xC0, 0x01, 0x10, 0x02, 0x07, 0x80, 0x01, 0x05], { v1:1, vo:16, v2:{ v:5 } })

class IObj1 extends Sequence([
  { name: 'id', type: Uint8, key:'id'},
  { name: 't',  type: OpenType({
      1: Uint8,
      2: Uint16,
      3: Uint32
    }, 'id')
  }
]){}
run_test("IObj1-1", IObj1, [0x01, 0x01, 0x10], { id:1, t: 16 })
run_test("IObj1-2", IObj1, [0x02, 0x02, 0x00, 0x10], { id:2, t: 16 })
run_test("IObj1-3", IObj1, [0x03, 0x04, 0x00, 0x00, 0x00, 0x10], { id:3, t: 16 })

class TChoice1 extends Choice([
  { name: 'v8',  type: Uint8},
  { name: 'v16', type: Uint16}
]){}

run_test("Choise1-1", TChoice1, [0x80, 0x10], { v8:16 })
run_test("Choise1-2", TChoice1, [0x81, 0x00, 0x10], { v16:16 })

class TChoice2 extends Choice([
  { name: 'v8',  type: Uint8},
  { name: 'v16', type: Uint16},
  { extension: true}
]){}

run_test("Choise2-1", TChoice2, [0x80, 0x10], { v8:16 })
run_test("Choise2-2", TChoice2, [0x81, 0x00, 0x10], { v16:16 })

class TChoiceExt extends Choice([
  { name: 'v8',  type: Uint8},
  { extension: true},
  { name: 'v16', type: Uint16}
]){}

run_test("ChoiseExt-1", TChoiceExt, [0x80, 0x10], { v8:16 })
run_test("ChoiseExt-2", TChoiceExt, [0x81, 0x02, 0x00, 0x10], { v16:16 })
