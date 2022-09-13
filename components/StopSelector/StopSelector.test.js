import {describe, expect, test} from '@jest/globals';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StopSelector from './StopSelector';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from '../../lib/redux/test-utils';
import { jest, beforeEach } from '@jest/globals';

const selectedRoute = 'Route';
const selectedDirection = 0;

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

const testStopsData = [
  {
    place_code: 'STOP1',
    description: 'description 1'
  },
  {
    place_code: 'STOP2',
    description: 'description 2'
  }
];

const initialSelectedState = {
  route: selectedRoute,
  direction: selectedDirection,
  placeCode: ''
};

const initialDataState = {
  directionsData: testDirectionData,
  stopsData: testStopsData,
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

describe('StopSelector Component', () => {
  test('At first render, the default option should be selected', () => {
    // Arrange
    renderWithProviders(<StopSelector />, {
      preloadedState: {
        selection: initialSelectedState,
        data: initialDataState
      }
    });
    // Act
    const defaultOption = screen.getByTestId('stopsDefaultOption');
    const options = screen.getAllByTestId('stopsOption');
    // Assert
    expect(defaultOption.selected).toBeTruthy();
    expect(options[0].selected).toBeFalsy();
    expect(options[1].selected).toBeFalsy();
  });

  test('The data fetch should be called if new stop is selected', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<StopSelector />, {
      preloadedState: {
        selection: initialSelectedState,
        data: initialDataState
      }
    });
    const selectedStop = testStopsData[0].place_code;
    
    // Act
    await user.selectOptions(screen.getByTestId('stopsSelector'), selectedStop);

    // Assert
    expect(fetch).toHaveBeenCalledWith('https://svc.metrotransit.org/nextripv2/' + selectedRoute + '/' + selectedDirection + '/' + selectedStop);
  });

  test('The data fetch should not be called when selecting default option', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<StopSelector />, {
      preloadedState: {
        selection: initialSelectedState,
        data: initialDataState
      }
    });

    const selectedStop = ''; // the default option
    
    // Act
    await user.selectOptions(screen.getByTestId('stopsSelector'), selectedStop);

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
    renderWithProviders(<StopSelector />, {
      preloadedState: {
        selection: initialSelectedState,
        data: initialDataState
      }
    });

    const selectedStop = testStopsData[0].place_code;
    
    // Act
    await user.selectOptions(screen.getByTestId('stopsSelector'), selectedStop);

    // Assert
    expect(await screen.findByTestId('errorMessage')).toBeInTheDocument();
  });
});