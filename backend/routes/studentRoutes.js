const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, getStudentByUniversityId, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');

router.route('/').get(getStudents).post(createStudent);
router.route('/lookup').post(getStudentByUniversityId);
router.route('/:id').get(getStudentById).put(updateStudent).delete(deleteStudent);

module.exports = router;
