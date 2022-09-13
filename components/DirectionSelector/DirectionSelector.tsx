import { useDispatch, useSelector } from 'react-redux';
import { updateStopsData } from '../../lib/redux/slices/dataSlice';
import { updateDirection } from '../../lib/redux/slices/selectionSlice';
import { RootState } from '../../lib/redux/store';
import React, { useEffect, useState } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function DirectionSelector() {
  // get the global state
  const selectedRoute = useSelector((state: RootState) => state.selection.route);
  const directionData = useSelector((state: RootState) => state.data.directionsData);
  // Keep track if there are errors
  const [hasError, setHasError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset the current selected option on rerender
    let element: any = document.getElementById('direction');
    if (element) {
      element.value = -1;
    }
    
  },[selectedRoute]);
  
  const fetchStopsData = async (selectedDirection: number) => {
    fetch('https://svc.metrotransit.org/nextripv2/stops/' + selectedRoute + '/' + selectedDirection).then((response) => {
      if (!response.ok) {
        setHasError(true);
      } else {setHasError(false);}
      return response.json();
    }).then((data) => {
      dispatch(updateStopsData(data));
    });
  };

  const handleDirectionSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDirection = Number(e.currentTarget.value);
    dispatch(updateDirection(selectedDirection));
    if (selectedDirection !== -1) {
      fetchStopsData(selectedDirection); // if a valid selection, fetch data and update global state
    }
    else {
      dispatch(updateStopsData(null)); // if reseting to default selection, set state as null
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
        <label className={'screenReaderText'} htmlFor='selectDirection'>Select Direction</label>
        <select className={'select'} data-testid={'directionSelector'} id='direction' name='selectDirection' onChange={handleDirectionSelectionChange}>
          <option data-testid={'defaultOption'} value={-1}>Select Direction</option>
          {directionData &&
                directionData.map((direction, key) => {
                  return (
                    <option data-testid={'option'} value={direction.direction_id} key={key}>{direction.direction_name}</option>
                  );
                })
          }
        </select>
      </div>
    </>
  );
}