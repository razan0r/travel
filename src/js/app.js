export async function handleFormSubmit(event) {
    event.preventDefault();
    
    const url = document.getElementById('url').value;
    console.log('URL entered by user:', url);

    try {
        const response = await fetch('http://localhost:8081/api/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();
        console.log('Response from server:', data);

        if (response.ok) {
            // Display evaluation results
            document.getElementById('results').innerHTML = `
                <h2>Evaluation Results</h2>
                <p>Sentiment: ${data.sentiment}</p>
                <p>Credibility Score: ${data.credibilityScore}</p>
            `;
        } else {
            throw new Error(data.error || 'Failed to fetch evaluation results');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching evaluation results.');
    }
}
