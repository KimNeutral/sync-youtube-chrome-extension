$(document).ready(function () {
    $('#save').click(function () {
        login($('#email').val(), $('#password').val());
    });
});

function login(email, pw) {
    $.ajax('http://10.80.163.90:8080/api/auth/login/', {
        method: 'POST',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({'email': email, 'password': pw}),
        success: function (data) {
            alert('success');
            chrome.storage.local.set({token: data.data}, function() {
                console.log('Value is set to ' + data.data);
            });
        },
        error: function (xhr) {
            alert('failed');
        }
    });
}