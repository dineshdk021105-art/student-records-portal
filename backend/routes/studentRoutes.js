const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const upload = require('../middleware/upload');

// Stats route
router.get('/stats', studentController.getStats);

// Student CRUD routes
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', upload.single('image'), studentController.createStudent);
router.put('/:id', upload.single('image'), studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
