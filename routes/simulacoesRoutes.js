const express = require('express')
const router = express.Router()
const SimulacaoController = require('../controllers/SimulacaoController')

router.get('/adicionar', SimulacaoController.criarSimulacao)
router.post('/adicionar', SimulacaoController.criarSimulacaoPost)
router.get('/home', SimulacaoController.paginaInicial)
router.get('/todas',SimulacaoController.mostrarSimulacoes)
router.get('/editar/:id', SimulacaoController.atualizarSimulacao)
router.post('/editar', SimulacaoController.atualizarSimulacaoPost)
router.post('/remover', SimulacaoController.removeSimulacao)

module.exports = router