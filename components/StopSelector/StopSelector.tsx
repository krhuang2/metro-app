import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeparturesData } from '../../lib/redux/slices/dataSlice';
import { updatePlaceCode } from '../../lib/redux/slices/selectionSlice';
import { RootState } from '../../lib/redux/store';
import ErrorMessage from '../ErrorMessage';


export default function StopSelector() {
  // get the global state
  const selectedRoute = useSelector((state: RootState) => state.selection.route);
  const selectedDirection = useSelector((state: RootState) => state.selection.direction);
  const stopsData = useSelector((state: RootState) => state.data.stopsData);
  // Keep track if there are errors
  const [hasError, setHasError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset the current selected option on rerender
    let element: any = document.getElementById('stop');
    if (element) {
      element.value = '';
    }
    
  },[selectedDirection]); // set selectedDirection as a dependency to rerender/reset if it changes

  const fetchDeparturesData = async (selectedStop: string) => {
    fetch('https://svc.metrotransit.org/nextripv2/' + selectedRoute + '/' + selectedDirection + '/' + selectedStop).then((response) => {
      if (!response.ok) {
        setHasError(true);
      } else {setHasError(false);}
      return response.json();
    }).then((data) => {
      dispatch(updateDeparturesData(data));
    });
  };

  const handleStopSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStop = e.currentTarget.value;
    dispatch(updatePlaceCode(selectedStop));
    if (selectedStop !== '') {
      fetchDeparturesData(selectedStop); // if a valid selection, fetch data and update global state
    }
    else {
      dispatch(updateDeparturesData(null)); // if reseting to default selection, set state as null
    }
  };

  if (hasError) {
    return (
      <ErrorMessage message={'Error fetching Direction data'}/>
    );
  }

  return (
    <>
      <div>
        <label className={'screenReaderText'} htmlFor='selectStop'>Select Stop</label>
        <select data-testid={'stopsSelector'} className={'select'} id='stop' name='selectStop' onChange={handleStopSelectionChange}>
          <option data-testid={'stopsDefaultOption'} value={''}>Select Stop</option>
          {stopsData &&
                stopsData?.map((stop, key) => {
                  return (
                    <option data-testid={'stopsOption'} value={stop.place_code} key={key}>{stop.description}</option>
                  );
                })
          }
        </select>
      </div>
    </>
  );
}