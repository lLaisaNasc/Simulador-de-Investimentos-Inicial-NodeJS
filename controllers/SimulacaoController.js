const Simulacao = require('../models/Simulacao')

//funções de calculo do investimento
function valor_tesouro(valor_inicial, valor_mensal, tempo_investimento) {

    const taxaSelicAnual = 0.1325

    const taxaSelicMensal = Math.pow(1 + taxaSelicAnual, 1 / 12) - 1;
    let saldo_tesouro = valor_inicial;

    for (let i = 0; i < tempo_investimento; i++) {
        saldo_tesouro += valor_mensal;
        saldo_tesouro *= (1 + taxaSelicMensal);
    }

    return saldo_tesouro;
}

function valor_poupanca(valor_inicial, valor_mensal, tempo_investimento) {
    const taxaPoupancaAnual = 0.05;

    const taxaPoupancaMensal = Math.pow(1 + taxaPoupancaAnual, 1 / 12) - 1;
    let saldo_poupanca = valor_inicial;

    for (let i = 0; i < tempo_investimento; i++) {
        saldo_poupanca += valor_mensal;
        saldo_poupanca *= (1 + taxaPoupancaMensal);
    }

    return saldo_poupanca;
}

function valor_cdb(valor_inicial, investimento_mensal, tempo_investimento) {
    const taxa_juros_anual_cdb = 0.1357;
    const taxa_juros_mensal_cdb = Math.pow(1 + taxa_juros_anual_cdb, 1 / 12) - 1;
    let valor_final_cdb = valor_inicial;

    for (let i = 0; i < tempo_investimento; i++) {
        valor_final_cdb += investimento_mensal;
        valor_final_cdb *= (1 + taxa_juros_mensal_cdb);
    }

    return valor_final_cdb;
}


function valor_lci_lca(valor_inicial, investimento_mensal, tempo_investimento) {
    const taxa_juros_anual_lci_lca = 0.096;
    const taxa_juros_mensal_lci_lca = Math.pow(1 + taxa_juros_anual_lci_lca, 1 / 12) - 1;
    let valor_final_lci_lca = valor_inicial;

    for (let i = 0; i < tempo_investimento; i++) {
        valor_final_lci_lca += investimento_mensal;
        valor_final_lci_lca *= (1 + taxa_juros_mensal_lci_lca);
    }

    return valor_final_lci_lca;
}

function valor_total_investimento(valor_inicial, valor_investimento_mensal, tempo_investimento) {
    valor_final = valor_investimento_mensal * tempo_investimento
    valor_total_investido = valor_inicial + valor_final

    return valor_total_investido
}


module.exports = class SimulacaoController {

    static paginaInicial(req, res) {
        res.render('templates/home')
    }

    // -- Método criação --
    static criarSimulacao(req, res) {
        res.render('templates/adicionar')
    }

    // -- Método para add no banco de dados -- 

    static async criarSimulacaoPost(req, res) {

        const aux_valor_investimento_inicial = parseFloat(req.body.valor_investimento_inicial);
        const aux_valor_investimento_mensal = parseFloat(req.body.valor_investimento_mensal);
        const aux_tempo = parseInt(req.body.tempo_de_investimento_meses, 10);

        const aux_valor_total = valor_total_investimento(aux_valor_investimento_inicial, aux_valor_investimento_mensal, aux_tempo)
        const aux_tesouro = valor_tesouro(aux_valor_investimento_inicial, aux_valor_investimento_mensal, aux_tempo)
        const aux_poupanca = valor_poupanca(aux_valor_investimento_inicial, aux_valor_investimento_mensal, aux_tempo)
        const aux_cdb = valor_cdb(aux_valor_investimento_inicial, aux_valor_investimento_mensal, aux_tempo)
        const aux_lci_lca = valor_lci_lca(aux_valor_investimento_inicial, aux_valor_investimento_mensal, aux_tempo)

        const simulacao = {
            titulo: req.body.titulo,
            objetivo: req.body.objetivo,
            valor_investimento_inicial: aux_valor_investimento_inicial,
            valor_investimento_mensal: aux_valor_investimento_mensal,
            tempo_de_investimento_meses: aux_tempo,
            valor_total_investido: aux_valor_total,
            rentabilidade_tesouro: aux_tesouro,
            rentabilidade_poupanca: aux_poupanca,
            rentabilidade_cdb: aux_cdb,
            rentabilidade_lci_lca: aux_lci_lca
        };

        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        await Simulacao.create(simulacao)
            .then(() => {
                simulacao.valor_total_investido = formatter.format(simulacao.valor_total_investido);
                simulacao.rentabilidade_tesouro = formatter.format(simulacao.rentabilidade_tesouro);
                simulacao.rentabilidade_poupanca = formatter.format(simulacao.rentabilidade_poupanca);
                simulacao.rentabilidade_cdb = formatter.format(simulacao.rentabilidade_cdb);
                simulacao.rentabilidade_lci_lca = formatter.format(simulacao.rentabilidade_lci_lca);

                res.render('templates/investimentos', { simulacao: simulacao, layout: false });
                console.log(simulacao)
            })
            .catch((err) => console.log('Erro ao cadastrar Simulação', err));
    }

    static mostrarSimulacoes(req, res) {
        Simulacao.findAll({ raw: true })
            .then((data) => {
                let nenhumaSimulacao = false
                if (data.length === 0) {
                    nenhumaSimulacao = true
                }
                res.render('templates/todas', { simulacao: data, nenhumaSimulacao })
            }).catch((err) => console.log(err))
    }

    //Método para apresentar o formulário de alteração da simulacao
    static async atualizarSimulacao(req, res) {
        const vid = req.params.id;

        Simulacao.findOne({ where : {id : vid}, raw : true})
        .then((data) => {
            res.render('templates/editar', {simulacao : data})
        })
        .catch((err) => console.log(err))
    }

    // Método para processar a atualização da simulação
    static async atualizarSimulacaoPost(req, res) {
        const vid = req.body.id;

        try {
            const aux_valor_investimento_inicial = parseFloat(req.body.valor_investimento_inicial);
            const aux_valor_investimento_mensal = parseFloat(req.body.valor_investimento_mensal);
            const aux_tempo = parseInt(req.body.tempo_de_investimento_meses, 10);

            const aux_valor_total = valor_total_investimento(aux_valor_investimento_inicial, aux_valor_investimento_mensal, aux_tempo);
            const aux_tesouro = valor_tesouro(aux_valor_investimento_inicial, aux_valor_investimento_mensal, aux_tempo);
            const aux_poupanca = valor_poupanca(aux_valor_investimento_inicial, aux_valor_investimento_mensal, aux_tempo);
            const aux_cdb = valor_cdb(aux_valor_investimento_inicial, aux_valor_investimento_mensal, aux_tempo);
            const aux_lci_lca = valor_lci_lca(aux_valor_investimento_inicial, aux_valor_investimento_mensal, aux_tempo);

            const simulacao = {
                titulo: req.body.titulo,
                objetivo: req.body.objetivo,
                valor_investimento_inicial: aux_valor_investimento_inicial,
                valor_investimento_mensal: aux_valor_investimento_mensal,
                tempo_de_investimento_meses: aux_tempo,
                valor_total_investido: aux_valor_total,
                rentabilidade_tesouro: aux_tesouro,
                rentabilidade_poupanca: aux_poupanca,
                rentabilidade_cdb: aux_cdb,
                rentabilidade_lci_lca: aux_lci_lca
            };

            await Simulacao.update(simulacao, { where: { id: vid } });

            const formatter = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

            simulacao.valor_total_investido = formatter.format(simulacao.valor_total_investido);
            simulacao.rentabilidade_tesouro = formatter.format(simulacao.rentabilidade_tesouro);
            simulacao.rentabilidade_poupanca = formatter.format(simulacao.rentabilidade_poupanca);
            simulacao.rentabilidade_cdb = formatter.format(simulacao.rentabilidade_cdb);
            simulacao.rentabilidade_lci_lca = formatter.format(simulacao.rentabilidade_lci_lca);

            res.render('templates/investimentos', { simulacao: simulacao, layout: false });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao processar a atualização da simulação.');
        }
    }

    //Método para excluir no banco de dados
    static async removeSimulacao(req,res){
        const vid = req.body.id

        await Simulacao.destroy({where : {id : vid}})
        .then(() => {res.redirect('/simulacao/todas')})
        .catch((err) => console.log(err))
    }

}