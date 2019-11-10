import Arweave from "arweave-web";
const arweave = Arweave.init();
const key = await arweave.wallets.generate();

const APP_NAME = "WATT",
const APP_VERSION = "0.0.1";


export function handleLogin(key) {
    arweave.wallets.jwkToAddress(key).then(address => {
        localStorage.setItem('key', JSON.stringify(key));
        localStorage.setItem('address', address);
    })
}

export function addVehicle(vehicleData) {
    let transaction = arweave.createTransaction({
        data: arweave.utils.concatBuffers([vehicleData])
    })
    
    transaction.addTag('App-Name', APP_NAME);
    transaction.addTag('App_Version', APP_VERSION);
    transaction.addTag('Unix-Time', Math.round((new Date()).getTime() / 1000));
    await arweave.transactions.sign(transaction, key);
    arweave.transactions.post(transaction);
}