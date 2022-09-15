import {describe, expect, test} from '@jest/globals';
import { screen } from '@testing-library/react';
import FindByRoute from './FindByRoute';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from '../../lib/redux/test-utils';
import { jest, beforeEach } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { createMockRouter } from '../../lib/utils/MockRouter';
import { RouterContext } from 'next/dist/shared/lib/router-context';

const routes = [
  {
    route_id: '901',
    agency_id: 0,
    route_label: 'route1'
  },
  {
    route_id: '902',
    agency_id: 0,
    route_label: 'route2'
  }
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe('FindByRoute Component', () => {
  test('Do not display other components on inital load', () => {
    // Arrange
    const router = createMockRouter();
    renderWithProviders(
      <RouterContext.Provider value={router}>
        <FindByRoute routeData={routes} />
      </RouterContext.Provider>
    );
    // Act
    // Assert
    expect((screen.queryByTestId('directionsSelector'))).toBeNull();
    expect((screen.queryByTestId('stopsSelector'))).toBeNull();
    expect((screen.queryByTestId('departuresSection'))).toBeNull();
  });

  test('Expect the route options to be populated', () => {
    // Arrange
    const router = createMockRouter();
    renderWithProviders(
      <RouterContext.Provider value={router}>
        <FindByRoute routeData={routes} />
      </RouterContext.Provider>
    );

    // Act
    // Assert
    expect(screen.getAllByTestId('routesOption').length).toBe(routes.length);
  });

  test('Do not fetch data if user selects default option', async () => {
    // Arrange
    const user = userEvent.setup();
    const router = createMockRouter();
    renderWithProviders(
      <RouterContext.Provider value={router}>
        <FindByRoute routeData={routes} />
      </RouterContext.Provider>
    );

    const route = ''; // the default option
    
    // Act
    await user.selectOptions(screen.getByTestId('routesSelector'), route);

    // Assert
    expect(fetch).not.toHaveBeenCalled();
  });

  test('Fetch directions if option is selected', async () => {
    // Arrange
    const user = userEvent.setup();
    const router = createMockRouter();
    renderWithProviders(
      <RouterContext.Provider value={router}>
        <FindByRoute routeData={routes} />
      </RouterContext.Provider>
    );

    const route = routes[0].route_id;
    
    // Act
    await user.selectOptions(screen.getByTestId('routesSelector'), route);

    // Assert
    expect(fetch).toHaveBeenCalledWith('https://svc.metrotransit.org/nextripv2/directions/' + route);
  });

  test('Render error message if data fetch is unsuccessful', async () => {
    // Arrange
    // make fetch mock return response ok: false
    fetch.mockImplementationOnce(() => Promise.resolve({ 
      ok: false,
      json: () => Promise.resolve([])
    }));

    const user = userEvent.setup();
    const router = createMockRouter();
    renderWithProviders(
      <RouterContext.Provider value={router}>
        <FindByRoute routeData={routes} />
      </RouterContext.Provider>
    );

    const route = routes[0].route_id;
    
    // Act
    await user.selectOptions(screen.getByTestId('routesSelector'), route);

    // Assert
    expect(await screen.findByTestId('errorMessage')).toBeInTheDocument();
  });
});