import React, { Component } from 'react'
import Arweave from 'arweave/web';
import Dropzone from 'reaect-dropzone';

const arweave = Arweave.init();

export default class Login extends Component {



    handleLogin = (key) => {
        arweave.wallets.jwkToAddress(key).then(address => {
            localStorage.setItem('key', JSON.stringify(key));
            localStorage.setItem('address', address);
        })
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
