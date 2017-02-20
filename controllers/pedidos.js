module.exports = function (app) {
  var fs = require('fs');

  app.get('/pedidos/lista', function (req, res) {

    var path = require('path');

    var filePath = path.join(__dirname, 'pedidos.txt');

    fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
      if (!err) {
        res.json(data);
      } else {
        console.log(err);
      }
    });
  });
  app.post('/pedidos/adiciona', function (req, res) {

    var path = require('path');

    var filePath = path.join(__dirname, 'pedidos.txt');

    var pedido = req.body;
    console.log(pedido);
    var json = JSON.stringify(pedido);
    var obj = [];
    console.log(json);
    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("data " + data.length);
        if (data.length != 0) {
          fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
            if (err) {
              console.log(err);
            } else {
              obj.push(JSON.parse(data)); //now it an object
              console.log('obj lido' + obj);
              obj.push(pedido); //add some data
              console.log('obj lido + pedido' + obj);
              json = JSON.stringify(obj); //convert it back to json
               console.log('obj lido + pedido json' + json);
              fs.writeFile(filePath, json, 'utf8', function (err) { }); // write it back 
            }
          });
        } else {
          fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
            if (err) {
              console.log(err);
            } else {
              fs.writeFile(filePath, json, 'utf8', function (err) { }); // write it back 
            }
          });
        }
      }
    });
  });

}
