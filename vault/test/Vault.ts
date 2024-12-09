import { loadFixture, ethers, expect } from "./setup";


describe("Delegate contract", function() {
    async function deploy() {
		const owner = (await ethers.getSigners())[0];
        const newOwner = (await ethers.getSigners())[1];

        const contractFactory = await ethers.getContractFactory("Vault");
        const password = ethers.encodeBytes32String("password")
        const contract = await contractFactory.deploy(password);
        await contract.waitForDeployment();

        return {contract, owner};
    }

    it ("should be hacked", async function() {
        const {contract, owner} = await loadFixture(deploy);
        const password = await ethers.provider.getStorage(contract.getAddress(), 1)

        expect(await contract.locked()).to.be.eq(true)

        await contract.unlock(password)

        expect(await contract.locked()).to.be.eq(false)
    });
})