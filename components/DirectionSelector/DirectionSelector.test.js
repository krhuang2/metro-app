import {describe, expect, test} from '@jest/globals';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DirectionSelector from './DirectionSelector';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from '../../lib/redux/test-utils';
import { jest, afterEach } from '@jest/globals';

const selectedRoute = 'Route';

const initialState = {
  route: selectedRoute,
  direction: -1,
  placeCode: ''
};

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

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('DirectionSelector Component', () => {
  test('At first render, the default option should be selected', () => {
    // Arrange
    renderWithProviders(<DirectionSelector directionData={testDirectionData} selectedRoute={selectedRoute} />);
    // Act
    const defaultOption = screen.getByTestId('defaultOption');
    const options = screen.getAllByTestId('option');
    // Assert
    expect(defaultOption.selected).toBeTruthy();
    expect(options[0].selected).toBeFalsy();
    expect(options[1].selected).toBeFalsy();
  });

  test('The dispatch should be called to update selectedDirection if new direction is selected', () => {
    // Arrange
    // const { store } = renderWithProviders(<DirectionSelector directionData={testDirectionData} selectedRoute={selectedRoute} />, {
    //   preloadedState: {
    //     selection: initialState
    //   }
    // });
    
    //store.dispatch()
    //const spy = jest.spyOn(store, 'dispatch');
    // Act
    //userEvent.selectOptions(screen.getByTestId('directionSelector'), '0');
    //fireEvent.change(screen.getByTestId('directionSelector'), {target: { value: 1 }});

    // Assert
    //expect(spy).toHaveBeenCalled();
  });
});