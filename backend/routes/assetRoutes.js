const express = require('express');
const router = express.Router();
const { getAssets, createAsset, updateAsset, deleteAsset } = require('../controllers/assetController');

router.route('/').get(getAssets).post(createAsset);
router.route('/:id').put(updateAsset).delete(deleteAsset);

module.exports = router;
