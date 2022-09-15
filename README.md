# Metro NexTrip Demo App

This is a demo app using the NexTrip API built on Next.js with Redux for state management and Jest/React Testing Library for testing. View it currently hosted on vercel: https://metro-app-krhuang2.vercel.app/ 

## Get Started
Clone the repo locally and run `npm install`.

To run the app, use `npm run build` and then `npm start` to start the local server. Navigate to `http://localhost:3000` to view locally.

To run tests use `npm run test` - Note: didn't have time to get all unit tests in for complete coverage.

## Assumptions
- App should have same/similar functionality to the provided live example: https://www.metrotransit.org/nextrip
- Users can search by selecting route/direction/stop or by stop number.
- Like said example, inputs appear after the user selects a previous input. Also, input is reset if previous input is reset.
- Should have the ability to navigate back and forward between departure selections (not on each selection however)
- Data is updated frequently and therefore can't be fetched SSG
- NexTrip API is secure and can handle the user load

## How It Works
I chose Next.js as a framework since it is built on React and has additional features to make it a full fledged application such as built-in page routing, api routes, SSG/SSR, CSS modules, typescript support and more. It is also packaged with great defaults to create a production ready app with built-in webpack/babel for codesplitting and compilation.

### Basic Info
- The app has 3 page components (Home, find-by-route, find-by-stop). The latter 2 will handle all the functionality.
- I decided to separate the 2 searches because their functionality doesn't really overlap and we can then SSR the data fetch for Find By route's initial options.

#### Find By Route
- When user navigates to the find by route page, they have the option to select the route based on the SSR data.
- Selecting a route then updates the state variable `selectedRoute` and then makes a client side fetch to get the available directions to update the `directionsData` state.
- If `directionsData` is updated and there are no errors, the `<DirectionSelector>` component is rendered
- If the user selects a valid direction from the `<DirectionSelector>` component, it will client side fetch to get the available stops and then updates `selectedDirection` and `stopsData`.
- If `stopsData` is updated and there are no errors, the `<StopSelector>` component is rendered
- If the user selects a valid stop from the `<StopSelector>` component, it will reroute the user to `/find-by-route/{selectedRoute}/{selectedDirection}/{selectedStop}`
- Back on the parent component, it will check on re-render whether there are params in the `router.query` object. If there are 3 params, it will attempt to do a fetch using the params for the `departuresData`.
- If the fetch is successful with no errors, the `<DeparturesDisplay>` component is rendered using `departuresData`

#### Find By Stop
- If the user enters a valid stop number and hits the submit button, it will reroute to `/find-by-stop/{input}` and attempt to fetch for the departure data.
- If the fetch was unsuccessful, display the error message. If successful, update the `departuresData` state and display the `<DeparturesDisplay>` component.


## TODO

I didn't want to spend TOO much time on this, but there were things I still would want to do to make the app better:

- Address accessibility (focus management, aria-live announcers, etc...)
- Finish unit tests
- Styling to make it look better
- Is there a better way to handle state/data fetching? (SWR?)
- Maybe look into Redux Undo for managing back and forth routing?
