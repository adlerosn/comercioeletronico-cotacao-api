var rootFunc = function (req, res) {
    res.json({
        type:'index',
        message:'API root; nothing here.',
        data:{
            'tela/{nome}':[
                {
                    method:'GET',
                    description:'Retorna uma tela: "cotar", "ofertar" ou "estoque"'
                }
            ],
            'estoque':[
                {
                    method:'GET',
                    description:'Retorna a lista de produtos em estoque'
                },
                {
                    method:'POST',
                    description:'Insere um produto no estoque'
                }
            ],
            'estoque/{produto_id}':[
                {
                    method:'GET',
                    description:'Retorna um produto do estoque'
                },
                {
                    method:'POST',
                    description:'Altera um produto do estoque'
                }
            ],
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

    app.get('/tela', function (req, res) {
        res.send(
            '<ul>'+
            '<li>'+'<a href="tela/cotar">Cotar</a>'+'</li>'+
            '<li>'+'<a href="tela/ofertar">Ofertar</a>'+'</li>'+
            '<li>'+'<a href="tela/estoque">Estoque</a>'+'</li>'+
            '</ul>'
        );
    });
    app.get('/tela/:nome', function (req, res) {
        switch(req.params.nome){
            case 'cotar':
            fs.readFile('./cotar.html', function(err, data){
                res.send(data);
            });
            break;
            case 'ofertar':
            fs.readFile('./ofertar.html', function(err, data){
                res.send(data);
            });
            break;
            case 'estoque':
            fs.readFile('./estoque.html', function(err, data){
                res.send(data);
            });
            break;
            default:
            res.send('');
        }
    });
    app.get('/estoque', function (req, res) {
        res.json(null);
    });
    app.post('/estoque', function (req, res) {
        res.json(null);
    });
    app.get('/estoque/:produto_id', function (req, res) {
        res.json(null);
    });
    app.post('/estoque/:produto_id', function (req, res) {
        res.json(null);
    });
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
