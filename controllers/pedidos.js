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
    try{
        var data = fs.readFileSync('./db.txt',{encoding:'utf8'});
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
    if(typeof(text)==='object'){
        return text;
    }
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

/*
* item : object{
*   codigo    : string : codigo do produto
*   descricao : string : descricao do produto
*   nome      : string : nome curto
*   qtdunt    : string : quantidade unitária [ex: caixa de 5 kg]
*   qtdest    : float  : quantidade em estoque
* }
*/
function filterProduto(req){
    var prod_i = req;
    var prod_o = {};
    prod_o.codigo = String(ensureNotUndefined(prod_i.codigo,""));
    prod_o.descricao = String(ensureNotUndefined(prod_i.descricao,""));
    prod_o.nome = String(ensureNotUndefined(prod_i.nome,""));
    prod_o.qtdunt = String(ensureNotUndefined(prod_i.qtdunt,""));
    prod_o.qtdest = parseFloat(ensureNotUndefined(prod_i.qtdest,NaN));
    if(isNaN(prod_o.qtdest)){
        prod_o.qtdest = 0.0;
    }
    if(
        prod_o.codigo.length==0
        ||
        prod_o.descricao.length==0
        ||
        prod_o.nome.length==0
        ||
        prod_o.qtdunt.length==0
        ||
        prod_o.qtdest <= 0
    ){
        return null;
    }
    return prod_o;
}

/*
* item : object{
*   codigo    : string : codigo do produto
*   descricao : string : descricao do produto
*   nome      : string : nome curto
*   qtdunt    : string : quantidade unitária [ex: caixa de 5 kg]
*   qtdund    : float  : quantidade de unidades
* }
*/
function filterPedidoItem(req){
    var itm_i = req;
    var itm_o = {};
    itm_o.codigo = String(ensureNotUndefined(itm_i.codigo,""));
    itm_o.descricao = String(ensureNotUndefined(itm_i.descricao,""));
    itm_o.nome = String(ensureNotUndefined(itm_i.nome,""));
    itm_o.qtdunt = String(ensureNotUndefined(itm_i.qtdunt,""));
    itm_o.qtdund = parseFloat(ensureNotUndefined(itm_i.qtdund,NaN));
    if(isNaN(itm_o.qtdund)){
        itm_o.qtdund = 0.0;
    }
    if(
        itm_o.codigo.length==0
        ||
        itm_o.descricao.length==0
        ||
        itm_o.nome.length==0
        ||
        itm_o.qtdunt.length==0
        ||
        itm_o.qtdund <= 0
    ){
        return null;
    }
    return itm_o;
}

/*
* pedido : object{
*   cliente : string : nome do cliente
*   data    : int    : timestamp de inserção
*   itens   : item[] : item do pedido
* }
*/
function filterPedido(req){
    var ped_i = req;
    var ped_o = {};
    ped_o.cliente = String(ensureNotUndefined(ped_i.cliente,""));
    ped_o.data = parseInt(ensureNotUndefined(ped_i.data,NaN));
    if(isNaN(ped_o.data)){
        ped_o.data = parseInt((new Date()).getTime()/1000);
    }
    ped_o.itens = new Array();
    for(var item of ensureArray(ped_i.itens)){
        var itemFiltered = filterPedidoItem(item);
        if(itemFiltered){
            ped_o.itens.push(itemFiltered)
        }
    }
    if(ped_o.cliente.length==0 || ped_o.itens.length==0){
        return null;
    }
    return ped_o;
}

/*
* item : object{
*   codigo    : string : codigo do produto
*   descricao : string : descricao
*   marca     : string : marca/modelo
*   nome      : string : nome curto
*   qtdunt    : string : quantidade unitária [ex: caixa de 5 kg]
*   qtdund    : float  : quantidade de unidades
*   valunt    : float  : valor unitário
*   valtt     : float  : valor total do item
* }
*/
function filterCotacaoItem(req){
    var itm_i = req;
    var itm_o = {};
    itm_o.codigo = String(ensureNotUndefined(itm_i.codigo,""));
    itm_o.descricao = String(ensureNotUndefined(itm_i.descricao,""));
    itm_o.nome = String(ensureNotUndefined(itm_i.nome,""));
    itm_o.qtdunt = String(ensureNotUndefined(itm_i.qtdunt,""));
    itm_o.qtdund = parseFloat(ensureNotUndefined(itm_i.qtdund,NaN));
    itm_o.valunt = parseFloat(ensureNotUndefined(itm_i.valunt,NaN));
    itm_o.valtt = parseFloat(ensureNotUndefined(itm_i.valtt,NaN));
    if(isNaN(itm_o.qtdund)){
        itm_o.qtdund = 0.0;
    }
    if(isNaN(itm_o.valunt)){
        itm_o.valunt = 0.0;
    }
    if(isNaN(itm_o.valtt)){
        itm_o.valtt = 0.0;
    }
    if(
        itm_o.codigo.length==0
        ||
        itm_o.descricao.length==0
        ||
        itm_o.nome.length==0
        ||
        itm_o.qtdunt.length==0
        ||
        itm_o.qtdund <= 0
        ||
        itm_o.valunt <= 0
        ||
        itm_o.valtt <= 0
    ){
        return null;
    }
    return itm_o;
}

/*
* cotacao : object{
*   nome     : string    : Nome do fornecedor
*   vendedor : string    : Vendedor
*   telefone : string    : Telefone de contado do vendedor
*   email    : string    : Email do vendedor
*   data     : int       : Data da cotação
*   valtt    : float     : Valor total do pedido
*   fpag1    : string    : Forma de pagamento 1
*   fpag2    : string    : Forma de pagamento 2
*   validade : int       : Validade da proposta
*   itensped : itemped[] : Itens do pedido
* }
*/
function filterCotacao(req){
    var cot_i = req;
    var cot_o = {};
    cot_o.nome = String(ensureNotUndefined(cot_i.nome,""));
    cot_o.vendedor = String(ensureNotUndefined(cot_i.vendedor,""));
    cot_o.telefone = String(ensureNotUndefined(cot_i.telefone,""));
    cot_o.email = String(ensureNotUndefined(cot_i.email,""));
    cot_o.fpag1 = String(ensureNotUndefined(cot_i.fpag1,""));
    cot_o.fpag2 = String(ensureNotUndefined(cot_i.fpag2,""));
    cot_o.data = parseInt(ensureNotUndefined(cot_i.data,NaN));
    if(isNaN(cot_o.data)){
        cot_o.data = parseInt((new Date()).getTime()/1000);
    }
    cot_o.valtt = parseFloat(ensureNotUndefined(cot_i.valtt,NaN));
    if(isNaN(cot_o.valtt)){
        cot_o.valtt = 0.0;
    }
    cot_o.validade = parseInt(ensureNotUndefined(cot_i.validade,NaN));
    if(isNaN(cot_o.validade)){
        cot_o.validade = parseInt((new Date()).getTime()/1000);
    }
    cot_o.itensped = new Array();
    for(var item of ensureArray(cot_i.itensped)){
        var itemFiltered = filterCotacaoItem(item);
        if(itemFiltered){
            cot_o.itens.push(itemFiltered)
        }
    }
    if(
        cot_o.nome.length==0
        ||
        cot_o.vendedor.length==0
        ||
        cot_o.telefone.length==0
        ||
        cot_o.email.length==0
        ||
        cot_o.fpag1.length==0
        ||
        cot_o.fpag2.length==0
        ||
        cot_o.itensped.length==0
        ||
        cot_o.data > cot_o.validade
    ){
        return null;
    }
    return cot_o;
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
            res.set('content-type','text/html');
            res.send(fs.readFileSync('./cotar.html'));
            break;
            case 'ofertar':
            res.set('content-type','text/html');
            res.send(fs.readFileSync('./ofertar.html'));
            break;
            case 'estoque':
            res.set('content-type','text/html');
            res.send(fs.readFileSync('./estoque.html'));
            break;
            case 'jquery':
            res.set('content-type','application/javascript');
            res.send(fs.readFileSync('./jquery-3.2.1.min.js'));
            default:
            res.send('');
        }
    });
    app.get('/estoque', function (req, res) {
        res.json(getEstoqueList());
    });
    app.post('/estoque', function (req, res) {
        var novo = filterProduto(permissiveJsonParse(req.body,{}));
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
            var novo = filterProduto(permissiveJsonParse(req.body,{}));
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
    app.post('/busca', function (req, res) {
        var termo = ensureNotUndefined(permissiveJsonParse(req.body,""),"");
        var resultado = new Array();
        var list = getEstoqueList();
        for(var item of list){
            if(item.indexOf(termo) !== -1){
                resultado.push(item);
            }
        }
        res.json(resultado);
    });
    app.get('/pedido', function (req, res) {
        res.json(getPedidoList());
    });
    app.post('/pedido', function (req, res) {
        var novo = filterPedido(permissiveJsonParse(req.body,{}));
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
        var pedido = getArrayItem(getPedidoList(), req.params.pedido_id, null);
        if(pedido){
            res.json(ensureArray(pedido.cotacao));
        }else{
            res.json(null);
        }
    });
    app.post('/pedido/:pedido_id/cotacao', function (req, res) {
        var novo = filterCotacao(permissiveJsonParse(req.body,{}));
        var pedido = getArrayItem(getPedidoList(), req.params.pedido_id, null);
        if(pedido){
            var cotacoes = ensureArray(pedido.cotacao);
            var cotacao_id = indexArrayAutoincrement(cotacoes);
            novo.id = cotacao_id;
            cotacoes[cotacao_id] = novo;
            _db.pedido[pedido.id].cotacao = cotacoes;
            saveDb(_db);
            res.json(cotacao_id);
        }else{
            res.json(false);
        }
    });
    app.get('/pedido/:pedido_id/cotacao/:cotacao_id', function (req, res) {
        var pedido = getArrayItem(getPedidoList(), req.params.pedido_id, null);
        if(pedido){
            var cotacoes = ensureArray(pedido.cotacao);
            var cotacao = getArrayItem(cotacoes, req.params.cotacao_id, null);
            res.json(cotacao);
        }else{
            res.json(null);
        }
    });
    app.get('/pedido/:pedido_id/cotacao/:cotacao_id/islatest', function (req, res) {
        var pedido = getArrayItem(getPedidoList(), req.params.pedido_id, null);
        if(pedido){
            var cotacoes = ensureArray(pedido.cotacao);
            var cotacaoMaisRecente = -1;
            for(cotacao of cotacoes){
                if(cotacao && cotacao.id > cotacaoMaisRecente){
                    cotacaoMaisRecente = cotacao.id;
                }
            }
            res.json(cotacaoMaisRecente>-1 && cotacaoMaisRecente===parseInt(req.params.cotacao_id));
        }else{
            res.json(false);
        }
    });

}
