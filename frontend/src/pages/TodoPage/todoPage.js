import React from "react";
import axios from "axios";
import AddTodo from "../../components/AddTodo";
import TodoList from "../../components/TodoList";

export default class TodoPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        todos: [],
      };
    }
  
    componentDidMount() {
      // DECOMMENTER PR TRAVAILLER EN LOCAL
      //axios.defaults.baseURL = 'http://localhost:4000';

      axios
        .get("/api")
        .then((response) => {
          this.setState({
            todos: response.data.data,
          });
        })
        .catch((e) => console.log("Error : ", e));
    }
  
    handleAddTodo = (value) => {
      axios
        .post("/api/todos", { text: value })
        .then(() => {
          this.setState({
            todos: [...this.state.todos, { text: value }],
          });
        })
        .catch((e) => console.log("Error : ", e));
    };
  
    render() {
      return (
        <div className="App container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12 col-sm-8 col-md-8 offset-md-2">
                <h1>Todos</h1>
                <div className="todo-app">
                
                  <AddTodo handleAddTodo={this.handleAddTodo} />
                  <TodoList todos={this.state.todos} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }