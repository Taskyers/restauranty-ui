import React from 'react';
import { Nav, Navbar } from "react-bootstrap"
import Logout from "../logout/Logout";
import './LoggedHeader.less';

export default ({ text, link }: { text: string, link: string }) =>
    <Navbar className="justify-content-center restaurant-header">
        <Navbar.Brand className='pl-2 ml-auto' href={ link }><h2>Restauranty - { text }</h2></Navbar.Brand>
        <Navbar.Brand className="pl-2 ml-auto">
            <Nav.Item>
                <Nav.Link href='#'>
                    <Logout/>
                </Nav.Link>
            </Nav.Item>
        </Navbar.Brand>
    </Navbar>
