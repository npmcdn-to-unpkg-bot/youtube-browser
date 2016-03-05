var express = require('express');
var app = express();
var morgan = require('morgan');

app.disable('x-powered-by');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.set('port', 8888);
//app.listen();
//console.log("App listening on port 8888");
//app.listen(8888);
//console.log("App listening on port 8080");

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
