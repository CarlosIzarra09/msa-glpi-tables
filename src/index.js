import app from "./app";
import config from "./config";
const PORT = config.port;
const https = require("https");

app.listen(PORT,console.log(`Server started: http://localhost:${PORT}/`));
/*var server = https.createServer(https_options, app).listen(PORT, function () {
    console.log("Express server listening on port " + PORT);
});*/