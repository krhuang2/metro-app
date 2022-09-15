import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeparturesData } from '../../lib/redux/slices/dataSlice';
import { updatePlaceCode } from '../../lib/redux/slices/selectionSlice';
import { RootState } from '../../lib/redux/store';

// Component that renders the stop selector. If a selection is made, it will use the selected
// route and selected direction to populate a url to navigate to with params that will trigger
// a fetch for departure data.
export default function StopSelector() {
  // get the global state
  const selectedRoute = useSelector((state: RootState) => state.selection.route);
  const selectedDirection = useSelector((state: RootState) => state.selection.direction);
  const stopsData = useSelector((state: RootState) => state.data.stopsData);

  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    // Reset the current selected option on rerender
    let element: any = document.getElementById('stop');
    if (element) {
      element.value = '';
    }
    
  },[selectedDirection]); // set selectedDirection as a dependency to rerender/reset if it changes

  const handleStopSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStop = e.currentTarget.value;
    dispatch(updatePlaceCode(selectedStop));
    if (selectedStop !== '') {
      router.push('/find-by-route/' + selectedRoute + '/' + selectedDirection + '/' + selectedStop);
    }
    else {
      dispatch(updateDeparturesData(null)); // if reseting to default selection, set state as null
    }
  };

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