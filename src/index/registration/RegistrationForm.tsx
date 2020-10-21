import React from 'react';
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import '../IndexForm.less';
import './RegistrationForm.less';
import {
    emailValidation,
    usernameValidation,
    passwordValidation,
    confirmPasswordValidation, validateForm
} from "../../utils/validation/registration/RegistrationValidator";
import axios from "axios";
import SweetAlert from "react-bootstrap-sweetalert";


export default class RegistrationForm extends React.Component<any, any> {


    constructor(props: any) {
        super(props);
        this.state = {
            newUser: {username: '', email: '', password: '', confirmPassword: '', role: 'ROLE_CLIENT'},
            errors: {
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            isFormValid: false,
            registerSuccess: false,
            message: '',
            registerError: false
        };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleOnChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
        event.preventDefault();
        const {newUser} = this.state;
        newUser[event.target.name] = event.target.value;
        this.setState({
            newUser
        });
        const {name, value} = event.target;
        let errors = this.state.errors;


        switch (name) {
            case 'username':
                errors.username = usernameValidation(value)
                axios.get('/api/register/checkByUsername/' + value)
                    .then((res) => {
                        if (res.data === true) {
                            this.setState({
                                ...this.state,
                                errors: {...this.state.errors, username: "Username is already taken"}
                            })
                        } else {
                            errors.username = null;
                        }
                    }).catch(() => {
                })
                break;
            case 'email':
                errors.email = emailValidation(value)
                axios.get('/api/register/checkByEmail/' + value)
                    .then((res) => {
                        if (res.data === true) {
                            this.setState({
                                ...this.state,
                                errors: {...this.state.errors, email: "Email is already taken"}
                            })
                        } else {
                            errors.email = null;
                        }
                    }).catch(() => {
                })
                break;
            case 'password':
                errors.password = passwordValidation(value)
                break;
            case 'confirmPassword':
                errors.confirmPassword = confirmPasswordValidation(value, this.state.newUser.password)
                break;
            default:
                break;
        }

        this.setState({errors, [name]: value});
        this.setState({newUser, [name]: value});
        this.setState({isFormValid: validateForm(this.state.errors)})
    }

    handleSubmit(event: { preventDefault: () => void; }): void {
        event.preventDefault();
        axios.post('/api/register', {
            'username': this.state.newUser.username,
            'email': this.state.newUser.email,
            'password': this.state.newUser.password,
            'role': this.state.newUser.role,
        }).then(res => {
            this.setState({...this.state, registerSuccess: true, message: 'You can now log in!'})
            this.setState({newUser: {username: '', email: '', password: '', confirmPassword: ''}})
        }).catch(reason => {
            this.setState({...this.state, registerError: true, message: reason.message})
        });
    }

    render() {
        const {newUser, isFormValid, errors} = this.state;
        return (
            <>
                <div className="index-form registration-form">
                    <h3>Sign up</h3>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Text>{errors.username}</Form.Text>
                            <Form.Control name={'username'} type="text" value={newUser.username}
                                          onChange={e => this.handleOnChange(e)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Text>{errors.email}</Form.Text>
                            <Form.Control name={'email'} type="email" value={newUser.email}
                                          onChange={e => this.handleOnChange(e)}/>

                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Text>{errors.password}</Form.Text>
                            <Form.Control type="password" name={'password'} value={newUser.password}
                                          onChange={e => this.handleOnChange(e)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Text>{errors.confirmPassword}</Form.Text>
                            <Form.Control type="password" name={'confirmPassword'} value={newUser.confirmPassword}
                                          onChange={e => this.handleOnChange(e)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Account type</Form.Label>
                            <Form.Control
                                as="select" name={'role'}
                                className="mr-sm-2" value={newUser.role} onChange={e => this.handleOnChange(e)}
                            >
                                <option value="ROLE_CLIENT">Client</option>
                                <option value="ROLE_RESTAURANT">Restaurant</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="light" type="submit" disabled={!isFormValid}>
                            Register
                        </Button>
                    </Form>
                </div>
                {this.state.registerSuccess &&
                <SweetAlert success title="Register successful" confirmBtnBsStyle={'info'} timeout={20000}
                            onConfirm={() => this.setState({registerSuccess: false})}>
                    <span>{this.state.message}</span>
                </SweetAlert>}
                {this.state.registerError &&
                <SweetAlert error title="Register error" confirmBtnBsStyle={'info'} timeout={20000}
                            onConfirm={() => this.setState({registerError: false})}>
                    <span>{this.state.message}</span>
                </SweetAlert>}
            </>
        );
    }
}
