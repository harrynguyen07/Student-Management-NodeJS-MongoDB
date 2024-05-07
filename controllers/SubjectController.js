const subjectModel = require('../models/Subject');
const registerModel = require('../models/Register');
const { format } = require('date-fns');
class SubjectController {
    static module = 'subject';
    // Hàm hiển thị danh sách môn học
    static index = async (req, res) => {
        try {
            const search = req.query.search;
            const page = req.query.page || 1;
            const item_per_page = process.env.ITEM_PER_PAGE;

            let subjects = [];
            let totalSubject = [];
            if (search) {
                subjects = await subjectModel.getByPattern(search, page, item_per_page);

                // chưa phân trang
                totalSubject = await subjectModel.getByPattern(search);
            } else {
                subjects = await subjectModel.all(page, item_per_page);

                // chưa phân trang
                totalSubject = await subjectModel.all();
            }
            // ceil là làm tròn lên
            // .length là đếm số lượng phần tử trong danh sách
            const totalPage = Math.ceil(totalSubject.length / item_per_page);


            // console.log('Test thử', format(new Date('2000-01-17'), 'dd/MM/yyyy'));
            // gọi model để lấy dữ liệu
            // gọi từ class, không cần new Subject()

            // gửi dữ liệu về view
            const message_success = req.session.message_success;
            const message_error = req.session.message_error;
            // Chủ động xoá message
            delete req.session.message_success;
            delete req.session.message_error;
            res.render('subject/index', {
                subjects: subjects,
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
            res.render('subject/create', {
                module: this.module
            });

        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static store = async (req, res) => {
        try {
            // lưu dữ liệu vào database
            // console.log(req.body);
            await subjectModel.save(req.body);

            // lưu session vào req
            req.session.message_success = `Đã tạo môn học ${req.body.name} thành công`;

            // điều hướng về trang dssv
            res.redirect('/subject');
            // res.send(req.body);
            // res.end();

        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = ` ${error.message} `;
            res.redirect('/subject');

        }
    }

    static edit = async (req, res) => {
        try {
            const subject = await subjectModel.find(req.params.id)
            // console.log(subject);
            res.render('subject/edit', {
                subject: subject,
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
            const name = req.body.name;
            const number_of_credit = req.body.number_of_credit;


            // cập nhật giá trị mới từ người dùng
            const subject = await subjectModel.find(id);
            subject.name = name;
            subject.number_of_credit = number_of_credit;



            // Lưu nó xuống database
            await subject.update();

            // lưu session vào req
            req.session.message_success = `Đã tạo môn học ${req.body.name} thành công`;

            // điều hướng về trang dssv
            res.redirect('/subject');
            // res.send(req.body);
            // res.end();

        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = ` ${error.message} `;
            res.redirect('/subject');

        }
    }


    static destroy = async (req, res) => {
        try {

            // Lấy subject tư database lên
            const subject = await subjectModel.find(req.params.id);


            // kiểm tra sinh viên đã đăng ký môn học chưa, nếu đã đăng ký rồi thì không thể xoá
            // Lấy danh sách register của sinh viên cần xoá

            const registers = await registerModel.getBySubjectId(req.params.id);
            if (registers.length > 0) {
                // lưu vào req
                req.session.message_error = ` Môn học ${subject.name} đã có  ${registers.length} sinh viên đăng ký, không thể xoá `;
                res.redirect('/subject');
                return; //Không chạy code phía dưới
            }


            await subject.destroy();
            // console.log(subject);
            req.session.message_success = `Đã xoá môn học ${subject.name} thành công`;
            res.redirect('/subject');
        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = ` ${error.message} `;
            res.redirect('/subject');

        }
    }

}
module.exports = SubjectController;