import { useEffect, useState, useCallback } from 'react';
import { IDepartures } from '../../lib/interfaces';
import { getDepartures } from '../../lib/data/nextrip';

interface IDeparturesDisplayProps {
    route: string;
    direction: number;
    placeCode: string;
}
export default function DeparturesDisplay({route, direction, placeCode}: IDeparturesDisplayProps) {
  // set state variable
  const [isLoading, setLoading] = useState(false);
  const [departuresData, setDeparturesData] = useState<IDepartures | null>(null);

  const fetchData = useCallback(async () => {
    const data = await getDepartures(route, direction, placeCode);
    setDeparturesData(data);
    setLoading(false);
  },[route, direction, placeCode]);

  useEffect(() => {
    setLoading(true);
    console.log('Departures Display Mounted');
    fetchData();

    
    //setDeparturesData(null); // reset selection if component is rerendered from prop change
    
  },[fetchData]);

  

  


  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {departuresData &&
                departuresData.departures.map((stop, key) => {
                  return (
                    <div key={key}>{stop.route_short_name}</div>
                  );
                })
      }
    </>
  );
}