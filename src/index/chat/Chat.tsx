import React from "react";
import "./Chat.less"
import axios from "axios";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import SweetAlert from "react-bootstrap-sweetalert";


let Stomp = require('stompjs');
const SockJS = require('sockjs-client');

let stompClient: any = null;
let currentUser: string | null = "";
export default class Chat extends React.Component<any, any> {
    private messagesEnd: any;

    constructor(props: any) {
        super(props)
        this.state = {
            text: '',
            contacts: [],
            activeContact: "",
            messages: [],
            connected: false
        }
        this.connect = this.connect.bind(this);
        this.findChatMessages = this.findChatMessages.bind(this);
        this.loadContacts = this.loadContacts.bind(this)
        this.onConnected = this.onConnected.bind(this)
        this.onError = this.onError.bind(this)
        this.onMessageReceived = this.onMessageReceived.bind(this)
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    connect() {
        let sockJs = new SockJS("/api/ws");
        stompClient = Stomp.over(sockJs);
        // do usuniecia
        stompClient.debug = false;
        stompClient.connect({"Authorization": localStorage.getItem('token')}, this.onConnected, this.onError)
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    }

    componentDidUpdate(prevProp: any, prevState: any) {
        this.scrollToBottom();
        if (prevState.activeContact !== this.state.activeContact) {
            this.findChatMessages(this.state.activeContact)
            this.loadContacts();
        }
    }

    componentDidMount() {
        this.scrollToBottom()
        if (localStorage.getItem("token") === null) {
            this.props.history.push("/");
        } else {
            this.connect();
            this.loadContacts();
            currentUser = localStorage.getItem('username');
        }
    }

    onConnected() {
        stompClient.subscribe(
            `/secured/user/${currentUser}/queue/messages`, (msg: any) => {
                this.onMessageReceived(msg)
            }
        );
        this.setState({connected: true})
    };

    onError = (err: any) => {
        console.log(err);
    };

    onMessageReceived(msg: any) {
        const message = JSON.parse(msg.body)
        if (this.state.activeContact === message.author) {
            this.setState({
                ...this.state,
                messages: [...this.state.messages, message]
            })
        }
        this.loadContacts();
    };

    loadContacts() {

        axios.get('api/secured/chats').then(res => {
            this.setState(() => ({
                contacts: res.data.map((item: any) => {
                    if (item.restaurant == currentUser) {
                        return {name: item.client, newMessages: 0}
                    } else {
                        return {name: item.restaurant, newMessages: 0}
                    }
                })
            }));

            if (res.data[0].restaurant == currentUser && this.state.activeContact == "") {
                this.setState({
                    ...this.state,
                    activeContact: res.data[0].client
                })

            } else if (res.data[0].client == currentUser && this.state.activeContact == "") {
                this.setState({
                    ...this.state,
                    activeContact: res.data[0].restaurant
                })

            }

            const requests: any[] = []
            this.state.contacts.forEach((item: any) => {
                const request = axios.get(`api/secured/messages/${item.name}/count`);
                requests.push(request)
            })

            return axios.all(requests)

        }).then(axios.spread((...responses) => {
            this.setState(() => ({
                contacts: this.state.contacts.map((item: any, index: any) => {
                    return {name: item.name, newMessages: responses[index].data}
                })
            }));

        }))

    }

    findChatMessages(recipientUsername: any) {
        axios.get(`/api/secured/messages/${recipientUsername}`).then((res) => {
                this.setState({messages: res.data})
            }
        )
    }

    sendMessage(text: string) {
        if (text.trim() !== "") {
            const message = {
                author: currentUser,
                recipient: this.state.activeContact,
                content: text,
                timestamp: new Date().toLocaleDateString("en") + " " + new Date().toLocaleTimeString().slice(0, 5)
            }
            stompClient.send("/app/secured/chat", {}, JSON.stringify(message));
            this.setState({
                ...this.state,
                messages: [...this.state.messages, message]
            })
        }
    }

    render() {
        return (
            <div className="container py-5 px-4">
                <div className="row rounded-lg overflow-hidden shadow">

                    <div className="col-5 px-0">
                        <div className="bg-white h-100">
                            <div className="bg-gray px-4 py-2 bg-light">
                                <p className="h5 mb-0 py-1">Recent Contacts</p>
                            </div>

                            <div className="messages-box">
                                <div className="list-group rounded-0">

                                    {this.state.contacts.map((contact: any, index: any) => (
                                        <a key={index}
                                           className={this.state.activeContact && contact.name === this.state.activeContact ?
                                               "list-group-item list-group-item-action active text-white rounded-0" : "list-group-item list-group-item-action list-group-item-light rounded-0"}
                                           onClick={() => this.setState({activeContact: contact.name})}>
                                            <div className="media"><img
                                                src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg"
                                                alt="user" width="50" className="rounded-circle"/>
                                                <div className="media-body ml-4">
                                                    <div
                                                        className="d-flex align-items-center justify-content-between mb-1">
                                                        <h6 className="mb-0">{contact.name}</h6>
                                                    </div>
                                                    {contact.newMessages !== undefined &&
                                                    contact.newMessages > 0 && contact.name != this.state.activeContact && (
                                                        <p className="font-italic mb-0 text-bold font-weight-bold text-success"> {contact.newMessages} new
                                                            messages</p>
                                                    )}
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                    {this.state.contacts.length === 0 &&
                                    <p className="font-italic text-center mb-0 text-bold font-weight-bold text-info"> No chat messages</p>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-7 px-0">
                        <div className="bg-gray px-4 py-2 bg-light">
                            <p className="h5 mb-0 py-1 text-center">{this.state.activeContact}</p>
                        </div>
                        <div className="px-4 py-2 chat-box bg-white">
                            {this.state.messages.map((msg: any, index: any) => (
                                <div key={index}
                                     className={msg.author === currentUser ? "media sent w-50 ml-auto mb-3" : "media replies w-50 mb-3"}>
                                    <div className="media-body">
                                        <div id={"msg"} className="rounded py-2 px-3 mb-2">
                                            <p className="text-small mb-0 text-white">{msg.content}</p>
                                        </div>
                                        <p className="small text-muted">{msg.timestamp}</p>
                                    </div>
                                </div>
                            ))}

                            <div style={{float: "left", clear: "both"}}
                                 ref={(el) => {
                                     this.messagesEnd = el;
                                 }}>
                            </div>
                        </div>

                        <div className="input-group">
                            <input
                                name="user_input"
                                placeholder={!this.state.connected ? "Waiting for connection..." : "Write your message..."}
                                value={this.state.text}
                                onChange={(event) => this.setState({text: event.target.value})}
                                onKeyPress={(event) => {
                                    if (event.key === "Enter") {
                                        this.sendMessage(this.state.text);
                                        this.setState({text: ''});
                                    }
                                }}
                                className="form-control rounded-0 border-0 py-4 bg-light"
                                disabled={!this.state.connected}
                            />
                            <div className="input-group-append">
                                <Button
                                    onClick={() => {
                                        this.sendMessage(this.state.text);
                                        this.setState({text: ''});
                                    }}
                                > <FontAwesomeIcon icon={faPaperPlane}/> </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
