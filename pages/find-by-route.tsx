import Head from 'next/head';
import FindByRoute from '../components/FindByRoute/FindByRoute';
import HeroSection from '../components/HeroSection/HeroSection';
import { getRoutes } from '../lib/data/nextrip';
import { INexTripRoute } from '../lib/interfaces';
import image from '../public/images/smiling-bus.jpg';

interface IHomeProps {
    routesData: INexTripRoute[];
  }
export default function FindByRoutePage({routesData}: IHomeProps) {
  return (
    <div className={'container'}>
      <Head>
        <title>NexTrip App - Find By Route</title>
        <meta name="description" content="Find your way by Route" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <main className={'main'}>
        <HeroSection title={'Find By Route'} image={image} imageAlt={'A creepy smiling green bus.'}/>
    
        {routesData &&
            <FindByRoute routeData={routesData}/>
        }
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const routesData: INexTripRoute[] = await getRoutes();
  
  return {
    props: {
      routesData
    }
  };
}