import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card, CardHeader, CardContent, CardFooter } from '../Card';

describe('Card Component', () => {
  it('should render children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('should render as div by default', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('should render as article when specified', () => {
    render(<Card as="article">Content</Card>);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('should apply glass effect', () => {
    const { container } = render(<Card glass>Glass Card</Card>);
    expect(container.firstChild).toHaveClass('backdrop-blur-xl');
  });

  it('should handle click events', () => {
    const onClick = jest.fn();
    render(<Card onClick={onClick}>Clickable</Card>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should add button role when clickable', () => {
    const onClick = jest.fn();
    render(<Card onClick={onClick}>Clickable</Card>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle keyboard navigation when clickable', () => {
    const onClick = jest.fn();
    render(<Card onClick={onClick}>Keyboard Card</Card>);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(card, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('should support aria-label', () => {
    render(<Card aria-label="User profile card">Content</Card>);
    expect(screen.getByText('Content').closest('div')).toHaveAttribute('aria-label', 'User profile card');
  });

  it('should apply hover styles', () => {
    const { container } = render(<Card hover>Hover Card</Card>);
    expect(container.firstChild).toHaveClass('hover:shadow-xl');
  });

  it('should support custom className', () => {
    const { container } = render(<Card className="custom-class">Test</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('CardHeader', () => {
  it('should render children', () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('should apply default padding', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    expect(container.firstChild).toHaveClass('px-6');
  });
});

describe('CardContent', () => {
  it('should render children', () => {
    render(<CardContent>Content</CardContent>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('CardFooter', () => {
  it('should render children', () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
