import * as cons from "/modules/consola.js";
import * as helper from "/modules/helper.js";


export const commands = {
    async btc(args) {
        //console.log("args", args);        
        var shell = new BtcShell();
        return await helper.Call.SubCommand(shell, args);
    },

};

class BtcShell {
    subCommandsMap = ["wallet", "mine"];

    constructor() {
        // You can initialize properties here if needed
    }
    async mine(args) {
        cons.commands.print("todo.mine.." + args);
    }
    async wallet_add(args) {
        var core = new BtcCore();
        await core.initAsync();
        await core.test();
        cons.commands.print("todo.1.." + args);
    }
    async wallet_list() {
        cons.commands.print("todo..2");
    }
    async wallet_remove(id) {
        cons.commands.print("todo..3");
    }

}

class BtcCore {
    async initAsync() {
        if (!window.bitcoin) {
            await helper.Script.load('/lib/bitcoin-lib.js');
        }
    }

    async test() {
        //https://github.com/bitcoinjs/bitcoinjs-lib
        //the lib is from the browerfiy project near this
        // Generate mnemonic
        const mnemonic = bip39.generateMnemonic(256);
        //console.log("Mnemonic:", mnemonic);
        cons.commands.print(mnemonic.toString());

        // Derive seed from mnemonic
        const seed = await bip39.mnemonicToSeed(mnemonic);
        //console.log(seed);
        
        // Bitcoin BIP32 HD Wallet
        const root = bip32.fromSeed(seed);

        // Derive first account based on BIP44 (m/44'/0'/0'/0/0)
        const path = "m/44'/0'/0'/0/0";
        const child = root.derivePath(path);

        // Get keypair and public address
        const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey });
        const privateKeyWIF = child.toWIF();

        console.log("Derivation Path:", path);
        console.log("Bitcoin Address:", address);
        console.log("Private Key (WIF):", privateKeyWIF);
    }
}