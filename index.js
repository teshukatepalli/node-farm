const http = require("http");
const url = require("url");
const fs = require("fs");
const replaceTemplate = require("./dev-data/modules/replaceTemplate");

//server
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);
  console.log(query);
  console.log(pathname);
  //overview page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHTML = dataObj.map((el) => replaceTemplate(tempCard, el)).join();
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(output);

    //product page
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, { "Content-type": "text/html" });

    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //api
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>This page cannot be found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server has been started");
});
