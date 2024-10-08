import {Keypair} from "@solana/web3.js";
import fs from "fs";

export function loadKeypair(keypairPath: string): Keypair {
    const fileContent = fs.readFileSync(keypairPath, 'utf8')
    const dataArray = JSON.parse(fileContent);
    const uint8Array = new Uint8Array(dataArray);
    return Keypair.fromSecretKey(uint8Array)
}
