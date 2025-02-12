var http = require("http");
var url = require("url");
var fs = require("fs");

var server = http.createServer((req, res) => {
  var parsedUrl = url.parse(req.url, true); // Parse the URL and query parameters
  var pathname = parsedUrl.pathname; // Extract the pathname
  var query = parsedUrl.query; // Extract the query parameters

  // Handle the /automobiles route for POST requests
  if (pathname === "/automobiles" && req.method === "POST") {
    // Check if the `cat` query parameter exists
    if (query.cat) {
      fs.readFile("automobiles.json", "utf-8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              msg: err.message,
            })
          );
        } else {
          // Parse the JSON data from the file
          var automobiles = JSON.parse(data).automobiles;
          var filteredData;

          // Filter data based on the `cat` query parameter
          if (query.cat === "t") {
            filteredData = automobiles.filter((val) => val.make === "Toyota");
          } else if (query.cat === "h") {
            filteredData = automobiles.filter((val) => val.make === "Honda");
          } else {
            // If the `cat` parameter is invalid, return all data
            filteredData = automobiles;
          }

          // Send the filtered data as the response
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              data: filteredData,
            })
          );
        }
      });
    } else {
      // If the `cat` query parameter is missing, return an error
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          msg: "Missing `cat` query parameter",
        })
      );
    }
  }

  // Handle route parameters (e.g., /automobiles/:id)
  else if (pathname.startsWith("/automobiles/") && req.method === "GET") {
    var id = pathname.split("/")[2]; // Extract the ID from the route
    fs.readFile("automobiles.json", "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            msg: err.message,
          })
        );
      } else {
        var automobiles = JSON.parse(data).automobiles;
        var automobile = automobiles.find((val) => val.id === parseInt(id)); // Find the automobile by ID

        if (automobile) {
          // If the automobile is found, return it
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              data: automobile,
            })
          );
        } else {
          // If the automobile is not found, return a 404 error
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              msg: "Automobile not found",
            })
          );
        }
      }
    });
  }

  // Handle invalid routes
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        msg: "Route not found",
      })
    );
  }
});

// Start the server
server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
