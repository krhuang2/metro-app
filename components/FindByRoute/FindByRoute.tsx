import { INexTripRoute } from '../../lib/interfaces';
import React, { useCallback, useEffect, useState } from 'react';
import DirectionSelector from '../DirectionSelector';
import { useSelector, useDispatch } from 'react-redux';
import { resetSelections, updateRoute } from '../../lib/redux/slices/selectionSlice';
import { RootState } from '../../lib/redux/store';
import StopSelector from '../StopSelector/StopSelector';
import DeparturesDisplay from '../DeparturesDisplay/DeparturesDisplay';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { resetData, updateDeparturesData, updateDirectionsData } from '../../lib/redux/slices/dataSlice';
import { useRouter } from 'next/router';

interface IFindByRouteProps {
    routeData: INexTripRoute[];
}

// Component containing the selector for routes as well as the other selectors as child components.
// On initial render, it will check the router to see if params are set. If they are, attempt to make
// a fetch request and display departure data. If the user selects a route, it will update state and fetch
// direction data to render the direcionSelector component.
export default function FindByRoute({routeData}: IFindByRouteProps) {

  const router = useRouter();

  // Selected state variables from store
  const directionsData = useSelector((state: RootState) => state.data.directionsData);
  const stopsData = useSelector((state: RootState) => state.data.stopsData);
  const departuresData = useSelector((state: RootState) => state.data.departuresData);


  const dispatch = useDispatch();

  // Fetch the departureData. If successful, update state. If not, update hasError.
  const fetchDeparturesData = useCallback(async (selectedRoute: string, selectedDirection: string, selectedStop: string) => {
    fetch('https://svc.metrotransit.org/nextripv2/' + selectedRoute + '/' + selectedDirection + '/' + selectedStop).then((response) => {
      if (!response.ok) {
        setHasError(true);
      } else {setHasError(false);}
      return response.json();
    }).then((data) => {
      dispatch(updateDeparturesData(data));
    });
  },[dispatch]);

  

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

  useEffect(() => {
    if (router.isReady) { // if router picks up 3 params, attempt to fetch departures data
      if (router.query.slug && router.query.slug?.length == 3) {
        const route = router.query.slug[0];
        const direction = router.query.slug[1];
        const placeCode = router.query.slug[2];
        
        fetchDeparturesData(route, direction, placeCode);
      }
      else {
        dispatch(resetData());
        dispatch(resetSelections());
      }
    }
  },[dispatch, fetchDeparturesData, router.isReady, router.query.slug]);


  return (
    <section className={'contentContainer'}>
      <form className={'form'}>
        <fieldset>
          <legend>Find By Route</legend>
          <div>
            <label className={'screenReaderText'} htmlFor='selectRoute'>Select Route</label>
            <select data-testid={'routesSelector'} className={'select'} id='route' name='selectRoute' onChange={handleRouteSelectionChange}>
              <option data-testid={'routesDefaultOption'} value={''}>Select Route</option>
              {routeData &&
                routeData.map((route, key) => {
                  return (
                    <option data-testid={'routesOption'} value={route.route_id} key={key}>{route.route_label}</option>
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
      {(departuresData?.stops) && !hasError &&
        <DeparturesDisplay />
      }
      {hasError &&
        <ErrorMessage message={'Uh Oh... Something went wrong.'} /> 
      }
    </section>
  );
}