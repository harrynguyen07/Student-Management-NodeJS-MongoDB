const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/RegisterController');

// Hiển thị danh sách môn học
router.get('/', RegisterController.index);
// Hiển thị form tạo mới môn học
router.get('/create', RegisterController.create);
// lưu form tạo môn học
router.post('/store', RegisterController.store);
// hiển thị form chỉnh sủa môn học
router.get('/edit/:id', RegisterController.edit);
// lưu form cập nhật môn học
router.post('/update', RegisterController.update);
// xoá môn học
router.get('/destroy/:id', RegisterController.destroy);

module.exports = router;