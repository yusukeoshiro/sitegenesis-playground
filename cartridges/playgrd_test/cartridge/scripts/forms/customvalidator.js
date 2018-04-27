'use strict'

function myCustomValidation(formfield) {
    let validationResult = formfield.getValidationResult();
    validationResult.setMessage('bad value!!');
    validationResult.setValid(false);
    return validationResult;
}


exports.myCustomValidation = myCustomValidation;