import Head from 'next/head';
import FindByRoute from '../components/FindByRoute';
import HeroSection from '../components/HeroSection';
import { getRoutes } from '../lib/data/nextrip';
import { INexTripRoute } from '../lib/interfaces';
import image from '../public/images/smiling-bus.jpg';

interface IFindByRoutePageProps {
    routesData: INexTripRoute[];
  }
export default function FindByRoutePage({routesData}: IFindByRoutePageProps) {
  return (
    <div className={'container'}>
      <Head>
        <title>NexTrip App - Find By Route</title>
        <meta name="description" content="Find your way by Route" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <main className={'main'}>
        <HeroSection title={'Find Departures By Route'} image={image} imageAlt={'A creepy smiling green bus.'}/>
    
        {routesData &&
            <FindByRoute routeData={routesData}/>
        }
      </main>
    </div>
  );
}

// Since we will always need the routes data, might as well fetch it server side.
export async function getServerSideProps() {
  const routesData: INexTripRoute[] = await getRoutes();
  
  return {
    props: {
      routesData
    }
  };
}