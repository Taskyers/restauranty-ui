export const validateForm = (errors: any[]) => {
    let valid = true;
    Object.values(errors).forEach(
        error => error != null && (valid = false)
    );
    return valid;
}

export const validateEditForm = (errors: any[]) => {
    let valid = true;
    Object.values(errors).forEach(
        error => error != null || error != '' && (valid = false)
    );
    return valid;
}

