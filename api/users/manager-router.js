const router = require('express').Router()

const { default: jwtDecode } = require('jwt-decode')
const { restricted } = require('../auth/auth-middleware')
