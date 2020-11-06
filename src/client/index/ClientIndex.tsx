import React from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import './ClientIndex.less';

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
            const data = result.data;
            if ( data.length > 0 ) {
                this.setState({ restaurants: result.data, loaded: true });
            } else {
                this.setState({ restaurants: [], loaded: true });
            }
        });
    }

    render() {
        return (
            <>
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
                { this.state.loaded && this.state.restaurants.length > 0 && this.state.restaurants.map((restaurant: string) => {
                    return (
                        <Row key={ restaurant } className="justify-content-center align-self-center">
                            <div className="restaurant-search-result text-center">
                                <div className="restaurant-link"><a href="#">{ restaurant }</a>
                                </div>
                                <div className="review-link"><a href={ `/client/reviews/${ restaurant }` }>View
                                    reviews</a></div>
                            </div>
                        </Row>
                    )
                }) }
                { this.state.loaded && this.state.restaurants.length === 0 &&
                <Row className="justify-content-center align-self-center">
                    <div className="restaurant-search-result text-center">No restaurants match search criteria</div>
                </Row> }
            </>
        )
    }
}
