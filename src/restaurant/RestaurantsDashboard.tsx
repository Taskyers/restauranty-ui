import React from "react";
import './RestaurantsDashboard.less';
import axios from "axios";
import {Button, Col, Form, FormControl, FormGroup, Modal, Row} from "react-bootstrap";
import {
    restaurantCityCountryValidation,
    restaurantDescriptionValidation,
    restaurantNameValidation,
    restaurantPhoneNumberValidation,
    restaurantStreetValidation,
    restaurantTagsValidation,
    restaurantZipCodeValidation
} from "../utils/validation/restaurant/RestaurantValidator";
import {validateEditForm, validateForm} from "../utils/validation/shared/SharedValidation";
import SweetAlert from "react-bootstrap-sweetalert";
import DangerAlert from "../utils/swal/DangerAlert";
import LoggedHeader from "../shared/header/LoggedHeader";
import OpenHour from "./openHours/OpenHour";
import OpenHours from "./openHours/OpenHours";

export default class RestaurantsDashboard extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            restaurants: [],
            restaurantId: '',
            restaurantName: '',
            description: '',
            capacity: 0,
            street: '',
            city: '',
            country: '',
            zipCode: '',
            phoneNumber: '',
            tags: '',
            openHours: OpenHours,
            show: false,
            errors: {
                restaurantName: '',
                description: '',
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
            failure: false,
            showContentModal: false,
            content: [],
        }
        this.deleteRestaurant = this.deleteRestaurant.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleWeekDaysInputChange = this.handleWeekDaysInputChange.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.findByName = this.findByName.bind(this);
        this.convertToList = this.convertToList.bind(this);
        this.showOpenHours = this.showOpenHours.bind(this);
        this.hideOpenHours = this.hideOpenHours.bind(this);
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
            description: recordToEdit.description,
            capacity: recordToEdit.capacity,
            street: recordToEdit.address.street,
            city: recordToEdit.address.city,
            country: recordToEdit.address.country,
            zipCode: recordToEdit.address.zipCode,
            phoneNumber: recordToEdit.phoneNumber,
            tags: recordToEdit.tags.join(','),
            openHours: this.mapToOpenHours(recordToEdit.openHours),
            isFormValid: true
        });
    }

    mapToOpenHours(list: OpenHour[]) {
        const monday = this.findByName('MONDAY', list) !== -1 ? list[this.findByName('MONDAY', list)] : new OpenHour('MONDAY', '', '');
        const tuesday = this.findByName('TUESDAY', list) !== -1 ? list[this.findByName('TUESDAY', list)] : new OpenHour('TUESDAY', '', '');
        const wednesday = this.findByName('WEDNESDAY', list) !== -1 ? list[this.findByName('WEDNESDAY', list)] : new OpenHour('WEDNESDAY', '', '');
        const thursday = this.findByName('THURSDAY', list) !== -1 ? list[this.findByName('THURSDAY', list)] : new OpenHour('THURSDAY', '', '');
        const friday = this.findByName('FRIDAY', list) !== -1 ? list[this.findByName('FRIDAY', list)] : new OpenHour('FRIDAY', '', '');
        const saturday = this.findByName('SATURDAY', list) !== -1 ? list[this.findByName('SATURDAY', list)] : new OpenHour('SATURDAY', '', '');
        const sunday = this.findByName('SUNDAY', list) !== -1 ? list[this.findByName('SUNDAY', list)] : new OpenHour('SUNDAY', '', '');
        return new OpenHours(monday, tuesday, wednesday, thursday, friday, saturday, sunday)
    }

    findByName(name: string, list: OpenHour[]) {
        return list.findIndex((item: any) => item.dayOfWeek.toUpperCase() === name)
    }

    hideModal() {
        this.setState({
            show: false,
            restaurantId: '',
            restaurantName: '',
            description: '',
            capacity: 0,
            street: '',
            city: '',
            country: '',
            zipCode: '',
            phoneNumber: '',
            tags: '',
            openHours: OpenHours,
            errors: {
                restaurantName: '',
                description: '',
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

    handleWeekDaysInputChange(event: { target: { name: any; value: any; }; }) {
        const {name, value} = event.target;

        const weekDay = name.split('.')[0]

        if (name.includes('open')) {
            this.setState({
                openHours: {
                    ...this.state.openHours,
                    [weekDay]: {
                        ...this.state.openHours[`${weekDay}`],
                        openTime: value
                    }
                }
            });
        } else {
            this.setState({
                openHours: {
                    ...this.state.openHours,
                    [weekDay]: {
                        ...this.state.openHours[`${weekDay}`],
                        closeTime: value
                    }
                }
            });
        }
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
                if (!this.state.restaurantId) {
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
            case 'description':
                errors.description = restaurantDescriptionValidation(value)
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
                if (!this.state.restaurantId && value !== '') {
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

    convertToList(openHours: OpenHours) {
        const list: any = []
        Object.values(openHours).forEach((item: OpenHour) => {
            if (item.openTime !== '' && item.closeTime !== '') {
                list.push(item)
            }
        })

        return list
    }

    handleSubmit(event: { preventDefault: () => void; }) {
        const formItem = {
            id: this.state.restaurantId,
            name: this.state.restaurantName,
            description: this.state.description,
            capacity: this.state.capacity,
            address: {
                street: this.state.street,
                city: this.state.city,
                country: this.state.country,
                zipCode: this.state.zipCode,
            },
            phoneNumber: this.state.phoneNumber,
            tags: this.state.tags.split(','),
            openHours: this.convertToList(this.state.openHours).length === 0 ? [] : this.convertToList(this.state.openHours)
        };

        if (formItem.id) {
            axios.put(`/api/restaurant/${formItem.id}`, {
                'name': formItem.name,
                'description': formItem.description,
                'capacity': formItem.capacity,
                'address': formItem.address,
                'phoneNumber': formItem.phoneNumber,
                'tags': formItem.tags === '' ? [] : formItem.tags,
                'openHours': formItem.openHours
            }).then(res => {
                this.setState({...this.state, success: true, message: res.data.message})
                this.setState((prevState: { restaurants: any[]; }) => ({
                    restaurants: prevState.restaurants.map(item => {
                        if (item.id === formItem.id) {
                            return formItem;
                        } else {
                            return item;
                        }
                    })
                }));
            }).catch(reason => {
                this.setState({...this.state, failure: true, message: reason.message})
            });

        } else {
            axios.post('/api/restaurant', {
                'name': formItem.name,
                'description': formItem.description,
                'capacity': formItem.capacity,
                'address': formItem.address,
                'phoneNumber': formItem.phoneNumber,
                'tags': formItem.tags === '' ? [] : formItem.tags,
                'openHours': formItem.openHours
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
            description: '',
            capacity: 0,
            street: '',
            city: '',
            country: '',
            zipCode: '',
            phoneNumber: '',
            tags: '',
            openHours: OpenHours,
            errors: {
                restaurantName: '',
                description: '',
                street: '',
                city: '',
                country: '',
                zipCode: '',
                phoneNumber: '',
                tags: '',
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
        const alert = DangerAlert.getDeleteAlert();
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

    showOpenHours(content: OpenHour[]): void {
        content.sort(function (a: OpenHour, b: OpenHour) {
            const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            return daysOfWeek.indexOf(a.dayOfWeek.toLowerCase()) - daysOfWeek.indexOf(b.dayOfWeek.toLowerCase());
        })
        this.setState({showContentModal: true, content: content});
    }

    hideOpenHours(): void {
        this.setState({showContentModal: false});
    }

    render() {
        const {isFormValid, errors} = this.state;
        return (
            <>
                <LoggedHeader text={"Restaurant"} link={"/restaurant"}/>
                <div className="row mb-1">
                    <div className="col-md-12 mb-0">
                        <div className="tableFixHead">
                            <table className="table table-hover restaurantTable text-center">
                                <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Capacity</th>
                                    <th scope="col">Street</th>
                                    <th scope="col">City</th>
                                    <th scope="col">Country</th>
                                    <th scope="col">Zip code</th>
                                    <th scope="col">Phone number</th>
                                    <th scope="col">Tags</th>
                                    <th scope="col">Open hours</th>
                                    <th scope="col"/>
                                    <th scope="col"/>
                                    <th scope="col"/>
                                    <th scope="col"/>
                                    <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(this.state.restaurants.length > 0) ? this.state.restaurants.map((restaurant: any, index: any) => {
                                    return (
                                        <tr key={index}>
                                            <td>{restaurant.name}</td>
                                            <td>{restaurant.description}</td>
                                            <td>{restaurant.capacity}</td>
                                            <td>{restaurant.address.street}</td>
                                            <td>{restaurant.address.city}</td>
                                            <td>{restaurant.address.country}</td>
                                            <td>{restaurant.address.zipCode}</td>
                                            <td>{restaurant.phoneNumber}</td>
                                            <td>{restaurant.tags.join(',')}</td>
                                            <td>
                                                <button className="btn btn-primary"
                                                        onClick={() => this.showOpenHours(restaurant.openHours)}>Show
                                                </button>
                                            </td>
                                            <td><a href={`/restaurant/images/${restaurant.name}`}>
                                                <button className="btn btn-primary">Photos</button>
                                            </a></td>
                                            <td><a href={`/restaurant/reviews/${restaurant.name}`}>
                                                <button className="btn btn-primary">Reviews</button>
                                            </a></td>
                                            <td>
                                                <a href={`/restaurant/menu/${restaurant.name}`}>
                                                    <button className="btn btn-primary">Menu</button>
                                                </a>
                                            </td>
                                            <td>
                                                <a href={`/restaurant/reservations/${restaurant.name}`}>
                                                    <button className="btn btn-primary">Reservations</button>
                                                </a>
                                            </td>
                                            <td>
                                                <button className="btn btn-dark"
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
                                    <Form.Label>Description</Form.Label>
                                    <Form.Text>{errors.description}</Form.Text>
                                    <FormControl
                                        type="Text"
                                        placeholder="Restaurant description"
                                        name="description"
                                        value={this.state.description}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Capacity</Form.Label>
                                    <FormControl
                                        type="number"
                                        placeholder="Restaurant capacity"
                                        name="capacity"
                                        min="1"
                                        value={this.state.capacity}
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
                                    <Form.Text>{errors.tags}</Form.Text>
                                    <FormControl type="Text" placeholder="Tags" name="tags"
                                                 value={this.state.tags} onChange={this.handleInputChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Open Hours</Form.Label>
                                    <Row>
                                        <div className="col-sm align-self-center text-center font-weight-bold">
                                            Monday
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Open Time</Form.Label>
                                            <FormControl type="time" name="monday.open"
                                                         value={this.state.openHours?.monday?.openTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Close Time</Form.Label>
                                            <FormControl type="time" name="monday.close"
                                                         value={this.state.openHours?.monday?.closeTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-sm align-self-center text-center font-weight-bold">
                                            Tuesday
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Open Time</Form.Label>
                                            <FormControl type="time" name="tuesday.open"
                                                         value={this.state.openHours?.tuesday?.openTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Close Time</Form.Label>
                                            <FormControl type="time" name="tuesday.close"
                                                         value={this.state.openHours?.tuesday?.closeTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-sm align-self-center text-center font-weight-bold">
                                            Wednesday
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Open Time</Form.Label>
                                            <FormControl type="time" name="wednesday.open"
                                                         value={this.state.openHours?.wednesday?.openTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Close Time</Form.Label>
                                            <FormControl type="time" name="wednesday.close"
                                                         value={this.state.openHours?.wednesday?.closeTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-sm align-self-center text-center font-weight-bold">
                                            Thursday
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Open Time</Form.Label>
                                            <FormControl type="time" name="thursday.open"
                                                         value={this.state.openHours?.thursday?.openTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Close Time</Form.Label>
                                            <FormControl type="time" name="thursday.close"
                                                         value={this.state.openHours?.thursday?.closeTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div className="col-sm align-self-center text-center font-weight-bold">
                                            Friday
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Open Time</Form.Label>
                                            <FormControl type="time" name="friday.open"
                                                         value={this.state.openHours?.friday?.openTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Close Time</Form.Label>
                                            <FormControl type="time" name="friday.close"
                                                         value={this.state.openHours?.friday?.closeTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div className="col-sm align-self-center text-center font-weight-bold">
                                            Saturday
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Open Time</Form.Label>
                                            <FormControl type="time" name="saturday.open"
                                                         value={this.state.openHours?.saturday?.openTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Close Time</Form.Label>
                                            <FormControl type="time" name="saturday.close"
                                                         value={this.state.openHours?.saturday?.closeTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div className="col-sm align-self-center text-center font-weight-bold">
                                            Sunday
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Open Time</Form.Label>
                                            <FormControl type="time" name="sunday.open"
                                                         value={this.state.openHours?.sunday?.openTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                        <div className="col-sm">
                                            <Form.Label>Close Time</Form.Label>
                                            <FormControl type="time" name="sunday.close"
                                                         value={this.state.openHours?.sunday?.closeTime || ''}
                                                         onChange={this.handleWeekDaysInputChange}/>
                                        </div>
                                    </Row>

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
                <Modal show={this.state.showContentModal} onHide={this.hideOpenHours}>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">
                            Restaurant's open hours
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {(this.state.content?.length > 0) ? this.state.content.map((openHour: any, index: any) => {
                            return (
                                <p key={index}
                                   className="text-center ">{openHour.dayOfWeek + ': '}<br/>{openHour.openTime + '-' + openHour.closeTime}
                                    <br/></p>
                            )
                        }) : <p>No open hours </p>}
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
