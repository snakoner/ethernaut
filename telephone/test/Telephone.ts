import { loadFixture, ethers, expect } from "./setup";

describe("Telephone, Attack contract", function() {
    async function deploy() {
		const owner = (await ethers.getSigners())[0];
        const newOwner = (await ethers.getSigners())[1];

        const FactoryTelephone = await ethers.getContractFactory("Telephone");
        const FactoryAttack = await ethers.getContractFactory("Attack");
        const telephone = await FactoryTelephone.deploy();
        await telephone.waitForDeployment();

        const attack = await FactoryAttack.deploy(telephone.getAddress());
        await attack.waitForDeployment();


        return {telephone, attack, owner, newOwner};
    }

    it ("should be hacked", async function() {
        const {telephone, attack, owner, newOwner} = await loadFixture(deploy);

        const ownerAddressBefore = await telephone.owner();
        expect(ownerAddressBefore).to.be.eq(owner.address);

        await attack.attack(newOwner.address);

        const ownerAddressAfter = await telephone.owner();
        expect(ownerAddressAfter).to.be.eq(newOwner.address);
    });
})