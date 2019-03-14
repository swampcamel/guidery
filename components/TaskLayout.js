import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase'
import 'firebase/firestore'
import 'isomorphic-unfetch'

import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  cardWrapper: {
    marginBottom: '20px',
    width: '100%'
  },
  card: {
    width: '100%',
    maxWidth: '800px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  }
})

class TaskLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = { expanded: false, anchorEl: null }
    this.handleDeleteTask = this.handleDeleteTask.bind(this)
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  }

  handleDeleteTask = () => {
    const userId = this.props.user
    const dateQuery = this.props.date
    const id = this.props.id
    let db = firebase.firestore()

    db.collection('users').doc(`${userId}`).collection('calendar').doc(`${dateQuery}`).collection('tasks').doc(`${id}`).delete()
    .then(function() {
      console.log("deleted " + id)
    }).catch(function(error) {
      console.error("Error removing document " + id, error)
    })
    this.handleClose()
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    return <div className={classes.cardWrapper}>
       <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Task" className={classes.avatar}>
              *
            </Avatar>
          }
          action={
            <IconButton aria-owns={ anchorEl ? 'simple-menu' : undefined }
              aria-haspopup="true"
              onClick={this.handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={this.props.title}
          subheader={this.props.startTime + " - " + this.props.endTime}
        />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
            >
            <MenuItem onClick={this.handleDeleteTask}>Delete</MenuItem>
          </Menu>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>{this.props.desc}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  }
}

TaskLayout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TaskLayout)
