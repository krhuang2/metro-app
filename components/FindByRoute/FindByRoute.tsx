import { INexTripRoute } from '../../lib/interfaces';
import React, { useState } from 'react';
import DirectionSelector from '../DirectionSelector';
import { useSelector, useDispatch } from 'react-redux';
import { resetSelections, updateRoute } from '../../lib/redux/slices/selectionSlice';
import { RootState } from '../../lib/redux/store';
import StopSelector from '../StopSelector/StopSelector';
import DeparturesDisplay from '../DeparturesDisplay/DeparturesDisplay';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { resetData, updateDirectionsData } from '../../lib/redux/slices/dataSlice';

interface IFindByRouteProps {
    routeData: INexTripRoute[];
}
export default function FindByRoute({routeData}: IFindByRouteProps) {

  // Selected state variables from store
  const directionsData = useSelector((state: RootState) => state.data.directionsData);
  const stopsData = useSelector((state: RootState) => state.data.stopsData);
  const departuresData = useSelector((state: RootState) => state.data.departuresData);


  const dispatch = useDispatch();
  const [initialLoad, setIntialLoad] = useState(true); // Is this a new load on the page?

  // Want to make sure we reset all state if we navigate off and on again
  if (initialLoad) {
    dispatch(resetData());
    dispatch(resetSelections());
    setIntialLoad(false);
  }

  // Keep track if there are errors
  const [hasError, setHasError] = useState(false);

  // Data fetching functions
  const fetchDirectionsData = async (selectedRoute: string) => {
    fetch('https://svc.metrotransit.org/nextripv2/directions/' + selectedRoute).then((response) => {
      if (!response.ok) {
        setHasError(true);
      } else {setHasError(false);}
      return response.json();
    }).then((data) => {
      dispatch(updateDirectionsData(data));
    });
  };

  const handleRouteSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoute = e.currentTarget.value;
    dispatch(updateRoute(selectedRoute)); // update selected route so that child component can use;
    if (selectedRoute !== '') {
      fetchDirectionsData(selectedRoute); // if a valid selection, fetch data and update global state
    }
    else {
      dispatch(updateDirectionsData(null)); // if reseting to default selection, set state as null
    }
  };


  return (
    <>
      <form className={'form'}>
        <fieldset>
          <legend>Find By Route</legend>
          <div>
            <label className={'screenReaderText'} htmlFor='selectRoute'>Select Route</label>
            <select className={'select'} id='route' name='selectRoute' onChange={handleRouteSelectionChange}>
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
          {(directionsData != null) && !hasError &&
            <DirectionSelector />
          }
          {(stopsData != null) && !hasError &&
            <StopSelector />
          }
        </fieldset>
      </form>
      {(departuresData != null) && !hasError &&
        <DeparturesDisplay />
      }
      {hasError &&
        <ErrorMessage message={'Uh Oh... Something went wrong.'} /> 
      }
    </>
  );
}