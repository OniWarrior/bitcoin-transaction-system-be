const router = require('express').Router()
const Client = require('./client-model')
const { default: jwtDecode } = require('jwt-decode')
const { restricted } = require('../auth/auth-middleware')

// retrieve all past orders for client
router.get('/Orders', restricted, async (req, res, next) => {

})