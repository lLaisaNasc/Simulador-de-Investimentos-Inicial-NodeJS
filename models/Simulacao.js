const { DataTypes } = require('sequelize')
const db = require ('../db/conn')

const Simulacao = db.define('Simulação', {
    titulo : {
        type : DataTypes.STRING, 
        allowNull : false
    },
    objetivo : {
        type : DataTypes.STRING,
        allowNull : false
    },
    valor_investimento_inicial : {
        type : DataTypes.FLOAT,
        allowNull : false,
    },
    valor_investimento_mensal : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    tempo_de_investimento_meses : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    valor_total_investido : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    rentabilidade_tesouro : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    rentabilidade_poupanca : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    rentabilidade_cdb : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    rentabilidade_lci_lca : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
})

module.exports = Simulacao