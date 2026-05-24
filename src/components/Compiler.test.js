import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Compiler from './Compiler';

describe('Compiler Component', () => {
    beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, 'setItem');
        jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(null);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('handleLanguageChange updates state and localStorage', () => {
        const { getByLabelText } = render(<Compiler code="" copiedCode="" />);
        const select = getByLabelText('Language:');

        // Initial value should be "2" as per the code:
        // const [languageId, setLanguageId] = useState(localStorage.getItem("language_Id") || 2);
        // Note: the component uses 2 as a number in state, but HTML value will be "2" string.
        // Wait, the options in JSX are: 54, 50, 62, 71.
        // Let's check the default value in Compiler.js again.
        // const [languageId, setLanguageId] = useState(localStorage.getItem("language_Id") || 2);
        // If 2 is not in the options, the browser might default to the first one or none.

        fireEvent.change(select, { target: { value: '71' } });

        expect(select.value).toBe('71');
        expect(window.localStorage.setItem).toHaveBeenCalledWith('language_Id', '71');
    });
});
