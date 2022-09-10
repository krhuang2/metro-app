import { useEffect, useState } from 'react';
import { getDirections } from '../../lib/data/nextrip';
import { IDirection } from '../../lib/interfaces';

interface IDirectionSelectorProps {
    route: string;
}
export default function DirectionSelector({route}: IDirectionSelectorProps) {
  // set state variable
  const [selectedDirection, setSelectedDirection] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [directionData, setDirectionData] = useState<IDirection[] | null>(null);

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      const data = await getDirections(route);
      setDirectionData(data);
      setLoading(false);
    }
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
          <option value={''}>Select Direction</option>
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
    </>
  );
}