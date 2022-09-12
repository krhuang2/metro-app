import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IStop } from '../../lib/interfaces';
import { updatePlaceCode } from '../../lib/redux/slices/selectionSlice';
import { RootState } from '../../lib/redux/store';

interface IStopSelectorProps {
    stopData: IStop[];
    selectedDirection: number;
}
export default function StopSelector({stopData, selectedDirection}: IStopSelectorProps) {
  // get the global state
  const selectedStop = useSelector((state: RootState) => state.selection.placeCode);
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset the current selected option if the selected route changes
    let element: any = document.getElementById('stop');
    if (element) {
      element.selectedIndex = 0;
    }
    
  },[selectedDirection]);

  return (
    <>
      <div>
        <label htmlFor='selectStop'>Select Stop: </label>
        <select id='stop' name='selectStop' onChange={(e) => dispatch(updatePlaceCode(e.currentTarget.value))}>
          <option value={''}>Select Stop</option>
          {stopData &&
                stopData?.map((stop, key) => {
                  return (
                    <option value={stop.place_code} key={key}>{stop.description}</option>
                  );
                })
          }
        </select>
      </div>
      <div>{'You have selected: ' + selectedStop}</div>
    </>
  );
}