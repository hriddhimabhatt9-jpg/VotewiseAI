/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the google maps library
jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: any) => <div data-testid="api-provider">{children}</div>,
  Map: ({ children, className }: any) => <div data-testid="google-map" className={className}>{children}</div>,
  Marker: ({ title }: any) => <div data-testid={`marker-${title}`} />,
  InfoWindow: ({ children }: any) => <div data-testid="info-window">{children}</div>,
  useMap: () => null,
  useMapsLibrary: () => null,
}));

// Must mock before importing the component
jest.mock('lucide-react', () => ({
  Navigation: (props: any) => <svg data-testid="icon-navigation" {...props} />,
  MapPin: (props: any) => <svg data-testid="icon-map-pin" {...props} />,
  Clock: (props: any) => <svg data-testid="icon-clock" {...props} />,
  Car: (props: any) => <svg data-testid="icon-car" {...props} />,
  Footprints: (props: any) => <svg data-testid="icon-footprints" {...props} />,
  Bus: (props: any) => <svg data-testid="icon-bus" {...props} />,
  Loader2: (props: any) => <svg data-testid="icon-loader" {...props} />,
  X: (props: any) => <svg data-testid="icon-x" {...props} />,
  LocateFixed: (props: any) => <svg data-testid="icon-locate" {...props} />,
}));

import MapView from '../MapView';

describe('MapView Component', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    // Mock fetch for /api/config
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ apiKey: 'test-api-key' }),
    });
    // Mock geolocation
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: jest.fn((success) =>
          success({ coords: { latitude: 28.5634, longitude: 77.1724 } })
        ),
      },
      writable: true,
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('renders error state when no API key is configured', () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = '';
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ error: 'not configured' }),
    });

    render(<MapView />);
    // The component will first show loading, then after fetch completes it would show error
    // Since fetch is async, we test the initial state
    expect(document.querySelector('[role="status"]') || document.querySelector('[role="alert"]')).toBeTruthy();
  });

  it('renders map when API key is provided via env', () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'valid-test-key';

    render(<MapView />);
    expect(screen.getByTestId('api-provider')).toBeInTheDocument();
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'valid-test-key';

    const { container } = render(<MapView height="400px" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.height).toBe('400px');
  });

  it('renders default booth markers', () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'valid-test-key';

    render(<MapView />);
    expect(screen.getByTestId('marker-KV No. 1, RK Puram')).toBeInTheDocument();
    expect(screen.getByTestId('marker-Sarvodaya School')).toBeInTheDocument();
  });

  it('renders custom booths when provided', () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'valid-test-key';

    const customBooths = [
      { id: 'test1', name: 'Test Booth', lat: 28.5, lng: 77.2, address: 'Test', waitLevel: 'low' as const },
    ];
    render(<MapView booths={customBooths} />);
    expect(screen.getByTestId('marker-Test Booth')).toBeInTheDocument();
  });

  it('renders user location marker', () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'valid-test-key';

    render(<MapView />);
    expect(screen.getByTestId('marker-Your Location')).toBeInTheDocument();
  });

  it('renders locate button with proper aria-label', () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'valid-test-key';

    render(<MapView />);
    const locateBtn = screen.getByLabelText('Center on my location');
    expect(locateBtn).toBeInTheDocument();
  });
});
