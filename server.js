const http = require('http');
const routes = require('./routes');
require('dotenv').config()

const server = http.createServer(routes)
server.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`server is running on port ${process.env.PORT}`);
})

