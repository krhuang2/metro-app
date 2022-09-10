import Head from 'next/head';
import HeroSection from '../components/HeroSection/HeroSection';
import image from '../public/images/bus-home.jpg';

export default function Home() {

  return (
    <div className={'container'}>
      <Head>
        <title>NexTrip App - Home</title>
        <meta name="description" content="A simple web app using the NexTrip API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={'main'}>
        <HeroSection title={'Search for Real Time Departures'} image={image} imageAlt={'A crashed schoolbus in the snow.'}/>

      </main>
    </div>
  );
}