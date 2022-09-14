import {describe, expect, test} from '@jest/globals';
import { screen } from '@testing-library/react';
import FindByRoute from './FindByRoute';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from '../../lib/redux/test-utils';
import { jest, beforeEach } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { updateDeparturesData } from '../../lib/redux/slices/dataSlice';

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
    json: () => Promise.resolve([]),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe('FindByRoute Component', () => {
  test.only('Do not display other components on inital load', () => {
    // Arrange
    renderWithProviders(<FindByRoute />);
    // Act
    // Assert
    expect((screen.queryByTestId('directionsSelector'))).toBeNull();
    expect((screen.queryByTestId('stopsSelector'))).toBeNull();
    expect((screen.queryByTestId('departuresSection'))).toBeNull();
  });

  test('Do not fetch data if no stop input was entered', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<FindByRoute />);

    // Act
    await user.click(screen.getByTestId('searchButton'));
    // Assert
    expect(fetch).not.toHaveBeenCalled();
  });

  test('Do not fetch data if no stop input is Nan/Empty', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<FindByRoute />);

    const stopSearch = screen.getByTestId('stopSearch');
    // Act
    await user.type(stopSearch, '12345');
    await user.clear(stopSearch);
    await user.click(screen.getByTestId('searchButton'));
    // Assert
    expect(fetch).not.toHaveBeenCalled();
  });

  test('Fetch departures if valid stop number', async () => {
    // Arrange
    const user = userEvent.setup();
    const { store } = renderWithProviders(<FindByRoute />);

    // make fetch mock to execute dispatch
    fetch.mockImplementationOnce(() => Promise.resolve({ 
      ok: true,
      json: () => Promise.resolve(store.dispatch(updateDeparturesData(validDeparturesData)))
    }));

    const stopSearch = screen.getByTestId('stopSearch');
    const input = '56334';
    // Act
    await user.type(stopSearch, input);
    await user.click(screen.getByTestId('searchButton'));
    // Assert
    expect(fetch).toHaveBeenCalledWith('https://svc.metrotransit.org/nextripv2/' + input);
  });

  test('Display error message if fetch returns with error', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<FindByRoute />);

    // make fetch mock to execute dispatch
    fetch.mockImplementationOnce(() => Promise.resolve({ 
      ok: false,
      json: () => Promise.resolve([])
    }));

    const stopSearch = screen.getByTestId('stopSearch');
    const input = '56334';
    // Act
    await user.type(stopSearch, input);
    await user.click(screen.getByTestId('searchButton'));
    // Assert
    expect(await screen.findByTestId('errorMessage')).toBeInTheDocument();
  });
});