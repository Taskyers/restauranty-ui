import React from 'react';
import LoginForm from "./login/LoginForm";
import { Col, Row } from "react-bootstrap";
import RegistrationForm from "./registration/RegistrationForm";
import Header from "./header/Header";

export default class Index extends React.Component<any, any> {
    render() {
        return (
            <>
                <Header/>
                <Row>
                    <Col>
                        <LoginForm { ...this.props }/>
                    </Col>
                    <Col>
                        <RegistrationForm { ...this.props }/>
                    </Col>
                </Row>
            </>
        );
    }
}
