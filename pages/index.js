import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import 'firebase/auth'
import 'firebase/firestore'
import 'isomorphic-unfetch'
import clientCredentials from '../credentials/client'
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import Link from "next/link";

import CalendarLayout from './../components/CalendarLayout'

const styles = theme => ({
  icon: {
    fontFamily: 'Material Icons',
    fontStyle: 'normal',
    display: 'inline-block',
    verticalAlign: 'middle',
    lineHeight: 1,
    textTransform: 'none',
    letterSpacing: 'normal',
    wordWrap: 'normal',
    whiteSpace: 'nowrap',
    direction: 'ltr',
    cursor: 'pointer'
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  toolbarMain: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  calendarRow: {
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirecton: 'row',
    flexWrap: 'wrap',
    width: '100%'
  },
  calendarRowMiddle: {
    alignItems: 'center'
  },
  calendarCol: {
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: '100%'
  },
  calendarColStart: {
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: '100%',
    justifyContent: 'flex-start',
    textAlign: 'left'
  },
  calendarColCenter: {
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: '100%',
    justifyContent: 'center',
    textAlign: 'center'
  },
  calendarColEnd: {
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: '100%',
    justifyContent: 'flex-end',
    textAlign: 'right'
  },
  calendarMain: {
    display: 'block',
    position: 'relative',
    width: '100%',
    background: '#fff',
    border: '1px solid #eee',
  },
  calendarHeader: {
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: '115%',
    padding: 1.5+'em '+0,
    borderBottom: '1px solid #eee',
    margin: 0 + ' auto',
    padding: 0,
    display: 'flex',
    flexDirecton: 'row',
    flexWrap: 'wrap',
    width: '50%',
    justifyContent: 'center'
  },
  calendarHeaderIcon: {
    cursor: 'pointer'
  },
  calendarDays: {
    margin: 0,
    display: 'flex',
    flexDirecton: 'row',
    flexWrap: 'wrap',
    width: '100%',
    textTransform: 'uppercase',
    fontWeight: 400,
    height: 5+'em',
    overflow: 'hidden',
    color: '#ccc',
    fontSize: '70%',
    padding: 1.5+'em '+0,
    borderBottom: '1px solid #eee'
  },
  calendarBodyCell: {
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: '100%',
    position: 'relative',
    height: 5+'em',
    borderRight: '1px solid #eee',
    overflow: 'hidden',
    cursor: 'pointer',
    background: '#fff'
  },
  calendarBodyCellSelected: {
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderImage: 'linear-gradient(45deg, #1a8fff, #53cbf1 40%)',
    borderImageSlice: 1
  },
  calendarBodyRow: {
    borderBottom: '1px solid #eee'
  },
  calendarBodyCellNumber: {
    position: 'absolute',
    fontSize: '82.5%',
    lineHeight: 1,
    top: '.75em',
    right: '.75em',
    fontWeight: 700
  },
  calendarBodyDisabled: {
    color: '#ccc',
    pointerEvents: 'none'
  },
  calendarBodyCellBg: {
    fontWeight: 700,
    lineHeight: 1,
    color: '#1a8fff',
    opacity: 0,
    fontSize: 8+'em',
    position: 'absolute',
    top: '-.2em',
    right: '-.05em',
    letterSpacing: '-.07em'
  },
  calendarBodyCol: {
    flexGrow: 0,
    flexBasis: 'calc(100%/7)',
    width: 'calc(100%/7)'
  }
});



class IndexPage extends React.Component {
  static async getInitialProps ({ req, query }) {
    const user = req && req.session ? req.session.decodedToken : null
    return {user}
  }

  constructor(props) {
    super(props)
    this.state = {
      user: this.props.user,
      value: ''
    }

    this.addDbListener = this.addDbListener.bind(this)
    this.removeDbListener = this.removeDbListener.bind(this)

  }

  componentWillUnmount() {
    this.removeDbListener()
  }

  componentDidMount() {
    !firebase.apps.length ? firebase.initializeApp(clientCredentials) : firebase.app()
    if (this.state.user) this.addDbListener()

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user })
        return user
        .getIdToken()
        .then(token => {
          return fetch('/api/login', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify({ token })
          })
        })
        .then(res => this.addDbListener())
      } else {
        this.setState({ user: null })
        fetch('/api/logout', {
          method: 'POST',
          credentials: 'same-origin'
        }).then(() => this.removeDbListener())
      }
    })
  }

  addDbListener () {
    var db = firebase.firestore()

    let unsubscribe = db.collection('users').onSnapshot(
      querySnapshot => {
        var users = {}
        querySnapshot.forEach(function (doc) {
          users[doc.id] = doc.id
        })
        if (users) {
          if (!users[this.state.user.uid]) {
            db.collection('users').doc(this.state.user.uid).set({
              name: this.state.user.displayName,
              uid: this.state.user.uid,
              calendar: {}
            })}
        }
      },
      error => {
        console.error(error)
      }
    )
    this.setState({ unsubscribe })
    console.log(this.state)
  }

  removeDbListener () {
    if (this.state.unsubscribe) {
      this.state.unsubscribe()
    }
  }

  handleChange (event) {
    this.setState({ value: event.target.value })
  }



  handleLogin () {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  render() {
    const { classes } = this.props
    const { user, value } = this.state
    if (!user){
      return(
    <div>
      {user ? (
        <button onClick={this.handleLogout}>Logout</button>
      ) : (
        <button onClick={this.handleLogin}>Login</button>
      )}
      </div>)}
    else {return (
      <React.Fragment>
        <CalendarLayout classes={classes} user={user}/>
      </React.Fragment>
    )}
  }
}

IndexPage.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(IndexPage);
