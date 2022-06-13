import { useState } from 'react'
import getConnector from '../utils/wallet'
import Link from 'next/link'

export default function Nav(props) {
    const [connector, setConnector] = useState(null)
    const connectWallet = () => {
        // Check if connection is already established
        // if (!props.connector.connected) {
        //     // create new session
        //     props.connector.createSession();
        // }
        // else{
        //     props.connector.killSession()
        // }
        if(connector && connector.connected){
            connector.killSession()
        }
        else{
            const connector = getConnector()
            setConnector(connector)
        }
    }
    return (
        <nav className="bg-gray-800 w-full flex flex-row py-2 px-4 items-center">
            <Link href="/">
                <a className="flex text-white">EveNFT</a>
            </Link>
            <div className="flex-1 flex justify-end items-center">
                {connector && connector.accounts.length>0 && <div className="text-xs text-gray-500 pr-2">{connector && connector.accounts[0].slice(0,10)}...</div>}
                <button
                    href="#"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    onClick={connectWallet}
                >
                    {connector && connector.accounts.length>0 ? 'Disconnect' : 'Connect'}
                </button>
            </div>
        </nav>
    )
}