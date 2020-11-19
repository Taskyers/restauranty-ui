import React from "react";
import axios from 'axios';
import { MenuGroup } from "./MenuGroup";
import { MenuDish } from "./MenuDish";
import { Button, ButtonGroup, Col, Form, FormGroup, Modal, Row } from "react-bootstrap";
import ResponseMessage from "../../ResponseMessage";
import SweetAlert from "react-bootstrap-sweetalert";
import './RestaurantMenu.less';
import DangerAlert from "../../utils/swal/DangerAlert";

export default class RestaurantMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            menu: [],
            showActionModal: false,
            showAddModal: false,
            showEditModal: false,
            success: false,
            failure: false,
            message: '',
            filterToDisplay: 'ALL',
            dishId: 0,
            addDish: {
                name: '',
                description: '',
                price: 0,
                type: ''
            }
        };
        this.showAddModal = this.showAddModal.bind(this);
        this.hideAddModal = this.hideAddModal.bind(this);
        this.showActionModal = this.showActionModal.bind(this);
        this.hideActionModal = this.hideActionModal.bind(this);
        this.removeDish = this.removeDish.bind(this);
        this.addDish = this.addDish.bind(this);
        this.editDish = this.editDish.bind(this);
        this.filterDishes = this.filterDishes.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.hideEditModal = this.hideEditModal.bind(this);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    showAddModal(): void {
        this.setState({ showAddModal: true });
    }

    hideAddModal(): void {
        this.setState({ showAddModal: false });
    }

    showActionModal(dish: MenuDish): void {

        this.setState({ showActionModal: true, addDish: dish, dishId: dish.id });
    }

    hideActionModal(): void {
        this.setState({ showActionModal: false });
    }

    showEditModal(): void {
        this.setState({ showEditModal: true, showActionModal: false });
    }

    hideEditModal(): void {
        this.setState({ showEditModal: false });
    }

    removeDish(): void {
        const alert = DangerAlert.getDeleteAlert();
        alert.then((result: any) => {
            if ( result.value ) {
                const id = this.state.dishId;
                axios.delete<ResponseMessage<string>>(`/api/restaurant/menu/${ this.props.restaurantName }/${ id }`)
                     .then(result => {
                         this.setState({ success: true, message: result.data.message });
                     }).catch(reason => {
                    this.setState({ message: 'Error occurred', failure: true });
                });
            }
        });
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        const addDish = this.state.addDish;
        addDish[event.target.name] = event.target.value;
        this.setState(addDish);
    }

    filterDishes(event: { preventDefault: () => void; }, filter: string): void {
        event.preventDefault();
        this.setState({ filterToDisplay: filter });
        if ( filter === 'ALL' ) {
            return this.componentDidMount();
        }
        axios.get<MenuGroup[]>(`/api/restaurant/menu/${ this.props.restaurantName }/${ filter }`)
             .then(result => {
                 this.setState({ menu: result.data });
             });
    }

    addDish(event: { preventDefault: () => void; }): void {
        event.preventDefault();
        axios.post<ResponseMessage<MenuDish>>(`/api/restaurant/menu/${ this.props.restaurantName }`, this.state.addDish)
             .then(result => {
                 this.setState({ success: true, message: result.data.message });
             }).catch(reason => {
            const message = reason.response.data.object[0].message ? reason.response.data.object[0].message : 'Error has occurred';
            this.setState({ message: message, failure: true });
        });
    }

    editDish(event: { preventDefault: () => void; }): void {
        event.preventDefault();
        axios.put<ResponseMessage<string>>(`/api/restaurant/menu/${ this.props.restaurantName }/${ this.state.dishId }`, this.state.addDish)
             .then(result => {
                 this.setState({ success: true, message: result.data.message });
             }).catch(reason => {
            const message = reason.response.data.object[0].message ? reason.response.data.object[0].message : 'Error has occurred';
            this.setState({ message: message, failure: true });
        })
    }

    componentDidMount(): void {
        axios.get<MenuGroup[]>(`/api/restaurant/menu/${ this.props.restaurantName }`).then(result => {
            this.setState({ menu: result.data });
        });
    }

    render() {
        return (
            <>
                <div>
                    <Row className="justify-content-center align-self-center text-center">
                        <ButtonGroup>
                            { this.state.menu.map(({ type }: { type: string }) => {
                                return (
                                    <Button key={ type } variant="secondary" name="filter"
                                            onClick={ e => this.filterDishes(e, type) }>{ type }</Button>
                                )
                            }) }
                            <Button variant="secondary" name="filter"
                                    onClick={ e => this.filterDishes(e, 'ALL') }>{ 'ALL' }</Button>
                        </ButtonGroup>
                    </Row>
                    <Row className="justify-content-center align-self-center text-center">
                        <span
                            className="filter-text">Currently filtering by: { this.state.filterToDisplay }
                        </span>
                    </Row>
                    { this.state.menu.length > 0 ? this.state.menu.map(({ type, dishes }: { type: string, dishes: MenuDish[] }) => {
                        return (
                            <Row key={ type } className="justify-content-center align-self-center">
                                <div className="restaurant-search-result text-center">
                                    <div className="dish-type">
                                        { type }
                                    </div>
                                    { dishes.map((dish: MenuDish) => {
                                        return (
                                            <div key={ dish.id } className="single-dish">
                                                <div
                                                    onClick={ () => this.showActionModal(dish) }>{ dish.name + ' (' + dish.price + ')' }</div>
                                                <div
                                                    onClick={ () => this.showActionModal(dish) }>{ dish.description }</div>
                                            </div>
                                        )
                                    }) }
                                </div>
                            </Row>
                        )
                    }) : <span>Menu is not available</span> }
                    <Row className="justify-content-center align-self-center">
                        <button className="btn btn-primary" onClick={ this.showAddModal }>Add dish to menu</button>
                    </Row>
                </div>
                <Modal show={ this.state.showActionModal } onHide={ this.hideActionModal }>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">
                            Dish's actions
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span>
                            <button className="btn btn-info" onClick={ this.showEditModal }>Edit</button>
                            &nbsp;
                            <button className="btn btn-danger" onClick={ this.removeDish }>Remove</button>
                        </span>
                    </Modal.Body>
                </Modal>
                <Modal show={ this.state.showAddModal } onHide={ this.hideAddModal }>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">
                            Add dish to menu
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={ this.addDish }>
                            <Form.Group>
                                <Form.Label>
                                    Name
                                </Form.Label>
                                <Form.Control required type="text" name="name" onChange={ this.handleInputChange }/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Description
                                </Form.Label>
                                <Form.Control required type="text" name="description"
                                              onChange={ this.handleInputChange }/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Price
                                </Form.Label>
                                <Form.Control required type="number" step="0.01" min="0.01" name="price"
                                              onChange={ this.handleInputChange }/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Type
                                </Form.Label>
                                <Form.Control as="select" name="type" required custom defaultValue={ "" }
                                              onChange={ this.handleInputChange }>
                                    <option value="">Choose type</option>
                                    { this.state.menu.map(({ type }: { type: string }) => {
                                        return (
                                            <option key={ type } value={ type }>{ type }</option>
                                        )
                                    }) }
                                </Form.Control>
                            </Form.Group>
                            <FormGroup>
                                <Col sm={ 4 }>
                                    <Button type="submit">
                                        Submit
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={ this.state.showEditModal } onHide={ this.hideEditModal }>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">
                            Edit dish
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={ this.editDish }>
                            <Form.Group>
                                <Form.Label>
                                    Name
                                </Form.Label>
                                <Form.Control required type="text" name="name" onChange={ this.handleInputChange }
                                              value={ this.state.addDish.name }/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Description
                                </Form.Label>
                                <Form.Control required type="text" name="description"
                                              onChange={ this.handleInputChange }
                                              value={ this.state.addDish.description }/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Price
                                </Form.Label>
                                <Form.Control required type="number" step="0.01" min="0.01" name="price"
                                              onChange={ this.handleInputChange }
                                              value={ this.state.addDish.price }/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Type
                                </Form.Label>
                                <Form.Control as="select" name="type" required custom
                                              value={ this.state.addDish.type }
                                              onChange={ this.handleInputChange }>
                                    <option
                                        value={ this.state.addDish.type }>{ this.state.addDish.type }</option>
                                    { this.state.menu.map(({ type }: { type: string }) => {
                                        return (
                                            <option key={ type } value={ type }>{ type }</option>
                                        )
                                    }) }
                                </Form.Control>
                            </Form.Group>
                            <FormGroup>
                                <Col sm={ 4 }>
                                    <Button type="submit">
                                        Submit
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                { this.state.success &&
                <SweetAlert success title="Success!" confirmBtnBsStyle={ 'info' } timeout={ 20000 }
                            onConfirm={ () => window.location.reload() }>
                    <span>{ this.state.message }</span>
                </SweetAlert> }
                { this.state.failure &&
                <SweetAlert error title="Something went wrong" confirmBtnBsStyle={ 'info' } timeout={ 20000 }
                            onConfirm={ () => window.location.reload() }>
                    <span>{ this.state.message }</span>
                </SweetAlert> }
            </>
        )
    }
}
