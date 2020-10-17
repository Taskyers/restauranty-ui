import React from 'react';
import LoginForm from "./login/LoginForm";
import { Col, Row } from "react-bootstrap";
import Header from "./header/Header";
import RegistrationForm from "./registration/RegistrationForm";

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
