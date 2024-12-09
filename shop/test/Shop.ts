import { loadFixture, ethers, expect } from "./setup";

describe("Shop contract", function() {
    async function deploy() {
		const owner = (await ethers.getSigners())[0];
        const newOwner = (await ethers.getSigners())[1];

        const FactoryShop = await ethers.getContractFactory("Shop");
        const FactoryExploit = await ethers.getContractFactory("Exploit");
        const shop = await FactoryShop.deploy();
        await shop.waitForDeployment();

        const exploit = await FactoryExploit.deploy(await shop.getAddress());
        await exploit.waitForDeployment();


        return {shop, exploit, owner};
    }

    it ("should be hacked", async function() {
        const {shop, exploit, owner} = await loadFixture(deploy);

        expect(await shop.isSold()).to.be.eq(false)
        await exploit.buy()

        // console.log("is sold: ", await shop.isSold())
        // console.log("price: ", await shop.price())

        expect(await shop.isSold()).to.be.eq(true)
        expect(await shop.price()).to.be.eq(1)
    });
})