import React from 'react';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Form, Button } from 'react-bootstrap';
import './Login.less';
import '../IndexForm.less';

export default class LoginForm extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = { username: '', password: '', result: '', error: false, errorMessage: '' };
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
        event.preventDefault();
        this.setState({ username: event.currentTarget.value });
    }

    handlePasswordChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
        event.preventDefault();
        this.setState({ password: event.currentTarget.value });
    }

    handleSubmit(event: { preventDefault: () => void; }): void {
        event.preventDefault();
        axios.post('/api/login', {
            'username': this.state.username,
            'password': this.state.password
        }).then(res => {
            localStorage.setItem('token', res.headers.authorization);
            const role = res.headers['granted-role'];
            if ( role === 'ROLE_CLIENT' ) {
                this.props.history.push('/client');
            } else if ( role === 'ROLE_RESTAURANT' ) {
                this.props.history.push('/restaurant');
            } else {
                this.props.history.push('/admin');
            }
        }).catch(reason => {
            this.setState({ error: true, errorMessage: 'Invalid username or/and password' });
        });
    }

    render() {
        return (
            <>
                <div className="index-form login-form">
                    <h3>Sign in</h3>
                    <Form onSubmit={ this.handleSubmit }>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" onChange={ (event) => this.handleUsernameChange(event) }/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" onChange={ (event) => this.handlePasswordChange(event) }/>
                        </Form.Group>
                        <Button variant="light" type="submit" id="loginButton">
                            Log in
                        </Button>
                    </Form>
                    <span><a href="#" className="btn-forgot-password">Forgot password?</a></span>
                </div>
                { this.state.error &&
                <SweetAlert error title="Login failed" confirmBtnBsStyle={ 'info' } timeout={ 2000 }
                            onConfirm={ () => this.setState({ error: false }) }>
                    { this.state.errorMessage }
                </SweetAlert> }
            </>
        );
    }
}
