import React from 'react';
import {Nav, Navbar} from "react-bootstrap"
import Logout from "../logout/Logout";
import './LoggedHeader.less';

export default ({ text, link }: { text: string, link: string }) =>
    <Navbar className="justify-content-center restaurant-header">
        <Navbar.Brand href={ link } className="ml-auto"><h2 className='text-center'>Restauranty - { text }</h2>
        </Navbar.Brand>
        <Nav.Item className="ml-auto">
            <div className="row">
            {localStorage.getItem('role') === 'client' &&
            <Nav.Link href='/client/reservations'>
                <button className="btn btn-primary">Reservations</button>
            </Nav.Link>
            }
            <Nav.Link href='#'>
                <Logout/>
            </Nav.Link>
            </div>
        </Nav.Item>
    </Navbar>
