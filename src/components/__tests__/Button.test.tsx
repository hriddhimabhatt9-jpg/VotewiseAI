import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/Button';

describe('Button Component (Legacy)', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should render primary variant by default', () => {
    const { container } = render(<Button>Primary</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('from-blue-500');
  });

  it('should render secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('from-emerald-400');
  });

  it('should render outline variant', () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('border-2');
  });

  it('should render danger variant', () => {
    const { container } = render(<Button variant="danger">Delete</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('from-red-500');
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should be disabled when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should render correct size classes', () => {
    const { container: sm } = render(<Button size="sm">Small</Button>);
    const { container: lg } = render(<Button size="lg">Large</Button>);
    expect(sm.querySelector('button')?.className).toContain('px-4');
    expect(lg.querySelector('button')?.className).toContain('px-8');
  });

  it('should prevent default on click when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const { container } = render(<Button className="custom">Custom</Button>);
    expect(container.querySelector('button')?.className).toContain('custom');
  });
});
