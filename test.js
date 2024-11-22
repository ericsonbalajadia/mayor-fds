const http = require('http');

const options = {
  host: 'localhost',
  port: 3306,
};

http.get(options, (res) => {
  console.log(`Server is running on localhost:3000 with status code: ${res.statusCode}`);
}).on('error', (e) => {
  console.log(`No server running on localhost:3000: ${e.message}`);
});
    