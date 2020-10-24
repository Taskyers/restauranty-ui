export const usernameValidation = (username: string) => {

    if (username.trim() === '') {
        return `Username is required`;
    }
    if (!/^[A-Z][a-z]*$/.test(username)) {
        return 'Invalid username';
    }
    if (username.trim().length < 3) {
        return `Username needs to be at least three characters`;
    }

    return null;
};

export const emailValidation = (email: string) => {
    if (
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            email,
        )
    ) {
        return null;
    }
    if (email.trim() === '') {
        return 'Email is required';
    }

    return 'Please enter a valid email';
};

export const passwordValidation = (password: string) => {
    if (
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/.test(
            password,
        )
    ) {
        return null;
    }
    if (password.trim() === '') {
        return 'Password is required';
    }
    return 'Please enter a valid password.';
};

export const confirmPasswordValidation = (confirmPassword: string, password: string) => {
    if (confirmPassword === password) {
        return null;
    }
    if (confirmPassword.trim() === '') {
        return 'Confirm password is required';
    }
    return 'Please enter a valid confirm password';
};


export const validateForm = (errors: any[]) => {
    let valid = true;
    Object.values(errors).forEach(
        error => error != null && (valid = false)
    );
    return valid;
}
