import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Nav from '../src/components/Nav'
import { useState } from 'react'
import { QrReader } from 'react-qr-reader';
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Home(props) {
  const router = useRouter()
  const [showScan, setShowScan] = useState(false)
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
          {showScan && <div class="">
            <QrReader
              delay={300}
              constraints={{ facingMode: 'environment' }}
              onResult={(result, error) => {
                if (!!result) {
                  router.push(`/events/${result?.text}?rsvp=true`);
                  setShowScan(false);
                }

                if (!!error) {
                  console.log(error);
                }
              }}
            />
          </div>}
          <div className='flex flex-col'>
            <div className='font-semibold text-gray-700 text-lg flex-1'>Events For You</div>
            <div>No events found</div>
          </div>
          <div className='flex flex-col'>
            <div className='font-semibold text-gray-700 text-lg'>Your Events</div>
            <div className='w-full'>No events found</div>
          </div>
          <div className='flex flex-col'>
            <div className='font-semibold text-gray-700 text-lg'>Attended Events</div>
            <div>No events found</div>
          </div>
        </div>
      </main>
      <div class="fixed bottom-0 mx-auto flex space-x-4 mb-8 cursor-pointer" id="box_btn">
        <Link href="/events/new">
          <button class="text-white px-4 w-auto h-12 bg-orange-600 rounded-full hover:bg-orange-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Event</span>
          </button>
        </Link>
        <button class="text-white px-4 w-auto h-12 bg-blue-600 rounded-full hover:bg-blue-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none" onClick={() => setShowScan(!showScan)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Scan</span>
        </button>
      </div>
    </div>
  )
}
