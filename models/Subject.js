const db = require('./db');
const collection = db.collection('subjects');
class Subject {
    // Hàm xây dựng đối tượng
    constructor(id, name, number_of_credit) {
        this.id = id;
        this.name = name;
        this.number_of_credit = number_of_credit;

    }



    // hàm lấy tất cả các dòng dữ liệu trong bảng
    // trả về danh sách chứa các đối tượng subject
    // static là gọi từ class, vd: Subject.all, không cần phải new Subject(...).all()
    static all = async (page = null, item_per_page = null) => {


        try {
            let rows = [];
            if (page && item_per_page) {
                item_per_page = Number(item_per_page)
                const skip_number = (page - 1) * item_per_page
                rows = await collection.find().skip(skip_number).limit(item_per_page).toArray();
            }
            else {
                rows = await collection.find().toArray();
            }
            return this.convertArrayToObject(rows);

        } catch (error) {
            throw new Error(error);
        }
    }

    static convertArrayToObject = (rows) => {
        const subjects = rows.map(row => new Subject(row.subject_id, row.name, row.number_of_credit));
        return subjects;
    }

    static getByPattern = async (search, page = null, item_per_page = null) => {
        try {
            // xây dựng phân trang
            // $options i là không phân biệt chữ hoa chữ thường 
            // i : case insensitive (không phân biệt chữ hoa chữ thường)
            // options và regex là toán tử trong mongodb nên phải có dấu "$" (rule)
            // mặc định $regex là tìm gần đúng (chứa)
            let rows = [];
            const query = { name: { $regex: search, $options: 'i' } };
            if (page && item_per_page) {
                item_per_page = Number(item_per_page)
                const skip_number = (page - 1) * item_per_page
                rows = await collection.find(query).skip(skip_number).limit(item_per_page).toArray();
            }
            else {
                rows = await collection.find(query).toArray();
            }

            // db.subject.find({ name: { $regex: 't', $options: 'i' } })
            // db.subject.find({ name: { $regex: /t/, $options: 'i' } })
            return this.convertArrayToObject(rows);

        } catch (error) {
            throw new Error(error);
        }
    }

    static save = async (data) => {
        try {
            const row = await collection.findOne({}, { sort: { subject_id: -1 } })
            const newInsertId = row ? row.subject_id + 1 : 1;

            await collection.insertOne({
                subject_id: newInsertId,
                name: data.name,
                number_of_credit: data.number_of_credit,

            })

            // console.log(result);
            return newInsertId;
        } catch (error) {
            throw new Error(error);
        }
    }

    static find = async (id) => {
        try {
            const query = { subject_id: Number(id) };
            const row = await collection.findOne(query);
            // db.subjects.findOne(query);
            // check nếu không có dòng nào thoả mãn trong bảng subject
            if (!row) {
                return null;
            }
            const rows = [row];
            const subjects = this.convertArrayToObject(rows);
            const subject = subjects[0];
            return subject;


        } catch (error) {
            throw new Error(error);
        }
    }



    update = async () => {
        try {
            const query = { subject_id: this.id };
            const set = {
                $set: {
                    name: this.name,
                    number_of_credit: this.number_of_credit,

                }
            }
            await collection.updateOne(query, set);
            // db.subjects.updateOne(
            //     { <điều kiện truy vấn> },
            //     { $set: { name: "Tèo" } }
            //   )

            return true;
        } catch (error) {
            throw new Error(error);
        }

    }

    destroy = async () => {
        try {
            const query = { subject_id: this.id };
            await collection.deleteOne(query);
            // db.collection.deleteOne({ <điều kiện truy vấn> })
            return true;
        } catch (error) {
            throw new Error(error);
        }

    }

}


module.exports = Subject;