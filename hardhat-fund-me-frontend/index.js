import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const showBalance = document.getElementById("showBalance");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        connectButton.innerHTML = "Connected";
        console.log("Connected!");
    } else {
        console.log("No Metamask!");
        connectButton.innerHTML = "Please install metamask!";
    }
}

async function fund() {
    if (typeof window.ethereum !== "undefined") {
        ethAmount = document.getElementById("ethAmount").value;
        console.log(`Funding with ${ethAmount}....`);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionRespnonse = await contract.fund({
                value: ethers.utils.parseUnits(ethAmount),
            });
            await listenForTransactionToBeMined(transactionRespnonse, provider);
            console.log("Done!");
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("No Metamask!");
        connectButton.innerHTML = "Please install metamask!";
    }
}

function listenForTransactionToBeMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations.`
            );
            resolve();
        });
    });
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        showBalance.innerHTML = ethers.utils.formatEther(balance);
        console.log(ethers.utils.formatEther(balance));
    } else {
        console.log("No Metamask!");
        connectButton.innerHTML = "Please install metamask!";
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing....");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.withdraw();
            await listenForTransactionToBeMined(transactionResponse, provider);
            console.log("Withdrawn!");
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("No Metamask!");
        connectButton.innerHTML = "Please install metamask!";
    }
}
