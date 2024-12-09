import { loadFixture, ethers, expect } from "./setup";


describe("King contract", function() {
    async function deploy() {
		const owner = (await ethers.getSigners())[0];
        const newKing = (await ethers.getSigners())[1];

        const contractFactory = await ethers.getContractFactory("King");
        const password = ethers.encodeBytes32String("password")
        const contract = await contractFactory.deploy({value: ethers.parseEther("1.0")});
        await contract.waitForDeployment();

        return {contract, owner, newKing};
    }

    it ("should be hacked", async function() {
        const {contract, owner, newKing} = await loadFixture(deploy);

        expect(await contract._king()).to.be.eq(owner.address)
        await newKing.sendTransaction({
            to: await contract.getAddress(),
            value: ethers.parseEther("2.0")
        })

        expect(await contract._king()).to.be.eq(newKing.address)

    });
})