module.exports = function (app) {
  app.get('/pedidos/lista', function (req, res) {
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');
  });
  app.post('/pedidos/adiciona', function (req, res) {
    res.send('OK.');
    var pedido = req.body;
     console.log('pedido recebido');
    var connection = app.persistencia.connectionFactory();
    var pedidoDao = new app.persistencia.pedidosDao(connection);
    pedidoDao.salva(pedido, function (erro, resultado) {
      console.log('pagamentocriado');
    });
  });

}
