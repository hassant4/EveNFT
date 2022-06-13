import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Nav from '../../src/components/Nav'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import getConnector from '../../src/utils/wallet'
import { zdk } from '../../src/utils/zora'


export default function Home(props) {
    // console.log(props)
    const router = useRouter()
    const pid = router && router.query.pid
    console.log(router.query)
    const [showModal, setShowModal] = useState(router.query.rsvp != undefined)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const connector = getConnector()
    console.log(connector)


    useEffect(() => {
        if (searchQuery != "") {

            const response = zdk.search(
                {
                  query: searchQuery,
                  pagination: {
                      limit: 10
                  }
                }
              )
            response.then(result =>{
                setSearchResults(result.search.nodes)
                console.log(result)
            })
            .catch(err => console.log(err))
        }

    }, [searchQuery]);



    return (
        <div className={styles.container}>
            <Head>
                <title>EveNFT</title>
                <meta name="description" content="NFT backed event ticketing" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Nav />
            <main className={styles.main}>
                <div className='flex flex-col max-w-lg rounded shadow-md bg-white p-4 space-y-4 w-screen'>
                    <div className='flex flex-col'>
                        <form class="bg-whit">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                                    Name
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Zorbs in London" />
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                    Location
                                </label>
                                <input class="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="text" placeholder="Google Campus" />
                            </div>
                            <div className='flex flex-col mb-2'>
                                <div className='text-gray-700 text-sm font-bold '>Entry Requirements</div>
                                <div className='text-sm text-gray-800'>Search and select a token required for access</div>
                                <input class="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Bored Apes" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
                            </div>
                            <div className='mb-4'>
                                {searchResults && searchResults.map(nft =>
                                    <div className='flex flex-row items-baseline justify-start'>
                                        <input key={nft.name}type="radio" value={nft.collectionAdderss} name={nft.name} />
                                        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                            {nft.name}
                                        </label>
                                    </div>
                                )}
                            </div>
                            <div class="flex items-center justify-between">
                                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}
