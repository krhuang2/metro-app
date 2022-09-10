import { INexTripRoute } from '../../lib/interfaces';
import React, { useState } from 'react';
import DirectionSelector from '../DirectionSelector';

interface IFindByRouteProps {
    routeData: INexTripRoute[];
}
export default function FindByRoute({routeData}: IFindByRouteProps) {

  // State variables for selections
  const [selectedRoute, setSelectedRoute] = useState('');

  // handle selected route change
  const changeSelectedRouteHandler = (e: any) => {
    setSelectedRoute(e.currentTarget.value);
  };
  return (
    <>
      <form>
        <fieldset>
          <legend>Find By Route</legend>
          <div>
            <label htmlFor='selectRoute'>Select Route: </label>
            <select id='route' name='selectRoute' onChange={changeSelectedRouteHandler}>
              <option value={''}>Select Route</option>
              {routeData &&
                routeData.map((route, key) => {
                  return (
                    <option value={route.route_id} key={key}>{route.route_label}</option>
                  );
                })
              }
            </select>
          </div>
          <div>{'You have selected: ' + selectedRoute}</div>
          {(selectedRoute !== '') &&
            <DirectionSelector route={selectedRoute}/>
          }
        </fieldset>
      </form>
    </>
  );
}