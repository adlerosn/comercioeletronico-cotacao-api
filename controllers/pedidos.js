module.exports = function (app) {
  app.get('/pedidos/lista', function (req, res) {
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');
  });
  app.post('/pedidos/adiciona', function (req, res) {
    var pedido = req.body;

    var connection = app.persistencia.connectionFactory();
    var pedidoDao = new app.persistencia.pedidosDao();
    pedidoDao.salva(pedido, function (erro, resultado) {
      console.log('pagamentocriado');
    });


  });

}
