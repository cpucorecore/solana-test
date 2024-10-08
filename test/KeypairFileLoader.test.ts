import {loadKeypair} from "../src/KeypairFileLoader";

describe('keypair', () => {
    test('load keypair', () => {
        const keypair = loadKeypair('test/counter.json')
        expect(keypair.publicKey.toString()).toBe("BpNMAb8SK7MWCY4DQn9J67X9jAV3pTFrEhLgUWaLhEod")
    });
});
