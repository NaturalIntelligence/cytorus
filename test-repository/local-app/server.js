const http = require('http');

const handler = (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("I'm fine");
    res.end();
};
const server = http.createServer(handler);
// server.listen( 3332, "localhost", () =>{
//     console.log("Local application started on port 3332");
// })
module.exports = server;