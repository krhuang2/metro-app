import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IDirection } from '../../lib/interfaces';
import { updateDirection } from '../../lib/redux/slices/selectionSlice';
import { RootState } from '../../lib/redux/store';

interface IDirectionSelectorProps {
    directionData: IDirection[];
    selectedRoute: string;
}
export default function DirectionSelector({directionData, selectedRoute}: IDirectionSelectorProps) {
  // get the global state
  const selectedDirection = useSelector((state: RootState) => state.selection.direction);
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset the current selected option if the selected route changes
    let element: any = document.getElementById('direction');
    if (element) {
      element.selectedIndex = 0;
    }
  },[selectedRoute]);


  return (
    <>
      <div>
        <label htmlFor='selectDirection'>Select Direction: </label>
        <select id='direction' name='selectDirection' onChange={(e) => dispatch(updateDirection(e.currentTarget.value))}>
          <option value={-1}>Select Direction</option>
          {directionData &&
                directionData.map((direction, key) => {
                  return (
                    <option value={direction.direction_id} key={key}>{direction.direction_name}</option>
                  );
                })
          }
        </select>
      </div>
      <div>{'You have selected: ' + selectedDirection}</div>
    </>
  );
}