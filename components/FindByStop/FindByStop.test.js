import {describe, expect, test} from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import FindByStop from './FindByStop';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from '../../lib/redux/test-utils';
import { jest, beforeEach } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { createMockRouter } from '../../lib/utils/MockRouter';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import React from 'react';

const validDeparturesData = {
  stops: [
    {
      stop_id: 56334,
      description: 'Target Field Station Platform 2'
    }
  ],
  departures: [
    {
      departure_text: '4:00',
      description: 'to Mall of America',
      route_short_name: 'Blue'
    }
  ]
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(validDeparturesData),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe('FindByStop Component', () => {
  test('Do not display departuresDisplay component on inital load', () => {
    // Arrange
    const router = createMockRouter();
    renderWithProviders(
      <RouterContext.Provider value={router}>
        <FindByStop />
      </RouterContext.Provider>
    );
    // Act
    // Assert
    expect((screen.queryByTestId('departuresSection'))).toBeNull();
  });

  test('Do not fetch data if no stop input was entered', async () => {
    // Arrange
    const user = userEvent.setup();
    const router = createMockRouter();
    renderWithProviders(
      <RouterContext.Provider value={router}>
        <FindByStop />
      </RouterContext.Provider>
    );

    // Act
    await user.click(screen.getByTestId('searchButton'));
    // Assert
    expect(fetch).not.toHaveBeenCalled();
  });

  test('Do not fetch data if no stop input is Nan/Empty', async () => {
    // Arrange
    const user = userEvent.setup();
    const router = createMockRouter();
    renderWithProviders(
      <RouterContext.Provider value={router}>
        <FindByStop />
      </RouterContext.Provider>
    );

    const stopSearch = screen.getByTestId('stopSearch');
    // Act
    await user.type(stopSearch, '12345');
    await user.clear(stopSearch);
    await user.click(screen.getByTestId('searchButton'));
    // Assert
    expect(fetch).not.toHaveBeenCalled();
  });

  test('Fetch departures if valid stop number param in url', async () => {
    // Arrange
    const stopNumber = '12345';
    const router = createMockRouter({
      query: { 
        slug: [stopNumber]
      }
    });

    renderWithProviders(
      <RouterContext.Provider value={router}>
        <FindByStop />
      </RouterContext.Provider>
    );
    

    // Act

    // Assert
    await waitFor(() => { 
      expect(fetch).toHaveBeenCalledWith('https://svc.metrotransit.org/nextripv2/' + stopNumber); 
    });
    expect(await screen.findByTestId('departuresSection')).toBeInTheDocument();
  });

  test('Call router push if valid stop number was entered', async () => {
    // Arrange
    const router = createMockRouter();
    const user = userEvent.setup();
    renderWithProviders(
      <RouterContext.Provider value={router}>
        <FindByStop />
      </RouterContext.Provider>
    );


    const stopSearch = screen.getByTestId('stopSearch');
    const input = '56334';
    // Act
    await user.type(stopSearch, input);
    await user.click(screen.getByTestId('searchButton'));
    // Assert
    expect(router.push).toHaveBeenCalledWith('/find-by-stop/' + input);
  });

  test.only('Display error message if fetch returns with error', async () => {
    // Arrange
    const stopNumber = '12345';
    const router = createMockRouter({
      query: { 
        slug: [stopNumber]
      }
    });

    renderWithProviders(
      <RouterContext.Provider value={router}>
        <FindByStop />
      </RouterContext.Provider>
    );

    // make fetch mock to execute dispatch
    fetch.mockImplementationOnce(() => Promise.resolve({ 
      ok: false,
      json: () => Promise.resolve({})
    }));


    // Act
    // Assert
    await waitFor(() => { 
      expect(fetch).toHaveBeenCalledWith('https://svc.metrotransit.org/nextripv2/' + stopNumber); 
    });

    await expect(screen.findByTestId('errorMessage')).toBeInTheDocument();
  });
});