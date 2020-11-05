import React from "react";
import './RestaurantsDashboard.less';
import axios from "axios";
import {Button, Col, Form, FormControl, FormGroup, Modal} from "react-bootstrap";
import {
    restaurantCityCountryValidation,
    restaurantNameValidation, restaurantPhoneNumberValidation,
    restaurantStreetValidation, restaurantTagsValidation, restaurantZipCodeValidation
} from "../utils/validation/restaurant/RestaurantValidator";
import {validateEditForm, validateForm} from "../utils/validation/shared/SharedValidation";
import SweetAlert from "react-bootstrap-sweetalert";
import DeleteAlert from "../utils/swal/DeleteAlert";

export default class RestaurantsDashboard extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            restaurants: [],
            restaurantId: '',
            restaurantName: '',
            street: '',
            city: '',
            country: '',
            zipCode: '',
            phoneNumber: '',
            tags: '',
            show: false,
            errors: {
                restaurantName: '',
                street: '',
                city: '',
                country: '',
                zipCode: '',
                phoneNumber: '',
                tags: '',
            },
            isFormValid: false,
            success: false,
            message: '',
            failure: false
        }
        this.deleteRestaurant = this.deleteRestaurant.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    showModal() {
        this.setState({show: true});
    }

    showEditModal(event: any, restaurant: any) {
        const recordToEdit = this.state.restaurants.filter((item: any) => item.id === restaurant.id)[0];

        this.setState({
            show: true,
            restaurantId: recordToEdit.id,
            restaurantName: recordToEdit.name,
            street: recordToEdit.address.street,
            city: recordToEdit.address.city,
            country: recordToEdit.address.country,
            zipCode: recordToEdit.address.zipCode,
            phoneNumber: recordToEdit.phoneNumber,
            tags: recordToEdit.tags,
            isFormValid: true
        });
    }

    hideModal() {
        this.setState({
            show: false,
            restaurantId: '',
            restaurantName: '',
            street: '',
            city: '',
            country: '',
            zipCode: '',
            phoneNumber: '',
            tags: '',
            errors: {
                restaurantName: '',
                street: '',
                city: '',
                country: '',
                zipCode: '',
                phoneNumber: '',
                tags: ''
            },
            isFormValid: false,
            isEdit: false
        });
    }

    handleInputChange(event: { target: { name: any; value: any; }; }) {
        const {name, value} = event.target;
        this.setState({
            name, value
        });
        let errors = this.state.errors;

        switch (name) {
            case 'restaurantName':
                errors.restaurantName = restaurantNameValidation(value)
                if(!this.state.restaurantId){
                    axios.get(`/api/restaurant/checkByName/${value}`)
                        .then((res) => {
                            if (res.data === true) {
                                this.setState({
                                    ...this.state,
                                    errors: {...this.state.errors, restaurantName: "Name is already taken"}
                                })
                            } else {
                                errors.restaurantName = null;
                            }
                        }).catch(() => {
                    })
                }
                break;
            case 'street':
                errors.street = restaurantStreetValidation(value)
                break;
            case 'city':
                errors.city = restaurantCityCountryValidation(value, true)
                break;
            case 'country':
                errors.country = restaurantCityCountryValidation(value, false)
                break;
            case 'zipCode':
                errors.zipCode = restaurantZipCodeValidation(value)
                break;
            case 'phoneNumber':
                errors.phoneNumber = restaurantPhoneNumberValidation(value)
                if(!this.state.restaurantId && value !=='' ){
                    axios.get(`/api/restaurant/checkByPhone/${value}`)
                        .then((res) => {
                            if (res.data === true) {
                                this.setState({
                                    ...this.state,
                                    errors: {...this.state.errors, phoneNumber: "Phone number is already taken"}
                                })
                            } else {
                                errors.phoneNumber = null;
                            }
                        }).catch(() => {
                    })
                }
                break;
            case 'tags':
                errors.tags = restaurantTagsValidation(value);
                break;
            default:
                break;
        }

        this.setState({errors, [name]: value});
        if (this.state.restaurantId) {
            this.setState({isFormValid: !validateEditForm(this.state.errors)})
        } else {
            this.setState({isFormValid: validateForm(this.state.errors)})
        }
    }

    handleSubmit(event: { preventDefault: () => void; }) {
        const formItem = {
            id: this.state.restaurantId,
            name: this.state.restaurantName,
            address: {
                street: this.state.street,
                city: this.state.city,
                country: this.state.country,
                zipCode: this.state.zipCode,
            },
            phoneNumber: this.state.phoneNumber,
            tags: this.state.tags.split(',')
        };

        if (formItem.id) {
            axios.put(`/api/restaurant/${formItem.id}`, {
                'name': formItem.name,
                'address': formItem.address,
                'phoneNumber': formItem.phoneNumber,
                'tags': formItem.tags === '' ? null : formItem.tags
            }).then(res => {
                this.setState({...this.state, success: true, message: res.data.message})
                this.setState((prevState: { restaurants: any[]; }) => ({
                    restaurants: prevState.restaurants.map(item => {
                        if (item.id === formItem.id)
                            return formItem;
                        else
                            return item;
                    })
                }));
            }).catch(reason => {
                this.setState({...this.state, failure: true, message: reason.message})
            });

        } else {
            axios.post('/api/restaurant', {
                'name': formItem.name,
                'address': formItem.address,
                'phoneNumber': formItem.phoneNumber,
                'tags': formItem.tags === '' ? null : formItem.tags
            }).then(res => {
                this.setState({...this.state, success: true, message: res.data.message})
                this.setState((prevState: { restaurants: any[]; }) => ({
                    restaurants: prevState.restaurants.concat(formItem)
                }));
            }).catch(reason => {
                this.setState({...this.state, failure: true, message: reason.message})
            });
        }

        this.setState({
            show: false,
            restaurantId: '',
            restaurantName: '',
            street: '',
            city: '',
            country: '',
            zipCode: '',
            phoneNumber: '',
            errors: {
                restaurantName: '',
                street: '',
                city: '',
                country: '',
                zipCode: '',
                phoneNumber: ''
            }
        });
        event.preventDefault();
    }

    componentDidMount() {
        axios.get('/api/restaurant')
            .then((event) => {
                this.setState({
                    ...this.state,
                    restaurants: event.data
                })
            }).catch(() => {
        })
    }

    deleteRestaurant(restaurantId: number) {
        const alert = DeleteAlert.getDeleteAlert();
        alert.then((result: any) => {
            if (result.value) {
                axios.delete(`/api/restaurant/${restaurantId}`)
                    .then(res => {
                        this.setState({...this.state, success: true, message: res.data.message})
                        const restaurants = this.state.restaurants.filter((item: any) => item.id !== restaurantId);
                        this.setState({
                            ...this.state,
                            restaurants
                        })
                    }).catch(reason => {
                    this.setState({...this.state, failure: true, message: reason.message})
                });
            }
        })
    }

    render() {
        const {isFormValid, errors} = this.state;
        return (
            <>
                <div className="row mb-1">
                    <div className="col-md-9 mb-0">
                        <div className="tableFixHead">
                            <table className="table table-hover restaurantTable text-center">
                                <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Street</th>
                                    <th scope="col">City</th>
                                    <th scope="col">Country</th>
                                    <th scope="col">Zip code</th>
                                    <th scope="col">Phone number</th>
                                    <th scope="col">Tags</th>
                                    <th scope="col"/>
                                    <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(this.state.restaurants.length > 0) ? this.state.restaurants.map((restaurant: any, index: any) => {
                                    return (
                                        <tr key={index}>
                                            <td>{restaurant.name}</td>
                                            <td>{restaurant.address.street}</td>
                                            <td>{restaurant.address.city}</td>
                                            <td>{restaurant.address.country}</td>
                                            <td>{restaurant.address.zipCode}</td>
                                            <td>{restaurant.phoneNumber}</td>
                                            <td>{restaurant.tags.join(',')}</td>
                                            <td><a href={ `/restaurant/images/${ restaurant.name }` }>
                                                <button className="btn btn-primary">Photos</button>
                                            </a></td>
                                            <td>
                                                <button className="btn btn-dark mr-3"
                                                        onClick={(e) => this.showEditModal(e, restaurant)}>
                                                    Update
                                                </button>
                                                <button className="btn btn-danger"
                                                        onClick={() => this.deleteRestaurant(restaurant.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }) : <tr>
                                    <td colSpan={7}>There are no restaurants</td>
                                </tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-auto">
                        <button onClick={() => this.showModal()}
                                className="btn btn-secondary float-right">Add Restaurant
                        </button>
                    </div>
                </div>
                <Modal
                    show={this.state.show}
                    onHide={this.hideModal}
                    dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title
                            id="contained-modal-title-lg "
                            className="text-center"
                        >
                            Restaurant
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Text>{errors.restaurantName}</Form.Text>
                                    <FormControl
                                        type="Text"
                                        placeholder="Restaurant name"
                                        name="restaurantName"
                                        value={this.state.restaurantName}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Street</Form.Label>
                                    <Form.Text>{errors.street}</Form.Text>
                                    <FormControl
                                        type="Text"
                                        placeholder="Street"
                                        name="street"
                                        value={this.state.street}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Form.Label>City</Form.Label>
                                    <Form.Text>{errors.city}</Form.Text>
                                    <FormControl
                                        type="Text"
                                        placeholder="City"
                                        name="city"
                                        value={this.state.city}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Country</Form.Label>
                                    <Form.Text>{errors.country}</Form.Text>
                                    <FormControl
                                        type="Text"
                                        placeholder="Country"
                                        name="country"
                                        value={this.state.country}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Zip code</Form.Label>
                                    <Form.Text>{errors.zipCode}</Form.Text>
                                    <FormControl
                                        type="Text"
                                        placeholder="Zip code"
                                        name="zipCode"
                                        value={this.state.zipCode}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Phone number</Form.Label>
                                    <Form.Text>{errors.phoneNumber}</Form.Text>
                                    <FormControl
                                        type="Text"
                                        placeholder="Phone number"
                                        name="phoneNumber"
                                        value={this.state.phoneNumber}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Tags</Form.Label>
                                    <Form.Text>{ errors.tags }</Form.Text>
                                    <FormControl type="Text" placeholder="Tags" name="tags"
                                                 value={ this.state.tags } onChange={ this.handleInputChange }/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={4}>
                                    <Button type="submit" disabled={!isFormValid}>
                                        Submit
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                {this.state.success &&
                <SweetAlert success title="Success!" confirmBtnBsStyle={'info'} timeout={20000}
                            onConfirm={() => this.setState({success: false})}>
                    <span>{this.state.message}</span>
                </SweetAlert>}
                {this.state.failure &&
                <SweetAlert error title="Something went wrong" confirmBtnBsStyle={'info'} timeout={20000}
                            onConfirm={() => this.setState({failure: false})}>
                    <span>{this.state.message}</span>
                </SweetAlert>}
            </>
        )
    }

}
