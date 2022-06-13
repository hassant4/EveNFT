import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Nav from '../../src/components/Nav'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import getConnector from '../../src/utils/wallet'
import { zdk } from '../../src/utils/zora'
import { supabase } from '../../src/utils/supabaseClient'
import QRCode from "react-qr-code";


export default function Home(props) {
    // console.log(props)
    const router = useRouter()
    const pid = router && router.query.pid
    const [showQR, setShowQR] = useState(false)
    const [showModal, setShowModal] = useState(router.query.rsvp != undefined)
    const [response, setResponse] = useState(null)
    const [name, setName] = useState("")
    const [location, setLocation] = useState("")
    const [requirement, setRequirement] = useState("")
    const [requirementName, setRequirementName] = useState("")
    const [owner, setOwner] = useState("")
    const [admins, setAdmins] = useState("")
    const connector = getConnector()
    const [data, setData] = useState('No result');
    console.log(connector)

    async function getEvent() {
        try {
        //   setLoading(true)
        //   const user = supabase.auth.user()
    
          let { data, error, status } = await supabase
            .from('events')
            .select(`name, location, requirement, owner, admins`)
            .eq('id', pid)
            .single()
    
          if (error && status !== 406) {
            throw error
          }
    
          if (data) {
            setName(data.name)
            setLocation(data.location)
            setRequirement(data.requirement)
            setOwner(data.owner)
            setAdmins(data.admins)
          }
        } catch (error) {
          alert(error.message)
        } finally {
        //   setLoading(false)
        }
      }

    useEffect(() => {
        getEvent()
        // getParticipants()
    }, [pid]);

    useEffect(() => {
        router.query.rsvp != undefined && setShowModal(true);
    }, [router.query.rsvp]);

    useEffect(() => {
        if (showModal == true) {
            const args = {
                where: {
                    collectionAddresses: ["0x8d04a8c79cEB0889Bdd12acdF3Fa9D207eD3Ff63"],
                    ownerAddresses: ["dom.eth"]
                },
                pagination: { limit: 3 }, // Optional, limits the response size to 3 NFTs
                includeFullDetails: false, // Optional, provides more data on the NFTs such as events
                includeSalesHistory: false // Optional, provides sales data on the NFTs
            };

            const response = zdk.tokens(args)
            response.then(result =>
                setResponse(result.tokens.nodes)
            )
                .catch(err => console.log(err))
        }

    }, [showModal]);


    useEffect(() => {
        if (requirement != "") {
            // const args = {
            //     token: {
            //       address: requirement,
            //       tokenId: "314"
            //     },
            //     includeFullDetails: false // Optional, provides more data on the NFT such as all historical events
            //   }
              
            const response = zdk.collection({address: requirement})
            response.then(result =>
                setRequirementName(result.name)
            )
                .catch(err => console.log(err))
        }

    }, [requirement]);



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
                        {showQR &&
                            <>
                                <div style={{ height: "auto", margin: "0 auto", width: "50%" }}>
                                    <QRCode
                                    size={256}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={pid}
                                    viewBox={`0 0 256 256`}
                                    />
                                </div>
                                <div className='m-2'></div>
                            </>
                        }
                        <div className='font-bold text-black text-xl'>{name}</div>
                        <div className='flex flex-row items-center justify-start space-x-2 text-gray-800'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>{location}</div>

                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='font-semibold text-gray-500 text-md'>Entry Requirements</div>
                        {requirementName && <div className='text-sm text-gray-800'>- {requirementName} holder</div>}
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex flex-row items-center justify-start space-x-2 text-gray-800'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <div className='text-sm text-black'>35 people are here!</div>
                        </div>
                    </div>
                </div>
            </main>
            {showModal &&
                <div class="py-12 bg-gray-700 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">
                    <div role="alert" class="container mx-auto w-11/12 md:w-2/3 max-w-lg">
                        <div class="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                            {response ?
                                <>
                                    <h1 class="text-center text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">{response.length > 1 ? 'Access Granted' : 'Access Denied'}</h1>
                                    <div class="w-full flex justify-center text-gray-600 mb-3">
                                        {response.length > 0 ?
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg> :
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        }
                                    </div>

                                    {response.length == 0 &&
                                        <>
                                            <div className='text-center'>You do not hold the required token</div>
                                        </>
                                    }
                                </> :
                                <div class="flex justify-center items-center">
                                    <span class="h-6 w-6 block rounded-full border-4 border-t-blue-300 animate-spin"></span>
                                </div>

                            }
                            <button class="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" onclick="modalHandler()" aria-label="close modal" role="button" onClick={() => setShowModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            }
            { owner && owner == connector.accounts[0] && 
                <div class="fixed bottom-0 mx-auto flex space-x-4 mb-8 cursor-pointer" id="box_btn">
                    <button class="text-white px-4 w-auto h-12 bg-orange-600 rounded-full hover:bg-orange-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Admin</span>
                    </button>
                    <button class="text-white px-4 w-auto h-12 bg-blue-600 rounded-full hover:bg-blue-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none" onClick={() => setShowQR(!showQR)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Show QR</span>
                    </button>
                </div>
            }
        </div>
    )
}
