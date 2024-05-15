const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");

const httpPort = 80;
const httpsPort = 443;

const key = fs.readFileSync("./certs/localhost.key");
const cert = fs.readFileSync("./certs/localhost.crt");

const app = express();
const server = https.createServer({key: key, cert: cert}, app);

app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect("https://" + req.headers.host + req.url);
  }

  next();
});

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.static("../public/static"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/login/success", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/login-success.html"));
})

app.get("/login/failed", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/login-failed.html"));
})


app.listen(httpPort, () => {
  console.log(`App listening on port ${httpPort}`);
});

server.listen(httpsPort, () => {
  console.log(`App listening on port ${httpsPort}`);
});
