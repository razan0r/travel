import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { handleFormSubmit } from '../src/js/app.js'; 

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        sentiment: 'Positive',
        credibilityScore: 85
      })
  })
);

describe('Form Submit Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="form">
        <input id="url" type="text" value="http://example.com" />
        <button type="submit">Submit</button>
      </form>
      <div id="results"></div>
    `;
    const form = document.getElementById('form');
    form.addEventListener('submit', handleFormSubmit);
  });

  it('should display evaluation results on successful fetch', async () => {
    fireEvent.submit(document.getElementById('form'));

    await waitFor(() => {
      expect(screen.getByText('Sentiment: Positive')).toBeInTheDocument();
      expect(screen.getByText('Credibility Score: 85')).toBeInTheDocument();
    });
  });

  it('should display an error message on fetch failure', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );
    
    window.alert = jest.fn(); // Mock alert

    fireEvent.submit(document.getElementById('form'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('An error occurred while fetching evaluation results.');
    });
  });
});
