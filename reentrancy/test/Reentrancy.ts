import { loadFixture, ethers, expect } from "./setup";

const _ticketPrice = ethers.parseEther("0.1");
const _duration = 10;
const _ownerCommission = 2;

async function getAddressBalance(address: string) : Promise<string> {
    const balance = await ethers.provider.getBalance(address)

    return ethers.formatUnits(balance)
}

describe("Reentrancy contract", function() {
    async function deploy() {
		const owner = (await ethers.getSigners())[0];
        const attacker = (await ethers.getSigners())[1];

        const bankFactory = await ethers.getContractFactory("Bank");
        const bank = await bankFactory.deploy();
        await bank.waitForDeployment();

        const attackFactory = await ethers.getContractFactory("Attack");
        const attack = await attackFactory.deploy(await bank.getAddress());
        await attack.waitForDeployment();

        return {bank, attack, owner, attacker};
    }

    it ("should be hacked", async function() {
        const {bank, attack, owner, attacker} = await loadFixture(deploy);

        await owner.sendTransaction({
            to: await bank.getAddress(),
            value: ethers.parseEther("10.0"),
        })

        await attack.connect(attacker).proxyBid({
            value: ethers.parseEther("1.0"),
        })

        expect(await ethers.provider.getBalance(await bank.getAddress())).to.be.eq(ethers.parseEther("11.0"))
        expect(await bank.balances(owner.address)).to.be.eq(ethers.parseEther("10.0"))
        expect(await bank.balances(await attack.getAddress())).to.be.eq(ethers.parseEther("1.0"))


        const balanceBefore = (await ethers.provider.getBalance(await attack.getAddress()))

        await attack.connect(attacker).attack()

        const balanceAfter = (await ethers.provider.getBalance(await attack.getAddress()))

        await attack.withdraw(attacker.address)

        expect(balanceAfter - balanceBefore).to.be.eq(ethers.parseEther("11.0"))

        console.log(ethers.formatUnits(await ethers.provider.getBalance(attacker.address)))
    });
})