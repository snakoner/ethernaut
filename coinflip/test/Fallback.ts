import { loadFixture, ethers, expect } from "./setup";

describe("CoinFlip, Attack contract", function() {
    async function deploy() {
		const owner = (await ethers.getSigners())[0];

        const FactoryCoinflip = await ethers.getContractFactory("CoinFlip");
        const FactoryAttack = await ethers.getContractFactory("Attack");
        const сoinFlip = await FactoryCoinflip.deploy();
        await сoinFlip.waitForDeployment();

        const attack = await FactoryAttack.deploy(сoinFlip.getAddress());
        await attack.waitForDeployment();


        return {сoinFlip, attack, owner};
    }

    it ("should be hacked", async function() {
        const {сoinFlip, attack} = await loadFixture(deploy);
    
        for (let i = 0; i < 10; i++) {
            await attack.attack();  
        }

        const wins = await сoinFlip.consecutiveWins();
        console.log("wins: ", wins);
        expect(wins).to.be.eq(10);
    });
})