function PedidoDao(connection) {
    this._connection = connection;
}

PedidoDao.prototype.salva = function (pedido, callback) {
    this._connection.query('INSERT INTO pedidos SET ?', pedido, callback);
}

PedidoDao.prototype.lista = function (callback) {
    this._connection.query('select * from pedidos ', callback);
}
