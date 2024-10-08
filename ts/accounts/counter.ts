import BN from 'bn.js';

export type Counter = {
  count: BN;
};

export const COUNTER_ACCOUNT_SIZE = 8;

export function deserializeCounterAccount(data: Buffer): Counter {
  if (data.byteLength !== 8) {
    console.log(data.byteLength);
    throw Error('Need exactly 8 bytes to deserialize counter: ' + data.byteLength);
  }

  return {
    count: new BN(data, 'le'),
  };
}
