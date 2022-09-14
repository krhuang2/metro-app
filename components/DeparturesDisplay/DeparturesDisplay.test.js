import {describe, expect, test} from '@jest/globals';
import { screen } from '@testing-library/react';
import DeparturesDisplay from './DeparturesDisplay';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from '../../lib/redux/test-utils';

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

const initialValidState = {
  departuresData: validDeparturesData,
  stopsData: null,
  directionsData: null
};

describe('DeparturesDisplay Component', () => {
  test('Display nothing if departuresData is incomplete', () => {
    // Arrange
    renderWithProviders(<DeparturesDisplay />);
    // Act
    // Assert
    expect((screen.queryByTestId('departuresSection'))).toBeNull();
  });

  test('Display departuresSection if departuresData is valid', () => {
    // Arrange
    renderWithProviders(<DeparturesDisplay />, {
      preloadedState: {
        data: initialValidState
      }
    });
    // Act
    const element = screen.queryByTestId('departuresSection');
    // Assert
    expect(element).not.toBeNull();
  });

  test('Display valid data if departuresData is valid', () => {
    // Arrange
    renderWithProviders(<DeparturesDisplay />, {
      preloadedState: {
        data: initialValidState
      }
    });
    // Act
    const stopDescription = screen.getByTestId('stopDescription').textContent;
    const stopNumber = screen.getByTestId('stopNumber').textContent;
    const routeShortName = screen.getAllByTestId('routeShortName')[0].textContent;
    const description = screen.getAllByTestId('description')[0].textContent;
    const departureText = screen.getAllByTestId('departureText')[0].textContent;
    // Assert
    expect(stopDescription).toBe(validDeparturesData.stops[0].description);
    expect(stopNumber).toBe('Stop #: ' + validDeparturesData.stops[0].stop_id);
    expect(routeShortName).toBe(validDeparturesData.departures[0].route_short_name);
    expect(description).toBe(validDeparturesData.departures[0].description);
    expect(departureText).toBe(validDeparturesData.departures[0].departure_text);
  });
});