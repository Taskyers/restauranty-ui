import React from "react";
import axios from "axios";
import { Form, Col, Row, Button } from "react-bootstrap";
import {
    passwordValidation,
    confirmPasswordValidation
} from "../../utils/validation/registration/RegistrationValidator";
import ResponseMessage from "../../ResponseMessage";
import SweetAlert from "react-bootstrap-sweetalert";
import {validateForm} from "../../utils/validation/shared/SharedValidation";

export default class ChangePasswordForm extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isFormValid: false,
            password: '',
            confirmPassword: '',
            success: false,
            failure: false,
            message: '',
            errors: {
                password: '',
                confirmPassword: ''
            }
        };
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePasswordChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
        event.preventDefault();
        const password = event.currentTarget.value;
        const errors = { ...this.state.errors, password: passwordValidation(password) };
        this.setState({ password, errors, isFormValid: validateForm(errors) });
    }

    handleConfirmPasswordChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
        event.preventDefault();
        const confirmPassword = event.currentTarget.value;
        const errors = {
            ...this.state.errors, confirmPassword: confirmPasswordValidation(confirmPassword, this.state.password)
        };
        this.setState({
            confirmPassword, errors, isFormValid: validateForm(errors)
        });
    }

    handleSubmit(event: { preventDefault: () => void; }): void {
        event.preventDefault();
        axios.patch<ResponseMessage<string>>('/api/recovery/setPassword', {
            'token': this.props.token,
            'password': this.state.password
        }).then(result => {
            this.setState({ success: true, message: result.data.message });
        }).catch(reason => {
            this.setState({ failure: true, message: reason.response.data.object });
        });
    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <div className="index-form">
                            <h3 className="header-top">Reset password</h3>
                            <Form onSubmit={ this.handleSubmit }>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Text>{ this.state.errors.password }</Form.Text>
                                    <Form.Control type="password" onChange={ (event) => {
                                        this.handlePasswordChange(event)
                                    } }/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Confirm password</Form.Label>
                                    <Form.Text>{ this.state.errors.confirmPassword }</Form.Text>
                                    <Form.Control type="password" onChange={ (event) => {
                                        this.handleConfirmPasswordChange(event)
                                    } }/>
                                </Form.Group>
                                <Button variant="light" type="submit" disabled={ !this.state.isFormValid }>
                                    Reset
                                </Button>
                            </Form>
                        </div>
                        { this.state.failure &&
                        <SweetAlert error title="Error" confirmBtnBsStyle={ 'info' } timeout={ 5000 }
                                    onConfirm={ () => this.setState({ failure: false }) }>
                            { this.state.message }
                        </SweetAlert> }
                        { this.state.success &&
                        <SweetAlert success title="Success" confirmBtnBsStyle={ 'info' } timeout={ 5000 }
                                    onConfirm={ () => this.setState({ success: false }) }>
                            { this.state.message }
                        </SweetAlert> }
                    </Col>
                </Row>
            </>
        );
    }
}
