import {describe, expect, test} from '@jest/globals';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DirectionSelector from './DirectionSelector';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from '../../lib/redux/test-utils';
import { jest, beforeEach } from '@jest/globals';

const selectedRoute = 'Route';

const testDirectionData = [
  {
    direction_id: 0,
    direction_name: 'North'
  },
  {
    direction_id: 1,
    direction_name: 'South'
  }
];

const initialSelectedState = {
  route: selectedRoute,
  direction: -1,
  placeCode: ''
};

const initialDataState = {
  directionsData: testDirectionData,
  stopsData: null,
  departuresData: null
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe('DirectionSelector Component', () => {
  test('At first render, the default option should be selected', () => {
    // Arrange
    renderWithProviders(<DirectionSelector />, {
      preloadedState: {
        selection: initialSelectedState,
        data: initialDataState
      }
    });
    // Act
    const defaultOption = screen.getByTestId('directionsDefaultOption');
    const options = screen.getAllByTestId('directionsOption');
    // Assert
    expect(defaultOption.selected).toBeTruthy();
    expect(options[0].selected).toBeFalsy();
    expect(options[1].selected).toBeFalsy();
  });

  test('The data fetch should be called if new direction is selected', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<DirectionSelector />, {
      preloadedState: {
        selection: initialSelectedState,
        data: initialDataState
      }
    });

    const direction = testDirectionData[0].direction_id;
    const route = selectedRoute;
    
    // Act
    await user.selectOptions(screen.getByTestId('directionsSelector'), direction.toString());

    // Assert
    expect(fetch).toHaveBeenCalledWith('https://svc.metrotransit.org/nextripv2/stops/' + route + '/' + direction);
  });

  test('The data fetch should not be called when selecting default option', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<DirectionSelector />, {
      preloadedState: {
        selection: initialSelectedState,
        data: initialDataState
      }
    });

    const direction = '-1'; // the default option
    
    // Act
    await user.selectOptions(screen.getByTestId('directionsSelector'), direction);

    // Assert
    expect(fetch).not.toHaveBeenCalled();
  });

  test('Render error message if data fetch is unsuccessful', async () => {
    // Arrange
    // make fetch mock return response ok: false
    fetch.mockImplementationOnce(() => Promise.resolve({ 
      ok: false,
      json: () => Promise.resolve([])
    }));

    const user = userEvent.setup();
    renderWithProviders(<DirectionSelector />, {
      preloadedState: {
        selection: initialSelectedState,
        data: initialDataState
      }
    });

    const direction = testDirectionData[0].direction_id;
    
    // Act
    await user.selectOptions(screen.getByTestId('directionsSelector'), direction.toString());

    // Assert
    expect(await screen.findByTestId('errorMessage')).toBeInTheDocument();
  });
});