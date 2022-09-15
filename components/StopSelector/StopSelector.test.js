import {describe, expect, test} from '@jest/globals';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StopSelector from './StopSelector';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from '../../lib/redux/test-utils';
import { createMockRouter } from '../../lib/utils/MockRouter';
import { RouterContext } from 'next/dist/shared/lib/router-context';


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

  test('New route should be pushed if new stop is selected', async () => {
    // Arrange
    const user = userEvent.setup();
    const router = createMockRouter();
    renderWithProviders(
      <RouterContext.Provider value={router}>
        <StopSelector />
      </RouterContext.Provider>
      , {
        preloadedState: {
          selection: initialSelectedState,
          data: initialDataState
        }
      });

    const selectedStop = testStopsData[0].place_code;
    
    // Act
    await user.selectOptions(screen.getByTestId('stopsSelector'), selectedStop);

    // Assert
    expect(router.push).toHaveBeenCalledWith('/find-by-route/' + selectedRoute + '/' + selectedDirection + '/' + selectedStop);
  });

  test('The router should not be called when selecting default option', async () => {
    // Arrange
    const user = userEvent.setup();
    const router = createMockRouter();
    renderWithProviders(
      <RouterContext.Provider value={router}>
        <StopSelector />
      </RouterContext.Provider>
      , {
        preloadedState: {
          selection: initialSelectedState,
          data: initialDataState
        }
      });

    const selectedStop = ''; // the default option
    
    // Act
    await user.selectOptions(screen.getByTestId('stopsSelector'), selectedStop);

    // Assert
    expect(router.push).not.toHaveBeenCalled();
  });
});