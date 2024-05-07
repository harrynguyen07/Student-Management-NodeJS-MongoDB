// jqClick
$('button.destroy').click(function (e) {
	e.preventDefault();
	const data_href = $(this).attr('data-href');
	$('#exampleModal a').attr('href', data_href)
});

const gotoPage = (page) => {
	// Event.preventDefault(); //ngăn chặn chạy href của thẻ a
	// window.location.href : trang web http://qlsv.com/?page=3
	const currenURL = window.location.href;
	const obj = new URL(currenURL);
	obj.searchParams.set('page', page);
	// window.location.href = http://qlsv.com/?page=2
	// nghĩa là trình duyệt tự động chạy tới đường links http://qlsv.com/?page=2 
	window.location.href = obj.href
}


$(".form-student-create, .form-student-edit").validate({
	rules: {

		name: {
			required: true,
			regex: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/i,
			maxlength: 50,

		},
		// compound rule
		birthday: {
			required: true,
			// email: true
		},
		gender: {
			required: true,
			// email: true
		}
	},

	messages: {

		name: {
			required: 'Vui lòng nhập họ và tên',
			regex: 'Vui lòng không nhập số hoặc ký tự đặc biệt',
			maxlength: 'Vui lòng không nhập quá 50 ký tự'
		},
		// compound rule
		birthday: {
			required: 'Vui lòng chọn ngày sinh',

		},
		gender: {
			required: 'Vui lòng chọn giới tính',

		}
	}
});

$(".form-subject-create, .form-subject-edit").validate({
	rules: {

		name: {
			required: true,
			maxlength: 50,

		},
		// compound rule
		number_of_credit: {
			required: true,
			//digits: số nguyên
			digits: true,
			range: [1, 10]
			// email: true
		},

	},

	messages: {

		name: {
			required: 'Vui lòng nhập tên môn học',

			maxlength: 'Vui lòng không nhập quá 50 ký tự'
		},
		// compound rule
		number_of_credit: {
			required: 'Vui lòng nhập số tín chỉ',
			digits: 'Vui lòng nhập số nguyên',
			range: 'Vui lòng nhập số từ 1 đến 10'
		},

	}
});

$(".form-register-create").validate({
	rules: {

		student_id: {
			required: true,
		},
		// compound rule
		subject_id: {
			required: true,
		},

	},

	messages: {

		student_id: {
			required: 'Vui lòng nhập tên sinh viên',
		},
		// compound rule
		subject_id: {
			required: 'Vui lòng tên môn học'
		}
	}
});


$(".form-register-edit").validate({
	rules: {

		score: {
			required: true,
			range: [0, 10]
		}

	},

	messages: {

		score: {
			required: 'Vui lòng nhập số điểm',
			range: 'Vui lòng nhập số điểm từ 0 đến 10'
		},

	}
});

$.validator.addMethod(
	"regex",
	function (value, element, regexp) {
		var re = new RegExp(regexp);
		return this.optional(element) || re.test(value);
	},
	"Please check your input."
);