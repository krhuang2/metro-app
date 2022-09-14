import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetData, updateDeparturesData } from '../../lib/redux/slices/dataSlice';
import { RootState } from '../../lib/redux/store';
import DeparturesDisplay from '../DeparturesDisplay';
import ErrorMessage from '../ErrorMessage/ErrorMessage';


export default function FindByStop() {

  // Keep track if there are errors
  const [hasError, setHasError] = useState(false);

  const departuresData = useSelector((state: RootState) => state.data.departuresData);

  const dispatch = useDispatch();
  const [initialLoad, setIntialLoad] = useState(true); // Is this a new load on the page?

  // Want to make sure we reset all state if we navigate off and on again
  if (initialLoad) {
    dispatch(resetData());
    setIntialLoad(false);
  }

  const fetchDeparturesData = async (stopId: number) => {
    const url = 'https://svc.metrotransit.org/nextripv2/' + stopId;

    fetch(url).then((response) => {
      if (!response.ok) {
        setHasError(true);
      } else {setHasError(false);}
      return response.json();
    }).then((data) => {
      dispatch(updateDeparturesData(data));
    });
  };

  // Function to call to fetch departure data when submit is clicked
  const handleSearchOnClick = (event: any) => {
    event.preventDefault();
    const inputValue = (document.getElementById('stopSearch') as HTMLInputElement).valueAsNumber;
    // Only valid submission if there is input
    if (!isNaN(inputValue)){
      fetchDeparturesData(inputValue);
    }
  };

  return (
    <section className={'contentContainer'}>
      <form className={'form'}>
        <fieldset>
          <legend>Find By Stop Number</legend>
          <div>
            <label htmlFor={'stopNumber'}>Enter Stop Number: </label>
            <input data-testid={'stopSearch'} id={'stopSearch'} type={'number'} name={'stopNumber'}></input>
            <button data-testid={'searchButton'} id={'search'} onClick={handleSearchOnClick}>Search</button>
          </div>
        </fieldset>
      </form>
      {(departuresData?.stops) && (!hasError) &&
        <DeparturesDisplay />
      }
      {hasError &&
        <ErrorMessage message={'Invalid Stop Number Entered'}/>
      }
    </section>
  );
}