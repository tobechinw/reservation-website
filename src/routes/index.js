const express = require('express')
const router = express.Router()

router.use('/', require('#base/baseController'))
router.use('/employees', require("#employees/employeesController"))
router.use('/rooms', require("#rooms/roomsController"))
router.use('/reservations', require("#reserve/reserveController"))

module.exports = router