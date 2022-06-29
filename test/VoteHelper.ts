import { ethers } from "hardhat";
import crypto from "crypto";
import { Wallet } from "ethers";

export function getHash(body: string): string {
    const hash = crypto.createHash("sha256");
    hash.update(Buffer.from(body, "utf8"));
    return ethers.utils.hexZeroPad(`0x${hash.digest("hex")}`, 32);
}

export function makeCommitment(
    vote: string,
    proposalID: string,
    sender: string,
    choice: number,
    nonce: number
): Promise<string> {
    const abiCoder = ethers.utils.defaultAbiCoder;
    const encodedResult = abiCoder.encode(
        ["address", "bytes32", "address", "uint8", "uint64"],
        [vote, proposalID, sender, choice, nonce]
    );
    return Promise.resolve(ethers.utils.keccak256(encodedResult));
}

export function signCommitment(
    signer: Wallet,
    proposalID: string,
    sender: string,
    commitment: string
): Promise<string> {
    const abiCoder = ethers.utils.defaultAbiCoder;
    const encodedResult = abiCoder.encode(
        ["bytes32", "address", "bytes32"],
        [proposalID, sender, commitment]
    );
    const sig = signer
        ._signingKey()
        .signDigest(ethers.utils.keccak256(encodedResult));
    return Promise.resolve(ethers.utils.joinSignature(sig));
}