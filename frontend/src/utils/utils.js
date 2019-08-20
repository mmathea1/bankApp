
function isEmailValid(email, prefixMessage) {  // enfore rules on email field, return object with isValid (true/false), message (error message)
    let response = {"isValid": false, message: ""};
    if (isEmptyString(email)) {
        response.message = prefixMessage + " cannot be empty";
        return response;
    }
    if (email.trim().length > 100) {
        response.message = prefixMessage + " cannot be more than 100 characters.";
        return response;
    }
    let re = /\S+@\S+\.\S+/;  // regular expression to ensure email is text@text.text
    if (!re.test(email)) {
        response.message = prefixMessage + " does not look like a valid email address e.g. 'example@domain.com'.";
        return response;
    }
    response.isValid = true;
    return response;
}

function isEmptyString(value) {
    try {
        if (typeof value !== 'string') {
            return true;
        }
        return typeof value === 'string' && value.trim() === '';
    }
    catch (err) {
        return true;
    }
}

function isNullUndefined(value) {
    try {
        return value === null || value === undefined;
    }
    catch (error) {
        return true;//this is a negative connotation test, so a crash suffices as true
    }
}