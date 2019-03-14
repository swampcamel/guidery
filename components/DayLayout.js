import React from 'react'
import firebase from 'firebase'
import clientCredentials from '../credentials/client'
import 'firebase/firestore'
import 'isomorphic-unfetch'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TaskLayout from './TaskLayout'

class DayLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: null,
      open: false,
      tasks: [],
      newTaskTitle: null,
      newTaskDesc: null,
      newTaskStartTime: null,
      newTaskEndTime: null
    }
    this.addDbListener = this.addDbListener.bind(this)
    this.removeDbListener = this.removeDbListener.bind(this)
    this.handleAddTask = this.handleAddTask.bind(this)
    this.renderTasks = this.renderTasks.bind(this)
  }

  componentDidMount() {
    this.setState({ loading: true });
    !firebase.apps.length ? firebase.initializeApp(clientCredentials) : firebase.app()
    this.addDbListener()

  }

  addDbListener () {
    var db = firebase.firestore()
    const userId = this.props.user
    const dateQuery = this.props.date

    let unsubscribe = db.collection('users').doc(`${userId}`).collection('calendar').doc(`${dateQuery}`).collection('tasks').onSnapshot(
      querySnapshot => {
        if (querySnapshot) {
          let tasks = []
          querySnapshot.forEach(taskDoc => {
            tasks.push( {id: taskDoc.id, ...taskDoc.data()})
          })
          this.setState({ tasks: tasks, loading: false })
          }
        else console.log("empty")
      }, error => {
        console.error(error)
      }
    )

    this.setState({unsubscribe})
  }

  removeDbListener () {
    if (this.state.unsubscribe) {
      this.state.unsubscribe()
    }
  }

  componentWillUnmount() {
    this.removeDbListener()
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleAddTask = () => {
    var db = firebase.firestore()
    const userId = this.props.user
    const dateQuery = this.props.date

    db.collection('users').doc(`${userId}`).collection('calendar').doc(`${dateQuery}`).collection('tasks').add({
      title: this.state.newTaskTitle,
      desc: this.state.newTaskDesc,
      startTime: this.state.newTaskStartTime,
      endTime: this.state.newTaskEndTime
    }).then(function(docRef) {console.log("Success ", docRef)
    }).catch(function(error) {console.error("Error ", error)})
    this.setState({ open: false })
  }



  handleOnChange = event => {
    const newValue = event.target.value
    const stateSlice = event.target.id
    this.setState({[stateSlice]: newValue})
  };

  renderTasks = () => {
    if (this.state.tasks = null ) return <div>Add a new task by clicking on the button</div>
    else if (this.state.tasks) {
      const taskList = this.state.tasks.map(task => <TaskLayout title={task.Title}/>)
      return taskList
    }
    else { return <div>No State</div> }
  }

  // {this.state.tasks.map( (task) => {return <TaskLayout title={task.title} />} )}
  render() {
    return (
      <div>
        {(this.state.tasks || []).map((task, index) =>
          <TaskLayout key={index}
              title={task.title}
              desc={task.desc}
              startTime={task.startTime}
              endTime={task.endTime}
              id={task.id}
              user={this.props.user}
              date={this.props.date}
            />
        )}
        <Button variant="contained" onClick={this.handleClickOpen}>Add Task</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Task</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter any details below.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="newTaskTitle"
              label="Task Title"
              type="text"
              fullWidth
              onChange={this.handleOnChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="newTaskDesc"
              label="Task Description"
              type="text"
              fullWidth
              onChange={this.handleOnChange}
            />
          <TextField
            id="newTaskStartTime"
            label="Start Time"
            type="time"
            onChange={this.handleOnChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
          <TextField
            id="newTaskEndTime"
            label="End Time"
            type="time"
            onChange={this.handleOnChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleAddTask} color="primary">
              Add to Calendar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default DayLayout
