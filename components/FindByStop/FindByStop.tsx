import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetData, updateDeparturesData } from '../../lib/redux/slices/dataSlice';
import { RootState } from '../../lib/redux/store';
import DeparturesDisplay from '../DeparturesDisplay';
import ErrorMessage from '../ErrorMessage/ErrorMessage';


export default function FindByStop() {

  const router = useRouter();

  // Keep track if there are errors
  const [hasError, setHasError] = useState(false);
  // Get the global state data
  const departuresData = useSelector((state: RootState) => state.data.departuresData);

  const dispatch = useDispatch();
  // Function that fetches departuresData and then updates global state data or sets error
  const fetchDeparturesData = useCallback(async (stopId: number | string) => {
    const url = 'https://svc.metrotransit.org/nextripv2/' + stopId;

    fetch(url).then((response) => {
      if (!response.ok) {
        setHasError(true);
      } else {setHasError(false);}
      return response.json();
    }).then((data) => {
      dispatch(updateDeparturesData(data));
    });
  },[dispatch]);

  // Function to route with parameter when submit is clicked. Will trigger useEffect and fetch new data
  const handleSearchOnClick = (event: any) => {
    event.preventDefault();
    const inputValue = (document.getElementById('stopSearch') as HTMLInputElement).valueAsNumber;
    // Only valid submission if there is input
    if (!isNaN(inputValue)){
      router.push('/find-by-stop/' + inputValue);
    }
  };

  // fetch the data if url params exist
  useEffect(() => {
    if (router.isReady) {
      if (router.query.slug && router.query.slug?.length > 0) {
        const stopNumber = router.query.slug[0];
        fetchDeparturesData(stopNumber);
      }
      else {
        dispatch(resetData());
      }
    }
  },[fetchDeparturesData, router.isReady, router.query.slug, dispatch]);
  

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