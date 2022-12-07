import {DataCursor} from "../asnjs.mjs"

function object_equals( x, y ) {
  if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects
/*
    if (typeof x[Symbol.iterator] === 'function'){
      for (const p in x){
        if ( ! object_equals( x[ p ],  y[ p ] ) ) return false;
      }

    } else {
  */
  for ( var p in x ) {
    // if ( ! x.hasOwnProperty( p ) ) continue;
      // other properties were tested using x.constructor === y.constructor

    // if ( ! y.hasOwnProperty( p ) ) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined
    

    
      if ( x[ p ] === y[ p ] ) continue;
      // if they have the same strict value or identity then they are equal

    if ( typeof( x[ p ] ) !== "object" ) return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

    if ( ! object_equals( x[ p ],  y[ p ] ) ) return false;
      // Objects and Arrays must be tested recursively
  }

  //for ( p in y )
  //  if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) )
  //    return false;
        // allows x[ p ] to be set to undefined

  return true;
}

function decode_oer(test_name, Type, oer, js){
  let r;
  try {
    let r = Type.from_oer(new DataCursor(Buffer.from(oer)));
    if(js !== undefined){
      console.log(test_name + ': decode ' + (object_equals(js, r) ? '\x1b[32mPASSED\x1b[0m' : '\x1b[31mFAILED\x1b[0m'));
    }
  }catch(e){
    console.log(e);
  }
  return r;
}

function encode_oer(test_name, Type, js, oer){
  let r;
  try {
    let dc = new DataCursor(new ArrayBuffer(1024));
    r = Type.to_oer(dc, js);
    if( oer !== undefined){
      let b = Buffer.from(r.buffer, 0, r.index);
      console.log(test_name + ': encode ' + (Buffer.from(oer).equals(b) ? '\x1b[32mPASSED\x1b[0m' : '\x1b[31mFAILED\x1b[0m'));
    }
  }catch(e){
    console.log(e);
  }
  return r;
}

export {object_equals, decode_oer, encode_oer};
