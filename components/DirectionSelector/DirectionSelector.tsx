import { useEffect, useState } from 'react';
import { getDirections } from '../../lib/data/nextrip';
import { IDirection } from '../../lib/interfaces';
import StopSelector from '../StopSelector/StopSelector';

interface IDirectionSelectorProps {
    route: string;
}
export default function DirectionSelector({route}: IDirectionSelectorProps) {
  // set state variable
  const [selectedDirection, setSelectedDirection] = useState(-1);
  const [isLoading, setLoading] = useState(false);
  const [directionData, setDirectionData] = useState<IDirection[] | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const data = await getDirections(route);
      setDirectionData(data);
      setLoading(false);
    };

    fetchData();
    
  },[route]);

  // handle selected direction change
  const changeSelectedDirectionHandler = (e: any) => {
    setSelectedDirection(e.currentTarget.value);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div>
        <label htmlFor='selectDirection'>Select Direction: </label>
        <select id='direction' name='selectDirection' onChange={changeSelectedDirectionHandler}>
          <option value={-1}>Select Direction</option>
          {directionData &&
                directionData.map((direction, key) => {
                  return (
                    <option value={direction.direction_id} key={key}>{direction.direction_name}</option>
                  );
                })
          }
        </select>
      </div>
      <div>{'You have selected: ' + selectedDirection}</div>
      {(selectedDirection !== -1) &&
            <StopSelector route={route} direction={selectedDirection} />
      }
    </>
  );
}