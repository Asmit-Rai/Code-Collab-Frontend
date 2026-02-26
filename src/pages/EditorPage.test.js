import React from 'react';
import { render } from '@testing-library/react';
import EditorPage from './EditorPage';
import { BrowserRouter } from 'react-router-dom';
import * as socketModule from '../socket';

// Mocks
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: { username: 'testuser' },
  }),
  useParams: () => ({
    roomId: 'test-room',
  }),
  useNavigate: () => jest.fn(),
}));

// Mock Editor component
jest.mock('../components/Editor', () => () => <div data-testid="editor-mock">Editor Mock</div>);

// Mock Compiler component
jest.mock('../components/Compiler', () => () => <div data-testid="compiler-mock">Compiler Mock</div>);

// Mock Client component
jest.mock('../components/Client', () => ({ username }) => <div data-testid="client-mock">{username}</div>);

test('renders EditorPage without crashing', () => {
  // Spy on initSocket
  jest.spyOn(socketModule, 'initSocket').mockResolvedValue({
    on: jest.fn(),
    emit: jest.fn(),
    off: jest.fn(),
  });

  render(
    <BrowserRouter>
      <EditorPage />
    </BrowserRouter>
  );
});
