document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '$2a$10$st.acJGoKc4lbSYAhnaIoOnc3gFoQGbxuv2hIGRkde2bvDaXybFuC';
    const binId = '66c73f65e41b4d34e423bd43';
    const binUrl = `https://api.jsonbin.io/v3/b/${binId}/latest`;

    // Function to send test data to JSONBin
    function sendTestData() {
        fetch(binUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify({ test: "Test data" })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Test data sent:', data);
        })
        .catch(error => {
            console.error('Error sending test data:', error);
        });
    }

    // Function to fetch test data from JSONBin
    function fetchTestData() {
        fetch(binUrl, {
            method: 'GET',
            headers: {
                'X-Master-Key': apiKey
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched test data:', data.record);
        })
        .catch(error => {
            console.error('Error fetching test data:', error);
        });
    }

    // Test sending and fetching data
    sendTestData();
    fetchTestData();
});
