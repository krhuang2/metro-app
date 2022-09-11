import { INexTripRoute, IStop, IDirection, IDepartures } from '../../lib/interfaces';
import React, { useEffect, useState } from 'react';
import DirectionSelector from '../DirectionSelector';
import { useSelector, useDispatch } from 'react-redux';
import { resetSelections, updateRoute } from '../../lib/redux/slices/selectionSlice';
import { RootState } from '../../lib/redux/store';
import { getDepartures, getDirections, getStops } from '../../lib/data/nextrip';
import StopSelector from '../StopSelector/StopSelector';
import DeparturesDisplay from '../DeparturesDisplay/DeparturesDisplay';

interface IFindByRouteProps {
    routeData: INexTripRoute[];
}
export default function FindByRoute({routeData}: IFindByRouteProps) {

  // Selected state variables from store
  const selectedRoute = useSelector((state: RootState) => state.selection.route);
  const selectedDirection = useSelector((state: RootState) => state.selection.direction);
  const selectedStop = useSelector((state: RootState) => state.selection.placeCode);

  const dispatch = useDispatch();
  const [initialLoad, setIntialLoad] = useState(true); // Is this a new load on the page?
  // Data state variables from data fetching
  const [directionData, setDirectionData] = useState<IDirection[] | null>(null);
  const [stopData, setStopData] = useState<IStop[] | null>(null);
  const [departuresData, setDeparturesData] = useState<IDepartures | null>(null);

  // Want to make sure we reset all state if we navigate off and on again
  if (initialLoad) {
    dispatch(resetSelections());
    setIntialLoad(false);
  }

  // Remember previous selections to prevent unnessary data fetching
  const [prevRoute, setPrevRoute] = useState('');
  const [prevDirection, setPrevDirection] = useState(-1);

  // We want to do all the data fetching at the parent component, then pass to children as needed
  useEffect(() => {
    const fetchDirectionsData = async () => {
      const data = await getDirections(selectedRoute);
      setDirectionData(data);
    };

    const fetchStopsData = async () => {
      const data = await getStops(selectedRoute, selectedDirection);
      setStopData(data);
    };
    
    const fetchDeparturesData = async () => {
      const data = await getDepartures(selectedRoute, selectedDirection, selectedStop);
      setDeparturesData(data);
    };

    // Fetch direction data if route has a selection and different from previous route
    if (selectedRoute !== '' && (prevRoute != selectedRoute)) {
      console.log('fetching directions data');
      setPrevRoute(selectedRoute);
      fetchDirectionsData();
    }

    else if (selectedDirection != -1 && (prevDirection != selectedDirection)) {
      console.log('fetching stop data');
      setPrevDirection(selectedDirection);
      fetchStopsData();
    }

    else if (selectedStop !== '') {
      console.log('fetching departures');
      fetchDeparturesData();
    }
  
    // console.log('selectedRoute: ' + selectedRoute);
    // console.log('selectedDirection: ' + selectedDirection);
    // console.log('selectedStop: ' + selectedStop);
    
  },[selectedRoute, selectedDirection, selectedStop, prevRoute, prevDirection]);

  return (
    <>
      <form>
        <fieldset>
          <legend>Find By Route</legend>
          <div>
            <label htmlFor='selectRoute'>Select Route: </label>
            <select id='route' name='selectRoute' onChange={(e) => dispatch(updateRoute(e.currentTarget.value))}>
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
          {(selectedRoute !== '') && (directionData != null) &&
            <DirectionSelector directionData={directionData} selectedRoute={selectedRoute}/>
          }
          {(selectedDirection != -1) && (stopData != null) &&
            <StopSelector stopData={stopData} selectedRoute={selectedRoute} selectedDirection={selectedDirection}/>
          }
        </fieldset>
      </form>
      {(selectedStop !== '') && (departuresData != null) &&
        <DeparturesDisplay departuresData={departuresData} selectedRoute={selectedRoute} selectedDirection={selectedDirection} selectedStop={selectedStop}/>
      }
    </>
  );
}