comercioeletronico-cotacao-api
==============================

Deploy: [https://comercioeletronico-cotacao-api.herokuapp.com/](https://comercioeletronico-cotacao-api.herokuapp.com/)

Telas: [https://comercioeletronico-cotacao-api.herokuapp.com/tela](https://comercioeletronico-cotacao-api.herokuapp.com/tela)

Código back-end relevante: [pedidos.js](https://raw.githubusercontent.com/adlerosn/comercioeletronico-cotacao-api/master/controllers/pedidos.js)

---

## Tecnologias

Um código de [péssima qualidade](http://www.gohorseprocess.com.br/extreme-go-horse-(xgh)) foi escrito usando:

### Back-end

#### API RESTful

* NodeJS
* Express

### Front-end

* HTML
* jQuery
* JavaScript
* CSS (muito pouco)

---

### Especificação:

O trabalho deve agora melhorara a comunicação entre cliente e fornecedor aproximando esta da realidade.

O objetivo desse trabalho é permitir o suporte a todas as etapas de uma transação de pedido de compra até a confirmação do pedido.

Para tanto pode-se usar o trabalho anterior e melhora-lo. conforme se segue.

O prazo dessa tarefa é até 26/04.

O pedido deve ter os campos:

* Numero do pedido Cliente
* data
* Itens do pedido.

O campo itens do pedido é uma lista de itens.

Cada Item possuirá os seguintes campos:

* código do produto,
* descrição,
* nome curto,
* quantidade unitária,
* quantidade de unidades

Para compor a base de produtos o serviço fornecedor deverá ter um cadastro de produtos.

Um produto Produto terá os seguintes campos:

* código do produto,
* descrição,
* nome curto,
* quantidade unitária (ex. caixa de 5 kg, caixa de 2 m², pacote com 10 unidades)
* quantidade em estoque

O retorno do pedido de cotação deverá ser uma Cotação de acordo com o pedido feito.

A cotação então retorna uma estrutura composta dos pelos dados do pedido

Retorno (Cotação).

Terá a seguinte estrutura:

* Nome do fornecedor
* Vendedor
* Telefone de contado do vendedor
* Email do vendedor
* Numero da cotação
* Data da cotação
* Valor total do pedido
* Forma de pagamento 1
* Forma de pagamento 2
* Validade da proposta
* Numero do pedido Cliente
* Data do pedido
* Itens do pedido.

O campo itens do pedido é uma lista de itens.

Cada Item possuirá os seguintes campos:

* código do produto,
* descrição,
* marca/modelo
* nome curto,
* quantidade unitária,
* quantidade de unidades
* valor unitário
* valor total do item

O cliente deve realizar o pedido nos fornecedores que possuem os itens que ele deseja. Como pode ser percebido, Para a realização de um pedido, o cliente deve conhecer os itens e códigos de itens informados pelo fornecedor.

Sendo assim, é necessário uma etapa anterior ao envio de pedido para o fornecedor. Nesta etapa o cliente faz uma prospecção dos produtos que deseja. A prospecção vais ser feita por um envio de uma requisição de consulta de produtos.

Uma consulta de produtos possui o seguintes campos

* Nome do cliente
* Data
* Produtos

Produtos é uma lista de itens onde cada item é formado pelos seguintes campos:

* N. item
* Descrição do produto
* Quantidade desejada

O retorno da consulta de produtos é uma lista de produtos para os itens.

Cada item da consulta pode ser atendido ser atendido por vário produtos. Assim teremos na resposta:

* Numero item consultado
* código do produto,
* descrição,
* marca/modelo
* nome curto,
* quantidade unitária,
* quantidade de unidades
* valor unitário
* valor total do item

Veja que podemos ter mais de um produto para cada item consultado.

A partir desse retorno o cliente poderá fazer os pedidos.

Note que o cliente não precisa fazer sempre a consulta se ele armazenar os dados da primeira consulta. Entretanto ele deve se preocupar com atualizações dessa lista.
