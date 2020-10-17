import React from 'react';
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import '../IndexForm.less';

export default class RegistrationForm extends React.Component<any, any> {
    render() {
        return (
            <div className="index-form">
                <h3>Sign up</h3>
                <Form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control type="password"/>
                    </Form.Group>
                    <Button variant="light" type="submit">
                        Register
                    </Button>
                </Form>
            </div>
        );
    }
}
