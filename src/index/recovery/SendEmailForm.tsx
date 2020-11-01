import React from "react";
import '../IndexForm.less';
import axios from 'axios';
import './SendEmailForm.less';
import { Button, Col, Form, Row } from "react-bootstrap";
import ResponseMessage from "../../ResponseMessage";
import SweetAlert from "react-bootstrap-sweetalert";

export default class SendEmailForm extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { email: '', success: false, failure: false, message: '' };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
        event.preventDefault();
        this.setState({ email: event.currentTarget.value });
    }

    handleSubmit(event: { preventDefault: () => void; }): void {
        event.preventDefault();
        const params = new FormData();
        params.append('email', this.state.email);
        axios.post<ResponseMessage<string>>('/api/recovery/generateToken', params
        ).then(result => {
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
                        <div className="index-form email-form">
                            <h3 className="header-top">Password recovery</h3>
                            <Form onSubmit={ this.handleSubmit }>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" onChange={ (event) => {
                                        this.handleEmailChange(event)
                                    } }/>
                                </Form.Group>
                                <Button variant="light" type="submit">
                                    Send
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
