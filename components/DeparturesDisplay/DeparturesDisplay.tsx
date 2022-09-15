import { useSelector } from 'react-redux';
import { RootState } from '../../lib/redux/store';
import styles from './DeparturesDisplay.module.scss';

// Component to display departures based on the departuresData state
export default function DeparturesDisplay() {

  const departuresData = useSelector((state: RootState) => state.data.departuresData);

  const stop = departuresData?.stops[0]; // stops come in an array but seems like it's always length one

  return (
    <>
      {stop &&
          <div data-testid={'departuresSection'} className={styles.departuresSection}>
            <div className={styles.stopDescription}>
              <h2 className={styles.stopName} data-testid={'stopDescription'}>{stop.description}</h2>
              <span className={styles.stopNumber} data-testid={'stopNumber'}><strong>Stop #: </strong>{stop.stop_id}</span>
            </div>
            <div className={styles.stopDepartures}>
              <table className={styles.departuresTable}>
                <thead className={styles.tableHeading}>
                  <tr>
                    <th>Route</th>
                    <th>Destination</th>
                    <th className={styles.textRight}>Departs</th>
                  </tr>
                </thead>
                <tbody>
                  {departuresData?.departures &&
                      departuresData.departures.map((departure, key) => {
                        return (
                          <tr className={styles.departure} key={key}>
                            <td data-testid={'routeShortName'}>{departure.route_short_name}</td>
                            <td data-testid={'description'}>{departure.description}</td>
                            <td className={styles.textRight} data-testid={'departureText'}>{departure.departure_text}</td>
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