var rootFunc = function (req, res) {
    res.json({
        type:'index',
        message:'API root; nothing here.',
        data:{
            'pedido':[
                {
                    method:'GET',
                    description:'Retorna a lista de pedidos'
                },
                {
                    method:'POST',
                    description:'Insere um pedido'
                }
            ],
            'pedido/{pedido_id}':[
                {
                    method:'GET',
                    description:'Retorna um pedido'
                }
            ],
            'pedido/{pedido_id}/cotacao':[
                {
                    method:'GET',
                    description:'Retorna a lista de cotacões para um pedido'
                },
                {
                    method:'POST',
                    description:'Insere uma proposta para um pedido'
                }
            ],
            'pedido/{pedido_id}/cotacao/{cotacao_id}':[
                {
                    method:'GET',
                    description:'Retorna um cotacão para um pedido'
                }
            ],
            'pedido/{pedido_id}/cotacao/{cotacao_id}/islatest':[
                {
                    method:'GET',
                    description:'Retorna se a cotacão é a mais recente'
                }
            ],
        }
    });
}

module.exports = function (app) {
    var fs = require('fs');

    app.get('/', rootFunc);
    app.post('/', rootFunc);
    app.put('/', rootFunc);
    app.patch('/', rootFunc);
    app.delete('/', rootFunc);

    app.get('/pedido', function (req, res) {
        res.json(null);
    });
    app.post('/pedido', function (req, res) {
        res.json(null);
    });
    app.get('/pedido/:pedido_id', function (req, res) {
        res.json(null);
    });
    app.get('/pedido/:pedido_id/cotacao', function (req, res) {
        res.json(null);
    });
    app.post('/pedido/:pedido_id/cotacao', function (req, res) {
        res.json(null);
    });
    app.get('/pedido/:pedido_id/cotacao/:cotacao_id', function (req, res) {
        res.json(null);
    });
    app.get('/pedido/:pedido_id/cotacao/:cotacao_id/islatest', function (req, res) {
        res.json(null);
    });

}
