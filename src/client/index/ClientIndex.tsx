import React from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import './ClientIndex.less';
import LoggedHeader from "../../shared/header/LoggedHeader";
import { RestaurantSearch } from "./RestaurantSearch";
import { PhotoConsumer, PhotoProvider } from "react-photo-view";

export default class ClientIndex extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = { tags: [], selectedTags: [], restaurantName: '', restaurants: [], loaded: false };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRestaurantNameChange = this.handleRestaurantNameChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    componentDidMount() {
        axios.get<string[]>('/api/client/search').then(result => this.setState({ tags: result.data }));
        axios.post<string[]>('/api/client/search', {
            'restaurantName': '',
            'tags': []
        }).then(result => {
            let promises: any = [];
            const data = result.data;
            let searchResult: RestaurantSearch[] = [];

            if ( data.length > 0 ) {
                for ( let i = 0; i < data.length; i++ ) {
                    promises.push(axios.get(`/api/client/images/${ data[i] }`, { responseType: 'arraybuffer' })
                                       .then(result => {
                                           const base64 = btoa(new Uint8Array(result.data).reduce((data, byte) => data + String.fromCharCode(byte), ''),);
                                           searchResult.push(new RestaurantSearch(data[i], `data:;base64,${ base64 }`));
                                       }).catch(reason => {
                        searchResult.push(new RestaurantSearch(data[i], ''));
                    }));
                }
                Promise.all(promises).then(() => this.setState({ restaurants: searchResult, loaded: true }));
            } else {
                this.setState({ restaurants: [], loaded: true });
            }
        });
    }

    handleRestaurantNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
        event.preventDefault();
        this.setState({ restaurantName: event.target.value });
    }

    handleTagsChange(event: React.ChangeEvent<HTMLInputElement>, tag: string): void {
        let tags = this.state.selectedTags;
        if ( event.target.checked ) {
            tags.push(tag);
        } else {
            tags = tags.filter((entry: string) => entry !== tag);
        }
        this.setState({ selectedTags: tags });
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

            if ( data.length > 0 ) {
                for ( let i = 0; i < data.length; i++ ) {
                    promises.push(axios.get(`/api/client/images/${ data[i] }`, { responseType: 'arraybuffer' })
                                       .then(result => {
                                           const base64 = btoa(new Uint8Array(result.data).reduce((data, byte) => data + String.fromCharCode(byte), ''),);
                                           searchResult.push(new RestaurantSearch(data[i], `data:;base64,${ base64 }`));
                                       }).catch(reason => {
                        searchResult.push(new RestaurantSearch(data[i], ''));
                    }));
                }
                Promise.all(promises).then(() => this.setState({ restaurants: searchResult, loaded: true }));
            } else {
                this.setState({ restaurants: [], loaded: true });
            }
        });
    }

    render() {
        return (
            <>
                <LoggedHeader text={ "Client" } link={ "/client" }/>
                <Row className="justify-content-center align-self-center text-center">
                    <div>
                        <Form onSubmit={ this.handleSubmit }>
                            <Row>
                                <Form.Group>
                                    <Col>
                                        <Form.Control type="text" name="restaurantName" placeholder="Restaurant's name"
                                                      onChange={ this.handleRestaurantNameChange }/>
                                    </Col>
                                </Form.Group>
                                <Form.Group>
                                    <Col>
                                        { this.state.tags.length > 0 && this.state.tags.map((tag: string) => {
                                            return (
                                                <Form.Check className="check-tags" custom id={ tag } key={ tag }
                                                            type={ "checkbox" } label={ tag }
                                                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => this.handleTagsChange(e, tag) }/>
                                            )
                                        }) }
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
                    { this.state.loaded && this.state.restaurants.length > 0 && this.state.restaurants.map((restaurantSearch: RestaurantSearch) => {
                        return (
                            <Row key={ restaurantSearch.name } className="justify-content-center align-self-center">
                                <div className="restaurant-search-result text-center">
                                    <div className="restaurant-link"><a href="#">{ restaurantSearch.name }</a>
                                    </div>
                                    <div className="review-link"><a
                                        href={ `/client/reviews/${ restaurantSearch.name }` }>View
                                        reviews</a></div>
                                    <div>
                                        { restaurantSearch.photo !== '' ? <PhotoConsumer src={ restaurantSearch.photo }
                                                                                         intro={ restaurantSearch.name }>
                                            <img className='restaurant-image' src={ restaurantSearch.photo }
                                                 alt={ restaurantSearch.name }/>
                                        </PhotoConsumer> : 'Error while getting image or image does not exist' }
                                    </div>
                                </div>
                            </Row>
                        )
                    }) }
                </PhotoProvider>
                { this.state.loaded && this.state.restaurants.length === 0 &&
                <Row className="justify-content-center align-self-center">
                    <div className="restaurant-search-result text-center">No restaurants match search criteria</div>
                </Row> }
            </>
        )
    }
}
