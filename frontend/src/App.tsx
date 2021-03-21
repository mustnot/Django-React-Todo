import React from "react";
import "./App.css";

interface Task {
  id: number | null;
  title: string;
  completed: boolean;
}

interface AppState {
  todoList: Task[];
  activeItem: Task;
  editing: boolean;
}

class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: "",
        completed: false,
      },
      editing: false,
    };
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.strikeUnstrike = this.strikeUnstrike.bind(this);
    this.getCookie = this.getCookie.bind(this);
  }

  getCookie(name: string) {
    let cookieValue: any = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  componentWillMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    console.log("fetching...");

    fetch("http://localhost/api/tasks/")
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          todoList: data,
        })
      );
  }

  handleChange(e: any) {
    let name = e.target.name;
    let value = e.target.value;
    console.log("Name: ", name, "Value: ", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    console.log("ITEM: ", this.state.activeItem);

    const csrftoken = this.getCookie("csrftoken");

    let url: string = "http://localhost/api/tasks/";
    let method: string = "POST";

    if (this.state.editing === true) {
      url = `http://localhost/api/tasks/${this.state.activeItem.id}/`;
      method = "PUT";
      this.setState({
        editing: false,
      });
    }

    fetch(url, {
      method: method,
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then((response) => {
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false,
          },
        });
      })
      .catch(function (error) {
        console.log("Error Message:", error);
      });
  }

  startEdit(task: Task) {
    this.setState({
      activeItem: task,
      editing: true,
    });
  }

  handleDelete(task: Task) {
    let url: string = `http://localhost/api/tasks/${task.id}`;
    const csrftoken: string = this.getCookie("csrftoken");

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      this.fetchTasks();
    });
  }

  strikeUnstrike(task: Task) {
    task.completed = !task.completed;

    let url: string = `http://localhost/api/tasks/${task.id}/`;
    const csrftoken = this.getCookie("csrftoken");

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        title: task.title,
        completed: task.completed,
      }),
    }).then((response) => {
      this.fetchTasks();
    });
  }

  render() {
    let tasks = this.state.todoList;
    let self = this;

    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.handleChange}
                    className="form-control"
                    id="title"
                    value={this.state.activeItem.title}
                    type="text"
                    name="title"
                    placeholder="Add task.."
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input id="submit" className="btn btn-primary" type="submit" name="Add..." />
                </div>
              </div>
            </form>
          </div>

          <div id="list-wrapper">
            {tasks.map(function (task, index) {
              return (
                <div key={index} className="task-wrapper flex-wrapper">
                  <div onClick={() => self.strikeUnstrike(task)} style={{ flex: 7 }}>
                    {task.completed === false ? <span>{task.title}</span> : <del>{task.title}</del>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info">
                      Edit
                    </button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <button onClick={() => self.handleDelete(task)} className="btn btn-sm btn-outline-dark delete">
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
