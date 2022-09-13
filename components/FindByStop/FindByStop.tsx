import { useState } from 'react';
import { IDepartures } from '../../lib/interfaces';
import DeparturesDisplay from '../DeparturesDisplay';
import ErrorMessage from '../ErrorMessage/ErrorMessage';


export default function FindByStop() {
  //const [stopInput, setStopInput] = useState<number | null>(null);
  const [departuresData, setDeparturesData] = useState<IDepartures | null>(null);
  const [hasError, setHasError] = useState(false);

  const fetchDeparturesData = async (stopId: number) => {
    const url = 'https://svc.metrotransit.org/nextripv2/' + stopId;

    fetch(url).then((response) => {
      if (!response.ok) {
        setHasError(true);
      } else {setHasError(false);}
      return response.json();
    }).then((data) => {
      setDeparturesData(data);
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

  // const handleInputChage = (event: any) => {
  //   // check if empty input
  //   if (event.target.value == '') {
  //     setInputValue(NaN);
  //   }
  //   else {
  //     setInputValue(event.target.value);
  //   }
  // };

  return (
    <>
      <form className={'form'}>
        <fieldset>
          <legend>Find By Stop Number</legend>
          <div>
            <label htmlFor={'stopNumber'}>Enter Stop Number: </label>
            <input id={'stopSearch'} type={'number'} name={'stopNumber'}></input>
            <button id={'search'} onClick={handleSearchOnClick}>Search</button>
          </div>
        </fieldset>
      </form>
      {(departuresData != null) && (!hasError) &&
        <DeparturesDisplay departuresData={departuresData}/>
      }
      {hasError &&
        <ErrorMessage message={'Invalid Stop Number Entered'}/>
      }
    </>
  );
}