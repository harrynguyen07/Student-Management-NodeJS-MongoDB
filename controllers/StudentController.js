const studentModel = require('../models/Student');
const registerModel = require('../models/Register');
const { format } = require('date-fns');
class StudentController {
    static module = 'student';
    // Hàm hiển thị danh sách sinh viên
    static index = async (req, res) => {
        try {
            const search = req.query.search;
            const page = Number(req.query.page || 1);
            const item_per_page = process.env.ITEM_PER_PAGE;

            let students = [];
            let totalStudent = [];
            if (search) {
                students = await studentModel.getByPattern(search, page, item_per_page);

                // chưa phân trang
                totalStudent = await studentModel.getByPattern(search);
            } else {
                students = await studentModel.all(page, item_per_page);

                // chưa phân trang
                totalStudent = await studentModel.all();
            }
            // ceil là làm tròn lên
            // .length là đếm số lượng phần tử trong danh sách
            const totalPage = Math.ceil(totalStudent.length / item_per_page);


            // console.log('Test thử', format(new Date('2000-01-17'), 'dd/MM/yyyy'));
            // gọi model để lấy dữ liệu
            // gọi từ class, không cần new Student()

            // gửi dữ liệu về view
            const message_success = req.session.message_success;
            const message_error = req.session.message_error;
            // Chủ động xoá message
            delete req.session.message_success;
            delete req.session.message_error;
            res.render('student/index', {
                students: students,
                format: format,
                message_success: message_success,
                message_error: message_error,
                search: search,
                totalPage: totalPage,
                page: page,
                module: this.module,
            });
            res.end();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }


    static create = (req, res) => {
        try {
            res.render('student/create', { module: this.module, });

        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static store = async (req, res) => {
        try {
            // lưu dữ liệu vào database
            // console.log(req.body);
            await studentModel.save(req.body);

            // lưu session vào req
            req.session.message_success = `Đã tạo sinh viên ${req.body.name} thành công`;

            // điều hướng về trang dssv
            res.redirect('/');
            // res.send(req.body);
            // res.end();

        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = ` ${error.message} `;
            res.redirect('/');

        }
    }

    static edit = async (req, res) => {
        try {
            const student = await studentModel.find(req.params.id)
            // console.log(student);
            res.render('student/edit', {
                student: student,
                module: this.module,
                format: format,
            });


        } catch (error) {
            res.status(500).send(error.message);

        }
    }

    static update = async (req, res) => {
        try {
            // lưu dữ liệu vào database
            // console.log(req.body);
            const id = req.body.id;
            const name = req.body.name;
            const birthday = req.body.birthday;
            const gender = req.body.gender;

            // cập nhật giá trị mới từ người dùng
            const student = await studentModel.find(id);
            student.name = name;
            student.birthday = birthday;
            student.gender = gender;


            // Lưu nó xuống database
            await student.update();

            // lưu session vào req
            req.session.message_success = `Đã tạo sinh viên ${req.body.name} thành công`;

            // điều hướng về trang dssv
            res.redirect('/');
            // res.send(req.body);
            // res.end();

        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = ` ${error.message} `;
            res.redirect('/');

        }
    }


    static destroy = async (req, res) => {
        try {

            // Lấy student tư database lên
            const student = await studentModel.find(req.params.id);


            // kiểm tra sinh viên đã đăng ký môn học chưa, nếu đã đăng ký rồi thì không thể xoá
            // Lấy danh sách register của sinh viên cần xoá

            const registers = await registerModel.getByStudentId(req.params.id);
            if (registers.length > 0) {
                // lưu vào req
                req.session.message_error = ` Sinh viên ${student.name} đã đăng ký ${registers.length} môn học, không thể xoá `;
                res.redirect('/');
                return; //Không chạy code phía dưới
            }


            await student.destroy();
            // console.log(student);
            req.session.message_success = `Đã xoá sinh viên ${student.name} thành công`;
            res.redirect('/');
        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = ` ${error.message} `;
            res.redirect('/');

        }
    }

}
module.exports = StudentController;