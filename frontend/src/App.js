import React, {Component} from "react";
import Modal from "./components/Modal";
import  axios from "axios";
import GLOBAL_URL from "./utils/GlobalConstants"



class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            modal: false,
            viewCompleted: false,
            todoList: [],
            activeItem: {
                title : "",
                description: "",
                completed: false

            }
        };

    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {

        axios.get(GLOBAL_URL).then((response) => {
            this.setState({todoList: response.data})
        }).catch((error) => {
            console.log(error);
        })
    };

    toggle = () => {
        this.setState({modal : !this.state.modal});
    };

    handleSubmit = item => {
        console.log("reached: "+JSON.stringify(item));
        this.toggle();
        if(item.id){
            axios.put(`${GLOBAL_URL}/${item.id}/`, item)
                .then((response) => {
                    console.log(response);
                    this.refreshList();
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    };

    createItem = () => {
        const item = {title: "", description: "", completed: false};
        this.setState({activeItem: item, modal: !this.state.modal});
    };

    viewItem = (id) => {
        // get item by id
        const item = {title: "", description: "", completed: false};
        this.setState({activeItem: item, modal: !this.state.modal});
    };

    displayCompleted = status => {
        if(status){
            return this.setState({viewCompleted: true});
        }

        return this.setState({viewCompleted: false});
    };

    renderTabList = () => {
        return (
            <div className="my-5 tab-list">
                <span onClick={() => this.displayCompleted(true)}
                      className={this.state.viewCompleted ? "active" : ""}> complete transactions </span>
                <span onClick={() => {this.displayCompleted(false)}}
                      className={this.state.viewCompleted ? "" : "active"}>incomplete transactions</span>
            </div>
        );
    };

    renderItems = () => {
        const {viewCompleted} = this.state;
        const newItems = this.state.todoList.filter(
            item => item.completed === viewCompleted
        );

        return newItems.map(item => (
            <li key={item.id} className={"list-group-item d-flex justify-content-between align-items-center"}>
                <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`}
                      title={item.description}>
                    {item.title}
                </span>
                <span>
                    <button className= "btn btn-secondary mr-2">View</button>
                    <button className= "btn btn-danger">Download PDF</button>
                </span>
            </li>
        ));
    };

    render() {
        return(
            <main className="content">
                <h1 className= "text-white text-uppercase text-center my-4">Bank app</h1>
                <div className= "row">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <div className="">
                                <button className="btn btn-primary" onClick={this.createItem}>Add transaction</button>
                            </div>
                            {this.renderTabList()}
                            <ul className="list-group list-group-flush">
                                {this.renderItems()}
                            </ul>
                        </div>
                    </div>
                </div>
                {
                    this.state.modal ? (
                        <Modal activeItem = {this.state.activeItem}
                               toggle ={this.toggle}
                               onSave={this.handleSubmit}
                        />
                    ) : null
                }
            </main>
        );
    }

}

export default App;