import React from "react";
import axios from "axios";
import {Button, Col, Form, FormControl, FormGroup, Modal, Row} from "react-bootstrap";
import './ClientIndex.less';
import LoggedHeader from "../../shared/header/LoggedHeader";
import {RestaurantSearch} from "./RestaurantSearch";
import {PhotoConsumer, PhotoProvider} from "react-photo-view";
import OpenHour from "../../restaurant/openHours/OpenHour";
import SweetAlert from "react-bootstrap-sweetalert";

export default class ClientIndex extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            tags: [],
            selectedTags: [],
            restaurantName: '',
            restaurants: [],
            loaded: false,
            show: false,
            reservationTime: '',
            reservationDate: '',
            personsCount: 0,
            reservationRestaurant: '',
            restaurantOpenHours: [],
            success: false,
            message: '',
            failure: false,
            chatMessage: '',
            showMessageModal: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRestaurantNameChange = this.handleRestaurantNameChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.makeReservation = this.makeReservation.bind(this);
        this.openMessageModal = this.openMessageModal.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    componentDidMount() {
        axios.get<string[]>('/api/client/search').then(result => this.setState({tags: result.data}));
        axios.post<string[]>('/api/client/search', {
            'restaurantName': '',
            'tags': []
        }).then(result => {
            let promises: any = [];
            const data = result.data;
            let searchResult: RestaurantSearch[] = [];

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    promises.push(axios.get(`/api/client/images/${data[i]}`, {responseType: 'arraybuffer'})
                        .then(result => {
                            const base64 = btoa(new Uint8Array(result.data).reduce((data, byte) => data + String.fromCharCode(byte), ''),);
                            searchResult.push(new RestaurantSearch(data[i], `data:;base64,${base64}`));
                        }).catch(reason => {
                            searchResult.push(new RestaurantSearch(data[i], ''));
                        }));
                }
                Promise.all(promises).then(() => this.setState({restaurants: searchResult, loaded: true}));
            } else {
                this.setState({restaurants: [], loaded: true});
            }
        });
    }


    showModal(restaurantName: string) {
        axios.get<OpenHour[]>(`/api/client/openHours/${restaurantName}`)
            .then(result => {
                result.data.sort(function (a: OpenHour, b: OpenHour) {
                    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
                    return daysOfWeek.indexOf(a.dayOfWeek.toLowerCase()) - daysOfWeek.indexOf(b.dayOfWeek.toLowerCase());
                })
                this.setState({restaurantOpenHours: result.data});
            });
        this.setState({show: true, reservationRestaurant: restaurantName});
    }

    openMessageModal(restaurantName: string) {
        this.setState({showMessageModal: true, reservationRestaurant: restaurantName});
    }

    hideModal() {
        this.setState({
            show: false,
            reservationTime: '',
            reservationDate: '',
            personsCount: 0,
            reservationRestaurant: '',
            restaurantOpenHours: [],
            chatMessage: '',
            showMessageModal: false
        });
    }

    handleInputChange(event: { target: { name: any; value: any; }; }) {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });
    }

    handleRestaurantNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
        event.preventDefault();
        this.setState({restaurantName: event.target.value});
    }

    handleTagsChange(event: React.ChangeEvent<HTMLInputElement>, tag: string): void {
        let tags = this.state.selectedTags;
        if (event.target.checked) {
            tags.push(tag);
        } else {
            tags = tags.filter((entry: string) => entry !== tag);
        }
        this.setState({selectedTags: tags});
    }

    handleSubmit(event: { preventDefault: () => void; }): void {
        event.preventDefault();
        axios.post<string[]>('/api/client/search', {
            'restaurantName': this.state.restaurantName,
            'tags': this.state.selectedTags
        }).then(result => {
            let promises: any = [];
            const data = result.data;
            let searchResult: RestaurantSearch[] = [];

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    promises.push(axios.get(`/api/client/images/${data[i]}`, {responseType: 'arraybuffer'})
                        .then(result => {
                            const base64 = btoa(new Uint8Array(result.data).reduce((data, byte) => data + String.fromCharCode(byte), ''),);
                            searchResult.push(new RestaurantSearch(data[i], `data:;base64,${base64}`));
                        }).catch(reason => {
                            searchResult.push(new RestaurantSearch(data[i], ''));
                        }));
                }
                Promise.all(promises).then(() => this.setState({restaurants: searchResult, loaded: true}));
            } else {
                this.setState({restaurants: [], loaded: true});
            }
        });
    }

    makeReservation(event: { preventDefault: () => void; }): void {
        event.preventDefault();
        axios.post('/api/client/reservations', {
            'reservationDate': this.state.reservationDate.split('-').reverse().join('-'),
            'reservationTime': this.state.reservationTime,
            'personsCount': this.state.personsCount,
            'restaurantName': this.state.reservationRestaurant
        }).then(res => {
            this.setState({...this.state, success: true, message: res.data.message})
        }).catch(reason => {
                this.setState({...this.state, failure: true, message: reason.message})
            }
        );
    }

    sendMessage(event: { preventDefault: () => void; }): void {
        event.preventDefault();
        axios.get(`api/client/owner/${this.state.reservationRestaurant}`).then((res) => {
                axios.post(`api/secured/messages`, {
                    author: localStorage.getItem('username'),
                    recipient: res.data,
                    content: this.state.chatMessage,
                    timestamp: new Date().toLocaleDateString("en") + " " + new Date().toLocaleTimeString().slice(0, 5)
                }).then(res => {
                    this.setState({...this.state, success: true, message: 'Message sent!'})
                }).catch(reason => {
                        this.setState({...this.state, failure: true, message: reason.message})
                    }
                );
            }
        )
    }


    render() {
        return (
            <>
                <LoggedHeader text={"Client"} link={"/client"}/>
                <Row className="justify-content-center align-self-center text-center">
                    <div>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Form.Group>
                                    <Col>
                                        <Form.Control type="text" name="restaurantName" placeholder="Restaurant's name"
                                                      onChange={this.handleRestaurantNameChange}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group>
                                    <Col>
                                        {this.state.tags.length > 0 && this.state.tags.map((tag: string) => {
                                            return (
                                                <Form.Check className="check-tags" custom id={tag} key={tag}
                                                            type={"checkbox"} label={tag}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleTagsChange(e, tag)}/>
                                            )
                                        })}
                                    </Col>
                                </Form.Group>
                                <Form.Group>
                                    <Col>
                                        <Button type="submit">
                                            Search
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </Row>
                        </Form>
                    </div>
                </Row>
                <PhotoProvider>
                    {this.state.loaded && this.state.restaurants.length > 0 && this.state.restaurants.map((restaurantSearch: RestaurantSearch) => {
                        return (
                            <Row key={restaurantSearch.name} className="justify-content-center align-self-center">
                                <div className="restaurant-search-result text-center">
                                    <div className="restaurant-link"><a href="#">{restaurantSearch.name}</a>
                                    </div>
                                    <div className="row justify-content-center">
                                        <div className="review-link m-1"><a
                                            href={`/client/reviews/${restaurantSearch.name}`}>
                                            <button className="btn btn-dark">
                                                Reviews
                                            </button>
                                        </a></div>
                                        <div className="review-link m-1">
                                            <button className="btn btn-dark"
                                                    onClick={(e) => this.showModal(restaurantSearch.name)}>
                                                Book it
                                            </button>
                                        </div>
                                        <div className="review-link m-1">
                                            <a href={`/client/menu/${restaurantSearch.name}`}>
                                                <button className="btn btn-dark">
                                                    Menu
                                                </button>
                                            </a>
                                        </div>
                                        <div className="review-link m-1">
                                            <button className="btn btn-dark"
                                                    onClick={(e) => this.openMessageModal(restaurantSearch.name)}>
                                                Chat
                                            </button>
                                        </div>
                                    </div>
                                    <div>

                                        {restaurantSearch.photo !== '' ? <PhotoConsumer src={restaurantSearch.photo}
                                                                                        intro={restaurantSearch.name}>
                                            <img className='restaurant-image' src={restaurantSearch.photo}
                                                 alt={restaurantSearch.name}/>
                                        </PhotoConsumer> : 'Error while getting image or image does not exist'}
                                    </div>
                                </div>
                            </Row>
                        )
                    })}
                </PhotoProvider>
                {this.state.loaded && this.state.restaurants.length === 0 &&
                <Row className="justify-content-center align-self-center">
                    <div className="restaurant-search-result text-center">No restaurants match search criteria</div>
                </Row>}
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
                        <h5 className="font-weight-bold">Restaurant's open times</h5>
                        {this.state.restaurantOpenHours.length > 0 && this.state.restaurantOpenHours.map((openHour: OpenHour, key: any) => {
                            return (
                                <div key={key}>
                                    <p>{openHour.dayOfWeek + ": " + openHour.openTime + "-" + openHour.closeTime}</p>
                                </div>
                            )
                        })}
                        <Form onSubmit={this.makeReservation}>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Reservation time</Form.Label>
                                    <FormControl type="time" name="reservationTime"
                                                 value={this.state.reservationTime}
                                                 onChange={this.handleInputChange}
                                                 required
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Reservation date</Form.Label>
                                    <FormControl type="date" name="reservationDate"
                                                 min={new Date().toISOString().slice(0, 10)}
                                                 value={this.state.reservationDate}
                                                 onChange={this.handleInputChange}
                                                 required
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Persons count</Form.Label>
                                    <FormControl
                                        type="number"
                                        placeholder="Persons count"
                                        name="personsCount"
                                        min="1"
                                        value={this.state.personsCount}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col sm={4}>
                                    <Button type="submit">
                                        Submit
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={this.state.showMessageModal}
                    onHide={this.hideModal}
                    dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title
                            id="contained-modal-title-lg "
                            className="text-center"
                        >
                            Write message to {this.state.reservationRestaurant}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.sendMessage}>
                            <FormGroup>
                                <Col>
                                    <Form.Label>Message</Form.Label>
                                    <FormControl type="textarea" name="chatMessage"
                                                 as="textarea" rows={3}
                                                 value={this.state.chatMessage}
                                                 onChange={this.handleInputChange}
                                                 required
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={4}>
                                    <Button type="submit">
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
