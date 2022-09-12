import {describe, expect, test} from '@jest/globals';
import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  test('Display Message from Prop', () => {
    // Arrange
    render(<ErrorMessage message={'test'}/>);
    // Act
    // Assert
    expect(screen.getByTestId('errorMessage')).toHaveTextContent('test');
  });
});