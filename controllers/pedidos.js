var fs = require('fs');
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
            'estoque/{produto.id}':[
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
            'pedido/{pedido.id}':[
                {
                    method:'GET',
                    description:'Retorna um pedido'
                }
            ],
            'pedido/{pedido.id}/cotacao':[
                {
                    method:'GET',
                    description:'Retorna a lista de cotacões para um pedido'
                },
                {
                    method:'POST',
                    description:'Insere uma proposta para um pedido'
                }
            ],
            'pedido/{pedido.id}/cotacao/{cotacao.id}':[
                {
                    method:'GET',
                    description:'Retorna um cotacão para um pedido'
                }
            ],
            'pedido/{pedido.id}/cotacao/{cotacao.id}/islatest':[
                {
                    method:'GET',
                    description:'Retorna se a cotacão é a mais recente'
                }
            ],
        }
    });
}

if (!String.prototype.trim) { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

if (!Array.prototype.swap) {
    Array.prototype.swap = function(a,b){
        //don't attempt to swap if indexes invalid
        if(Math.min(a,b)<0 || Math.max(a,b)>=this.length)
        return this;
        //indexes are valid, then swap
        var tmp = this[a];
        this[a] = this[b];
        this[b] = tmp;
        return this;
    }
}

if (!Array.prototype.remove) {
    Array.prototype.remove = function(a){
        //don't attempt to swap if index is invalid
        if(a<0 || a>=this.length)
        return undefined;
        //index is valid, then remove
        return this.splice(a, 1)[0];
    }
}

if (!Array.prototype.contains) {
    Array.prototype.contains = function(a){
        var ret = false
        this.forEach(function(elem){
            if(elem===a)
            ret = true;
        });
        return ret;
    }
}

if (!String.prototype.escapeHtml) { // http://stackoverflow.com/a/6234804
    String.prototype.escapeHtml = function () {
        return this
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
}

function ensureArray(variable){
    if(
        variable !== null
        &&
        typeof(variable) === "object"
        &&
        (
            variable.constructor === Array
            ||
            (
                variable.prop
                &&
                variable.prop.constructor === Array
            )
        )
    )
    return variable;
    else
    return new Array();
}

function ensureNotUndefined(variable,replace){
    if(typeof(variable) === "undefined")
    return replace;
    else
    return variable;
}

function _loadDb(){
    var data = fs.readFileSync('./db.txt',{encoding:'utf8'});
    try{
        return JSON.parse(data);
    }catch(e){
        return {};
    }
}

var _db;

function loadDb(){
    if(typeof(_db)==='undefined'){
        _db = _loadDb();
    }
    return _db;
}

function saveDb(data){
    fs.writeFileSync('./db.txt', JSON.stringify(data), {encoding:'utf8'});
    _db = data;
}

function permissiveJsonParse(text,fail){
    try{
        return JSON.parse(text);
    }catch(e){
        return fail
    }
}

function getDictItem(obj, index, notFound){
    try{
        return ensureNotUndefined(obj[index], notFound);
    }catch(e){
        return notFound;
    }
}

function getArrayItem(array, index, notFound){
    var index = parseInt(index);
    if(!isNaN(index) && index>=0){
        return ensureNotUndefined(ensureArray(array)[index], notFound);
    }
    return notFound;
}

function indexArrayAutoincrement(array){
    array = ensureArray(array);
    var i;
    for(i = 0; typeof(array[i])!=='undefined'; i++){;}
    return i;
}

function getEstoqueList(){
    return ensureArray(loadDb().estoque);
}

function getPedidoList(){
    return ensureArray(loadDb().pedido);
}

function filterProduto(res){
    var prod = {};
    return prod;
}

function filterPedido(res){
    var ped = {};
    return ped;
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
        res.json(getEstoqueList());
    });
    app.post('/estoque', function (req, res) {
        var novo = filterProduto(res);
        if(novo){
            var list = getEstoqueList();
            var produto_id = indexArrayAutoincrement(list);
            novo.id = produto_id;
            list[produto_id] = novo;
            _db.estoque = list;
            saveDb(_db);
            res.json(produto_id);
        }else{
            res.json(false);
        }
    });
    app.get('/estoque/:produto_id', function (req, res) {
        res.json(getArrayItem(getEstoqueList(), req.params.produto_id, null));
    });
    app.post('/estoque/:produto_id', function (req, res) {
        var produto_id = parseInt(req.params.produto_id);
        if(!isNaN(produto_id) && produto_id>=0){
            var novo = filterProduto(res);
            var list = getEstoqueList();
            novo.id = produto_id;
            list[produto_id] = novo;
            _db.estoque = list;
            saveDb(_db);
            res.json(produto_id);
        }else{
            res.json(false);
        }
    });
    app.get('/pedido', function (req, res) {
        res.json(getPedidoList());
    });
    app.post('/pedido', function (req, res) {
        var novo = filterPedido(res);
        if(novo){
            var list = getPedidoList();
            var pedido_id = indexArrayAutoincrement(list);
            novo.id = pedido_id;
            list[pedido_id] = novo;
            _db.pedido = list;
            saveDb(_db);
            res.json(pedido_id);
        }else{
            res.json(false);
        }
    });
    app.get('/pedido/:pedido_id', function (req, res) {
        res.json(getArrayItem(getPedidoList(), req.params.pedido_id, null));
    });
    app.get('/pedido/:pedido_id/cotacao', function (req, res) {
        pedido = getArrayItem(getPedidoList(), req.params.pedido_id, null);
        if(pedido){
            res.json(ensureArray(pedido.cotacao));
        }else{
            res.json(null);
        }
    });
    app.post('/pedido/:pedido_id/cotacao', function (req, res) {
        pedido = getArrayItem(getPedidoList(), req.params.pedido_id, null);
        if(pedido){
            res.json(ensureArray(pedido.cotacao));
        }else{
            res.json(false);
        }
    });
    app.get('/pedido/:pedido_id/cotacao/:cotacao_id', function (req, res) {
        pedido = getArrayItem(getPedidoList(), req.params.pedido_id, null);
        if(pedido){
            cotacoes = ensureArray(pedido.cotacao);
            cotacao = getArrayItem(cotacoes, req.params.cotacao_id, null);
            res.json(cotacao);
        }else{
            res.json(null);
        }
    });
    app.get('/pedido/:pedido_id/cotacao/:cotacao_id/islatest', function (req, res) {
        pedido = getArrayItem(getPedidoList(), req.params.pedido_id, null);
        if(pedido){
            cotacoes = ensureArray(pedido.cotacao);
            var cotacaoMaisRecente = -1;
            for(cotacao of cotacoes){
                if(cotacao && cotacao.id > cotacaoMaisRecente){
                    cotacaoMaisRecente = cotacao.id;
                }
            }
            if(cotacaoMaisRecente>-1 && cotacaoMaisRecente===parseInt(req.params.cotacao_id)){
                res.json(true);
            }else{
                res.json(false);
            }
        }else{
            res.json(false);
        }
    });

}
