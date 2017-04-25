module.exports = function (app) {
    var fs = require('fs');

    app.get('/', function (req, res) {
        res.text('API root; nothing here.');
    });

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
                if (data.length == 2) {
                    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            var ress = data.replace(']', json + ']');
                            console.log('nova data :' + ress);
                            fs.writeFile(filePath, ress, 'utf8', function (err) { }); // write it back
                        }
                    });
                } else {
                    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
                        if (err) {
                            console.log(err);
                        } else {

                            var lasti = data.lastIndexOf(']');
                            var ress = data.substring(0, lasti) + ',' + json + ']';

                            //  = data.replace(']', ',' + json + ']');
                            console.log('nova data :' + ress);

                            fs.writeFile(filePath, ress, 'utf8', function (err) { }); // write it back
                        }
                    });
                }
            }
        });
    });




    app.get('/pedidos/id', function (req, res) {

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

                fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        var ress = JSON.parse(data);
                        res.json(Object.keys(data).length);
                    }
                });

            }
        });
    });

    app.get('/pedidos/lista/zera', function (req, res) {

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
                fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
                    if (err) {
                        console.log(err);
                    } else {

                        var lasti = data.lastIndexOf(']');
                        var ress = data.substring(0, lasti) + ',' + json + ']';

                        //  = data.replace(']', ',' + json + ']');
                        console.log('nova data :' + ress);

                        fs.writeFile(filePath, `[]`, 'utf8', function (err) { }); // write it back
                        res.json('');
                    }
                });

            }
        });
    });

}
