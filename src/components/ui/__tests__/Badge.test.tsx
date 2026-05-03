import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge, ProgressBar, ScoreRing } from '../Badge';

describe('Badge Component', () => {
  it('should render with default variant', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('should render success variant', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-emerald-50');
  });

  it('should render danger variant', () => {
    const { container } = render(<Badge variant="danger">Danger</Badge>);
    expect(screen.getByText('Danger')).toBeInTheDocument();
  });

  it('should render warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('should render info variant', () => {
    render(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('should support size prop', () => {
    const { container } = render(<Badge size="md">Medium</Badge>);
    expect(container.firstChild).toHaveClass('px-3');
  });
});

describe('ProgressBar Component', () => {
  it('should render with correct value', () => {
    render(<ProgressBar value={50} max={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
  });

  it('should have correct aria attributes', () => {
    render(<ProgressBar value={75} max={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });

  it('should handle 0% progress', () => {
    render(<ProgressBar value={0} max={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
  });

  it('should handle 100% progress', () => {
    render(<ProgressBar value={100} max={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
  });

  it('should show label when showLabel is true', () => {
    render(<ProgressBar value={50} max={100} showLabel />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should not exceed 100%', () => {
    render(<ProgressBar value={150} max={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
  });
});

describe('ScoreRing Component', () => {
  it('should render with score', () => {
    render(<ScoreRing score={75} />);
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('/ 100')).toBeInTheDocument();
  });

  it('should have aria attributes for meter', () => {
    render(<ScoreRing score={80} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '80');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
  });

  it('should have accessible label', () => {
    render(<ScoreRing score={90} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-label', 'Score: 90 out of 100');
  });

  it('should handle zero score', () => {
    render(<ScoreRing score={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should handle 100 score', () => {
    render(<ScoreRing score={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
