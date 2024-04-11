const router = require('express').Router()
const Manager = require('./manager-model')
const { default: jwtDecode } = require('jwt-decode')
const { restricted } = require('../auth/auth-middleware')


// path to retrieve total transactions
