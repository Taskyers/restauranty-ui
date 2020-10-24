import React from 'react';
import { Nav } from "react-bootstrap"
import './Header.less';

export default () =>
    <Nav className="justify-content-center main-header">
        <Nav.Item>
            <Nav.Link href="/">
                <h2>Restauranty</h2>
            </Nav.Link>
        </Nav.Item>
    </Nav>
