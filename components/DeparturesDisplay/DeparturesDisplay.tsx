import { useSelector } from 'react-redux';
import { RootState } from '../../lib/redux/store';
import styles from './DeparturesDisplay.module.scss';


export default function DeparturesDisplay() {

  const departuresData = useSelector((state: RootState) => state.data.departuresData);

  // Since parent component can load this component before departures data is actually ready, we need to check
  if (!departuresData || !departuresData.stops) {
    return (
      <div data-testid={'loading'}>Loading...</div>
    );
  }
  else {
    // stops come in an array but seems like it's always length one
    const stop = departuresData.stops[0];
    return (
      <>
        {departuresData &&
          <div className={styles.departuresSection}>
            <div className={styles.stopDescription}>
              <h2 className={styles.stopName} data-testid={'stopDescription'}>{stop.description}</h2>
              <span className={styles.stopNumber} data-testid={'stopNumber'}><strong>Stop #: </strong>{stop.stop_id}</span>
            </div>
            <div className={styles.stopDepartures}>
              <table className={styles.departuresTable}>
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Destination</th>
                    <th>Departs</th>
                  </tr>
                </thead>
                <tbody>
                  {departuresData.departures &&
                      departuresData.departures.map((departure, key) => {
                        return (
                          <tr className={styles.departure} key={key}>
                            <td data-testid={'routeShortName'}>{departure.route_short_name}</td>
                            <td data-testid={'description'}>{departure.description}</td>
                            <td data-testid={'departureText'}>{departure.departure_text}</td>
                          </tr>
                        );
                      })
                  }
                  
                </tbody>
              </table>
            </div>
          </div>      
        }
      </>
    );
  }
}