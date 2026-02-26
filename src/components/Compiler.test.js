import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Compiler from './Compiler';

// Mock fetch
global.fetch = jest.fn();

describe('Compiler Component', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, REACT_APP_RAPIDAPI_KEY: 'test-key', REACT_APP_RAPIDAPI_HOST: 'test-host' };
    fetch.mockClear();
    // Mock successful response to avoid loops or errors in the component
    fetch.mockResolvedValue({
      json: async () => ({
        token: 'mock-token',
        status: { description: 'Accepted' },
        stdout: 'SGVsbG8gV29ybGQ=', // "Hello World" in base64
        time: '0.1',
        memory: '1024'
      }),
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('submits code with correct environment variable headers', async () => {
    render(<Compiler copiedCode="" code="" />);

    const runButton = screen.getByText(/Run Code/i);
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('judge0-ce.p.rapidapi.com/submissions'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-rapidapi-host': 'test-host',
            'x-rapidapi-key': 'test-key',
          }),
        })
      );
    });
  });
});
