const registerModel = require('../models/Register');
const studentModel = require('../models/Student');
const subjectModel = require('../models/Subject');


const { format } = require('date-fns');
class RegisterController {
    static module = 'register';
    // Hàm hiển thị danh sách đăng ký môn học
    static index = async (req, res) => {
        try {
            const search = req.query.search;
            const page = req.query.page || 1;
            const item_per_page = process.env.ITEM_PER_PAGE;

            let registers = [];
            let totalRegister = [];
            if (search) {
                registers = await registerModel.getByPattern(search, page, item_per_page);

                // chưa phân trang
                totalRegister = await registerModel.getByPattern(search);
            } else {
                registers = await registerModel.all(page, item_per_page);

                // chưa phân trang
                totalRegister = await registerModel.all();
            }
            // ceil là làm tròn lên
            // .length là đếm số lượng phần tử trong danh sách
            const totalPage = Math.ceil(totalRegister.length / item_per_page);


            // console.log('Test thử', format(new Date('2000-01-17'), 'dd/MM/yyyy'));
            // gọi model để lấy dữ liệu
            // gọi từ class, không cần new Register()

            // gửi dữ liệu về view
            const message_success = req.session.message_success;
            const message_error = req.session.message_error;
            // Chủ động xoá message
            delete req.session.message_success;
            delete req.session.message_error;
            res.render('register/index', {
                registers: registers,
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


    static create = async (req, res) => {
        try {
            const students = await studentModel.all();
            const subjects = await subjectModel.all();
            res.render('register/create', {
                module: this.module,
                students: students,
                subjects: subjects,
            });

        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static store = async (req, res) => {
        try {
            // lưu dữ liệu vào database
            // console.log(req.body);
            await registerModel.save(req.body);
            const student = await studentModel.find(req.body.student_id);
            const student_name = student.name;

            const subject = await subjectModel.find(req.body.subject_id);
            const subject_name = subject.name;

            // lưu session vào req
            req.session.message_success = `Sinh viên ${student_name} đăng ký môn học ${subject_name} thành công`;

            // điều hướng về trang dssv
            res.redirect('/register');
            // res.send(req.body);
            // res.end();

        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = ` ${error.message} `;
            res.redirect('/register');

        }
    }

    static edit = async (req, res) => {
        try {
            const register = await registerModel.find(req.params.id)
            // console.log(register);
            res.render('register/edit', {
                register: register,
                module: this.module

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
            const score = req.body.score;



            // cập nhật giá trị mới từ người dùng
            const register = await registerModel.find(id);
            // cập nhập điểm 
            register.score = score;


            // Lưu nó xuống database
            await register.update();

            // lưu session vào req
            const student_name = register.student_name;
            const subject_name = register.subject_name;

            req.session.message_success = `Sinh viên ${student_name} thi môn ${subject_name} được ${score} điểm`;

            // điều hướng về trang dssv
            res.redirect('/register');
            // res.send(req.body);
            // res.end();

        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = ` ${error.message} `;
            res.redirect('/register');

        }
    }


    static destroy = async (req, res) => {
        try {
            // cập nhật giá trị mới từ người dùng
            const register = await registerModel.find(req.params.id);
            await register.destroy();
            // console.log(register);
            req.session.message_success = `Sinh viên ${register.student_name} đã bị huỷ đăng ký môn học ${register.subject_name}  `;
            res.redirect('/register');
        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = ` ${error.message} `;
            res.redirect('/register');

        }
    }

}
module.exports = RegisterController;