import { INexTripRoute, IStop, IDirection, IDepartures } from '../../lib/interfaces';
import React, { useEffect, useState } from 'react';
import DirectionSelector from '../DirectionSelector';
import { useSelector, useDispatch } from 'react-redux';
import { resetSelections, updateRoute } from '../../lib/redux/slices/selectionSlice';
import { RootState } from '../../lib/redux/store';
import StopSelector from '../StopSelector/StopSelector';
import DeparturesDisplay from '../DeparturesDisplay/DeparturesDisplay';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

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

  // Keep track if there are errors
  const [hasError, setHasError] = useState(false);

  // We want to do all the data fetching at the parent component, then pass to children as needed
  // TODO: Ideally we can potentially move the logic and data fetching async calls into middleweare actions using Redux Thunk
  // That way, it is more reusable and we can call the fetch as the state changes instead of checking every time the component rerenders
  // OR, we could do the data fetching at the child component level while using redux to keep updating selected state, but also might be complicated.
  useEffect(() => {
    const fetchDirectionsData = async () => {
      fetch('https://svc.metrotransit.org/nextripv2/directions/' + selectedRoute).then((response) => {
        if (!response.ok) {
          setHasError(true);
        } else {setHasError(false);}
        return response.json();
      }).then((data) => {
        setDirectionData(data);
      });
    };

    const fetchStopsData = async () => {
      fetch('https://svc.metrotransit.org/nextripv2/stops/' + selectedRoute + '/' + selectedDirection).then((response) => {
        if (!response.ok) {
          setHasError(true);
        } else {setHasError(false);}
        return response.json();
      }).then((data) => {
        setStopData(data);
      });
    };
    
    const fetchDeparturesData = async () => {
      fetch('https://svc.metrotransit.org/nextripv2/' + selectedRoute + '/' + selectedDirection + '/' + selectedStop).then((response) => {
        if (!response.ok) {
          setHasError(true);
        } else {setHasError(false);}
        return response.json();
      }).then((data) => {
        setDeparturesData(data);
      });
    };

    // Fetch direction data if route has a selection and different from previous route
    if (selectedRoute !== '' && (prevRoute != selectedRoute)) {
      setPrevRoute(selectedRoute);
      fetchDirectionsData();
    }
    // Fetch Stops data if direction has a selection and has changed
    else if (selectedDirection != -1 && (prevDirection != selectedDirection)) {
      setPrevDirection(selectedDirection);
      fetchStopsData();
    }
    // Fetch Departures if stop has a selection
    else if (selectedStop !== '') {
      fetchDeparturesData();
    }
    
  },[selectedRoute, selectedDirection, selectedStop, prevRoute, prevDirection]);

  return (
    <>
      <form className={'form'}>
        <fieldset>
          <legend>Find By Route</legend>
          <div>
            <label className={'screenReaderText'} htmlFor='selectRoute'>Select Route</label>
            <select className={'select'} id='route' name='selectRoute' onChange={(e) => dispatch(updateRoute(e.currentTarget.value))}>
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
          {(selectedRoute !== '') && (directionData != null) && !hasError &&
            <DirectionSelector directionData={directionData} selectedRoute={selectedRoute}/>
          }
          {(selectedDirection != -1) && (stopData != null) && !hasError &&
            <StopSelector stopData={stopData} selectedDirection={selectedDirection}/>
          }
        </fieldset>
      </form>
      {(selectedStop !== '') && (departuresData != null) && !hasError &&
        <DeparturesDisplay departuresData={departuresData} />
      }
      {hasError &&
        <ErrorMessage message={'Uh Oh... Something went wrong.'} /> 
      }
    </>
  );
}