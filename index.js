const express = require('express'),
     http = require('http'),
     morgan = require('morgan'),
     bodyParser = require('body-parser'),
     upload = require('express-fileupload');

const hostname = 'localhost';
const port = 3000;

const app = express();
//morgan is used for logging!
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(upload()); // configure middleware to use upload
app.use(express.static(__dirname + '/public'));

app.post('/upload',function(req,res){
  console.log(req.files);
  if(req.files.uploadedFile) {
    var file = req.files.uploadedFile,
        filename = file.name,
        fileSize = file.size,
        fileType = file.mimetype;

    var pathToUpload = __dirname + '/saves/' + filename;

    file.mv(pathToUpload, function(err) {
      if(err) {
        console.log("File Upload Failed",filename,err);
        res.send("Error - While Moving");
      } else {
        console.log("File Uploaded",filename);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        
        const output = {
          'filename': filename,
          'size': fileSize,
          'mimeType': fileType
        }
       // var output = '<h3>Success</h3><b>Name: </b>' + filename + '<br/><b>FileSize </b>' + fileSize;
        res.send(JSON.stringify(output, null, 2));
      }
    })
  } else {
    res.send("Please select file");
    res.end();
  }
})

//this will then act as a default if static is not present
app.use((req, res, next) => {
  //console.log(req.headers);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});