const { ipRenderer, ipcRenderer } = require('electron');
const { Datepicker } = require('materialize-css');
const { i18n } = require('i18n');

let formulario = document.getElementById('formulario');

const calendar = document.querySelectorAll('.datepicker');
Datepicker.init(calendar, {
    format: 'dd/mm/yyyy',
    i18n: {
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
        weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"]
    }
});


formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    let passwordError = document.getElementById('passwordError');
    let password = document.getElementById('password');
    let username = document.getElementById('username');
    let birthdate = document.getElementById('birthdate');
    let dateError = document.getElementById('dateError');
    let usernameError = document.getElementById('usernameError');

    let numErrors = 0;

    password.classList.remove('invalid');
    passwordError.innerHTML = "";
    birthdate.classList.remove('invalid')
    dateError.innerHTML = "";
    username.classList.remove('invalid');
    usernameError.innerHTML = "";

    let exprMin = RegExp("[a-z]");
    let exprMay = RegExp("[A-Z]");
    let exprNum = RegExp("[0-9]");
    let exprChar = RegExp("[\-\\\_]");

    function invalidateField(field, error) {
        field.classList.add('invalid');
        error.setAttribute('style', 'color:#F24337;');
        numErrors++;
    }

    if (password.value.length < 8) {
        passwordError.innerHTML += "La contraseña tiene que tener 8 caracteres<br>";
        invalidateField(password, passwordError);
    }

    if (!password.value.match(exprMin)) {
        passwordError.innerHTML += "La contraseña debe contener al menos 1 minúscula<br>";
        invalidateField(password, passwordError);
    }

    if (!password.value.match(exprMay)) {
        passwordError.innerHTML += "La contraseña debe contener al menos 1 mayúscula<br>";
        invalidateField(password, passwordError);
    }

    if (!password.value.match(exprChar)) {
        passwordError.innerHTML += "La contraseña debe contener al menos 1 carácter epecial ( - \ _)<br>";
        invalidateField(password, passwordError);
    }

    let bDate = new Date(birthdate.value);
    let minDate = new Date('01/01/2012');

    if (bDate > minDate) {
        dateError.innerHTML += "Debe ser mayor de edad";
        invalidateField(birthdate, dateError);
    }

    if (username) {
        ipcRenderer.send('username-check', [username.value]);
    }

    ipcRenderer.on('username-checked', (event, check) => {
        if (check) {    
            usernameError.innerHTML = "Usuario existe";
            invalidateField(username, usernameError);
        }
    });

    if (!password.classList.contains('invalid') && !birthdate.classList.contains('invalid') && !username.classList.contains('invalid')) {
        ipcRenderer.send('signup-success', [username.value, password.value]);
    
    } else {
        ipcRenderer.send('signup-error', numErrors);
    }
});