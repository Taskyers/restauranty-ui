import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.less';
import Router from "./Router";
import Footer from "./footer/Footer";
import { Container } from "react-bootstrap";
import Header from "./header/Header";

ReactDOM.render(
    <Container fluid>
        <Header/>
        <Router/>
        <Footer/>
    </Container>,
    document.getElementById('root')
);
