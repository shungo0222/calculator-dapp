import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { Mycalculatordapp } from "../target/types/mycalculatordapp";

describe("mycalculatordapp", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.Mycalculatordapp as Program<Mycalculatordapp>;
    const calculatorAccount = anchor.web3.Keypair.generate();

    it("Create a calculator", async () => {
        await program.methods.create("Welcome to Solana").accounts({
            calculator: calculatorAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([calculatorAccount]).rpc();
        const account = await program.account.calculator.fetch(calculatorAccount.publicKey);
        assert.ok(account.greeting === "Welcome to Solana");
    });

    it("Adds two numbers", async () => {
        await program.methods.add(new anchor.BN(2), new anchor.BN(3)).accounts({
            calculator: calculatorAccount.publicKey,
        }).rpc();
        const account = await program.account.calculator.fetch(calculatorAccount.publicKey);
        assert.ok(account.result.eq(new anchor.BN(5)));
    });

    it("Subtracts two numbers", async () => {
        await program.methods.subtract(new anchor.BN(32), new anchor.BN(33)).accounts({
            calculator: calculatorAccount.publicKey,
        }).rpc();
        const account = await program.account.calculator.fetch(calculatorAccount.publicKey);
        assert.ok(account.result.eq(new anchor.BN(-1)));
    });

    it("Multiplies two numbers", async () => {
        await program.methods.multiply(new anchor.BN(2), new anchor.BN(3)).accounts({
            calculator: calculatorAccount.publicKey,
        }).rpc();
        const account = await program.account.calculator.fetch(calculatorAccount.publicKey);
        assert.ok(account.result.eq(new anchor.BN(6)));
    });

    it("Divides two numbers", async () => {
        await program.methods.divide(new anchor.BN(10), new anchor.BN(3)).accounts({
            calculator: calculatorAccount.publicKey,
        }).rpc();
        const account = await program.account.calculator.fetch(calculatorAccount.publicKey);
        assert.ok(account.result.eq(new anchor.BN(3)));
        assert.ok(account.remainder.eq(new anchor.BN(1)));
    });
});