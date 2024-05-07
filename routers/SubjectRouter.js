const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/SubjectController');

// Hiển thị danh sách môn học
router.get('/', SubjectController.index);
// Hiển thị form tạo mới môn học
router.get('/create', SubjectController.create);
// lưu form tạo môn học
router.post('/store', SubjectController.store);
// hiển thị form chỉnh sủa môn học
router.get('/edit/:id', SubjectController.edit);
// lưu form cập nhật môn học
router.post('/update', SubjectController.update);
// xoá môn học
router.get('/destroy/:id', SubjectController.destroy);

module.exports = router;