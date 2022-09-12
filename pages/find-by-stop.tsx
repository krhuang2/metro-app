import Head from 'next/head';
import FindByStop from '../components/FindByStop/FindByStop';
import HeroSection from '../components/HeroSection';
import image from '../public/images/bus-stop.jpg';


export default function FindByStopPage() {
  return (
    <div className={'container'}>
      <Head>
        <title>NexTrip App - Find By Stop</title>
        <meta name="description" content="Find your way by Stop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <main className={'main'}>
        <HeroSection title={'Find Departures By Stop'} image={image} imageAlt={'A generic looking bus stop.'}/>
        <FindByStop />
      </main>
    </div>
  );
}