import { useEffect } from 'react';
import { IDepartures } from '../../lib/interfaces';
import styles from './DeparturesDisplay.module.scss';

interface IDeparturesDisplayProps {
    departuresData: IDepartures;
    selectedRoute?: string;
    selectedDirection?: number;
    selectedStop?: string;
}
export default function DeparturesDisplay({departuresData, selectedRoute, selectedDirection, selectedStop}: IDeparturesDisplayProps) {
  // set state variable

  useEffect(() => {
    console.log('Departures Display rendered');
  },[selectedRoute, selectedDirection, selectedStop]);

  // stops come in an array but seems like it's always length one
  const stop = departuresData?.stops[0];

  return (
    <>
      {departuresData &&
        <div className={styles.departuresSection}>
          <div className={styles.stopDescription}>
            <h2 className={styles.stopName}>{stop.description}</h2>
            <span className={styles.stopNumber}><strong>Stop #: </strong>{stop.stop_id}</span>
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
                          <td>{departure.route_short_name}</td>
                          <td>{departure.description}</td>
                          <td>{departure.departure_text}</td>
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