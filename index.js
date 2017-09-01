var MyForm = (function() {
	var myForm = $('#myForm');
	var nameInput = $('input[name=fio]');
	var emailInput = $('input[name=email]');
	var phoneInput = $('input[name=phone]');
	var submitButton = $('input[type=submit]');
	var resultContainer = $('#resultContainer');
	
	var validateName = (name) => name != undefined && typeof name === 'string' && name.split(/\s+/g).filter(char => char).length === 3; 
	var validateEmail = (email) => {
		return email !== undefined && validateEmail.emailRegex.test(email) && validateEmail.validDomains.includes(email.split('@').pop());
	};
	validateEmail.validDomains = [ 'ya.ru','yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
	validateEmail.emailRegex =  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	
	var validatePhone = (phone) => {
		return phone != undefined 
		&& validatePhone.phoneRegex.test(phone) 
		&& phone.split('').filter((char) => !isNaN(parseInt(char))).reduce((acc,value) => acc + +value,0) <= 30;
	};
	validatePhone.phoneRegex = /^\+7\([0-9]{3}\)([0-9]{3})[-. ]([0-9]{2})[-. ]([0-9]{2})$/i;
	
	var getInputByFieldName = (fieldName) => {
		switch (fieldName)  {
			case 'fio' : return nameInput;
			case 'email' : return emailInput; 
			case 'phone' : return phoneInput;
			default : return;
		}
	} 
	
	
	var performRequest = () => {
		  $.ajax({
						url: myForm.attr('action'),
						dataType: "json",
						async: false,
						success: function (data){
							if (data.status === 'success') {
								resultContainer.addClass('success');
								resultContainer.text('Success');
							} else if (data.status === 'error') {
								resultContainer.addClass('error');
								resultContainer.text(data.reason);
							} else if (data.status === 'progress') {
								console.log('In progress');
								setTimeout(performRequest, + data.timeout)
							}
						}
			});
	}
	
	return {
		submit: () => {
			var validateResult = MyForm.validate();
			if (validateResult.isValid) {
				performRequest();
			} else {
				for (let error of validateResult.errorFields){
					getInputByFieldName(error).addClass('error');
				}
				submitButton.prop('disabled', true);
			}
		},
		getData : () => ({
			fio : nameInput.val(),
			email : emailInput.val(),
			phone : phoneInput.val()
		}),
		setData : (data) =>  {
			if (data != undefined) {
				nameInput.val(data.fio);
				emailInput.val(data.email);
				phoneInput.val(data.phone);
			}
		},
		validate : () => {
			var isValid = true;
			var errorFields = [];
			var data = MyForm.getData();
			
			if (!validateName(data.fio)) {
				isValid = false;
				errorFields.push('fio');
			}
			if (!validateEmail(data.email)) {
				isValid = false;
				errorFields.push('email');
			}
			if (!validatePhone(data.phone)) {
				isValid = false;
				errorFields.push('phone');
			}
			return {
				isValid : isValid,
				errorFields : errorFields
			}
		}
	}
})()

$('#myForm').submit(function(ev) {
    ev.preventDefault(); 
	MyForm.submit();
	
});