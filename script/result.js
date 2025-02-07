let currentPage = 1;
const limit = 10;

async function sendRequest(endpoint, method, page = 1) {
    event.preventDefault();
    const id = prompt("Enter ID if required (leave blank for none):");
    let url = id ? endpoint.replace(':id', id) : endpoint;
    if (method === 'GET') {
        const queryParams = new URLSearchParams({ page, limit }).toString();
        url += `?${queryParams}`;
    }
    let body = null;
    if (method === 'POST' || method === 'PUT') {
        const data = prompt("Enter JSON data for request body:");
        body = JSON.parse(data || "{}");
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("User is not authorized");
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error("User is not authorized");
        }

        const result = await response.json();

        document.getElementById('results').textContent = JSON.stringify(result.data || result, null, 2);

        if (result.totalPages) {
            showPagination(endpoint, method, result.totalPages);
        }
    } catch (error) {
        document.getElementById('results').textContent = `Error: ${error.message}`;
        console.error(error);
    }
}

function showPagination(endpoint, method, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = `
        <button onclick="changePage('${endpoint}', '${method}', -1)" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button onclick="changePage('${endpoint}', '${method}', 1)" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>
    `;
}

function changePage(endpoint, method, direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    sendRequest(endpoint, method, currentPage);
}