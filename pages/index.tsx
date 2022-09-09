//import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import FindByRoute from '../components/FindByRoute/FindByRoute';
//import Image from 'next/image';
import { getRoutes } from '../lib/data/nextrip';
import { INexTripRoute } from '../lib/interfaces';

interface IHomeProps {
  routesData: INexTripRoute[];
}

export default function Home({routesData}: IHomeProps) {

  return (
    <div className={'container'}>
      <Head>
        <title>NexTrip App - Home</title>
        <meta name="description" content="A simple web app using the NexTrip API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={'main'}>
        <h1 className={'title'}>
          Find Your Bus Stop
        </h1>

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