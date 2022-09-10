import { INexTripRoute } from '../../lib/interfaces';

interface IFindByRouteProps {
    routeData: INexTripRoute[];
}
export default function FindByRoute({routeData}: IFindByRouteProps) {

  return (
    <>
      <form>
        <fieldset>
          <legend>Find By Route</legend>
          <div>
            <label htmlFor='selectRoute'>Select Route</label>
            <select id='route' name='selectRoute'>
              <option>Select Route:</option>
              {routeData &&
                routeData.map((route, key) => {
                  return (
                    <option value={route.route_id} key={key}>{route.route_label}</option>
                  );
                })
              }
            </select>
          </div>
        </fieldset>
      </form>
    </>
  );
}