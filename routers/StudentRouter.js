const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');

// Hiển thị danh sách sinh viên
router.get('/', StudentController.index);
// Hiển thị form tạo mới sinh viên
router.get('/create', StudentController.create);
// lưu form tạo sinh viên
router.post('/store', StudentController.store);
// hiển thị form chỉnh sủa sinh viên
router.get('/edit/:id', StudentController.edit);
// lưu form cập nhật sinh viên
router.post('/update', StudentController.update);
// xoá sinh viên
router.get('/destroy/:id', StudentController.destroy);

module.exports = router;