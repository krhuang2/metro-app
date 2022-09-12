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
        <HeroSection title={'NexTrip Demo Web App'} image={image} imageAlt={'A crashed schoolbus in the snow.'}/>
        <p>
          This is an demo app using the NexTrip API. Navigate to <a href={'/find-by-route'}>Find By Route</a> or <a href={'/find-by-stop'}>Find By Stop</a> in order to find real time departures.
        </p>
      </main>
    </div>
  );
}