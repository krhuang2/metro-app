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

const mockStopsData = [
  {
    place_code: 'STOP1',
    description: 'description 1'
  },
  {
    place_code: 'STOP2',
    description: 'description 2'
  }
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockStopsData),
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
    const defaultOption = screen.getByTestId('defaultOption');
    const options = screen.getAllByTestId('option');
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
    await user.selectOptions(screen.getByTestId('directionSelector'), direction.toString());

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
    await user.selectOptions(screen.getByTestId('directionSelector'), direction);

    // Assert
    expect(fetch).not.toHaveBeenCalled();
  });

  test('Render error message if data fetch is unsuccessful', async () => {
    // Arrange
    // make fetch mock return response ok: false
    fetch.mockImplementationOnce(() => Promise.resolve({ 
      ok: false,
      json: () => Promise.resolve(mockStopsData)
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
    await user.selectOptions(screen.getByTestId('directionSelector'), direction.toString());

    // Assert
    expect(await screen.findByTestId('errorMessage')).toBeInTheDocument();
  });
});