import { INexTripRoute } from '../../lib/interfaces';
import React, { useState } from 'react';

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
          {(selectedRoute !== '') &&
          <div>
            <label htmlFor='selectDirection'>Select Direction: </label>
            <select id='direction' name='selectDirection' onChange={changeSelectedRouteHandler}>
              <option value={''}>Select Direction</option>
            </select>
          </div>
          }
        </fieldset>
      </form>
      <div>{'You have selected: ' + selectedRoute}</div>
    </>
  );
}