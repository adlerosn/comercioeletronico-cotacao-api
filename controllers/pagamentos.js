module.exports = function (app) {
  app.get('/pedidos/lista', function (req, res) {
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');
  });
  app.post('/pedidos/adiciona', function (req, res) {
    var pagamento = req.body;
    res.send('OK.')
  });

}
