const express = require('express');
const router = express.Router();
const { getMaintenanceRequests, createMaintenanceRequest, updateMaintenanceRequest } = require('../controllers/maintenanceController');

router.route('/').get(getMaintenanceRequests).post(createMaintenanceRequest);
router.route('/:id').put(updateMaintenanceRequest);

module.exports = router;
