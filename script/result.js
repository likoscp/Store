async function sendRequest(endpoint, method) {
    const id = prompt("Enter ID if required (leave blank for none):");
    const url = id ? endpoint.replace(':id', id) : endpoint;

    let body = null;
    if (method === 'POST' || method === 'PUT') {
        const data = prompt("Enter JSON data for request body:");
        body = JSON.parse(data || "{}");
    }

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null,
        });

        const result = await response.json();
        document.getElementById('results').textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('results').textContent = `Error: ${error.message}`;
    }
}