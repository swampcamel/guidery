import React from 'react';
import PropTypes from 'prop-types';
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
    borderLeft: '10px solid transparent',
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

const posts = [
  {
    title: 'Featured post',
    date: 'Nov 12',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
  },
  {
    title: 'Post title',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
  },
];

function IndexPage(props) {
  const { classes } = props;

  return (
    <React.Fragment>
      <CalendarLayout classes={classes}/>
    </React.Fragment>
  );
}

IndexPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IndexPage);
