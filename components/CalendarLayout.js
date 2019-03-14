import React, {Component} from 'react'
import firebase from 'firebase';
import 'firebase/auth'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import dateFns from 'date-fns'
import Link from 'next/link'

class CalendarLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
    currentMonth: new Date(),
    selectedDate: new Date()
    }
  }

  renderHeader() {
    const dateFormat = "MMMM YYYY"
    const {classes} = this.props
    return (
      <div className={classes.calendarHeader}>
        <div className={classes.calendarColStart}>
          <div className={classes.icon} onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className={classes.calendarColCenter}>
          <span>
            {dateFns.format(this.state.currentMonth, dateFormat)}
          </span>
        </div>
        <div className={classes.calendarColEnd} onClick={this.nextMonth}>
          <div className={classes.icon}>chevron_right</div>
        </div>
      </div>
  )}

  renderDays() {
    const {classes} = this.props
    const dateFormat = "dddd"
    const days = []
    let startDate = dateFns.startOfWeek(this.state.currentMonth)
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className={classes.calendarColCenter} key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      )
    }
    return <div className={classes.calendarDays}>{days}</div>
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state
    const monthStart = dateFns.startOfMonth(currentMonth)
    const monthEnd = dateFns.endOfMonth(monthStart)
    const startDate = dateFns.startOfWeek(monthStart)
    const endDate = dateFns.endOfWeek(monthEnd)
    const {classes} = this.props
    const dateFormat = "D"
    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat)
        const cloneDay = day
        days.push(
          <Link key={day} href={`/dayView?uid=${this.props.user.uid}&date=${formattedDate}-${dateFns.format(currentMonth, 'MMM-YYYY')}`}>
          <div
            className={`${classes.calendarBodyCell} ${
              !dateFns.isSameMonth(day, monthStart)
                ? `${classes.calendarBodyDisabled}`
                : dateFns.isSameDay(day, selectedDate) ? `${classes.calendarBodyCellSelected}` : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className={classes.calendarBodyCellNumber}>{formattedDate}</span>
            <span className={classes.calendarBodyCellBg}>{formattedDate}</span>
          </div>
          </Link>
        )
        day = dateFns.addDays(day, 1)
      }
      rows.push(
        <div className={classes.calendarRow} key={day}>
          {days}
        </div>
      )
      days = []
    }
    return <div className={classes.calendarMain}>{rows}</div>;
  }

  onDateClick = day => {
  this.setState({
    selectedDate: day
    })
  }

  handleLogout () {
    firebase.auth().signOut()
  }

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    })
  }

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    })
  }

  render(){
  const {classes} = this.props
  return (
    <div>
      {this.renderHeader()}
      {this.renderDays()}
      {this.renderCells()}
            {this.props.user ? (
              <div className={classes.logout} onClick={this.handleLogout}>Logout</div>
              ) : (
                <button onClick={this.handleLogin}>Login</button>

            )}
    </div>)
  }
}

export default CalendarLayout
