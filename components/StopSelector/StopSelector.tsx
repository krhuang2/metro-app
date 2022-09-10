import { useEffect, useState } from 'react';
import { getStops } from '../../lib/data/nextrip';
import { IStop } from '../../lib/interfaces';
import DeparturesDisplay from '../DeparturesDisplay/DeparturesDisplay';

interface IStopSelectorProps {
    route: string;
    direction: number;
}
export default function StopSelector({route, direction}: IStopSelectorProps) {
  // set state variable
  const [selectedStop, setSelectedStop] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [stopData, setStopData] = useState<IStop[] | null>(null);

  useEffect(() => {
    setLoading(true);
    setSelectedStop(''); // reset selection if component is rerendered from prop change

    const fetchData = async () => {
      const data = await getStops(route, direction);
      setStopData(data);
      setLoading(false);
    };
    
    fetchData();
    
  },[route, direction]);

  // handle selected direction change
  const changeSelectedStopHandler = (e: any) => {
    setSelectedStop(e.currentTarget.value);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div>
        <label htmlFor='selectDirection'>Select Stop: </label>
        <select id='direction' name='selectDirection' onChange={changeSelectedStopHandler}>
          <option value={''}>Select Stop</option>
          {stopData &&
                stopData?.map((stop, key) => {
                  return (
                    <option value={stop.place_code} key={key}>{stop.description}</option>
                  );
                })
          }
        </select>
      </div>
      <div>{'You have selected: ' + selectedStop}</div>
      {(selectedStop !== '') &&
           <DeparturesDisplay route={route} direction={direction} placeCode={selectedStop}/>
      }
    </>
  );
}