import DayLayout from './../components/DayLayout'
import {withRouter} from 'next/router'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  mainWrapper: {
    fontFamily: 'Roboto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: 160+'px'
  },
  firstDateLine: {
    display: 'flex',
    alignItems: 'top',
    justifyContent: 'space-between',
    width: 120+'px'
  },
  selectedDay: {
    fontSize: '35px'
  },
  selectedMonth: {
    fontSize: '35px',

  },
  selectedYear: {
    fontSize: '26px',
    fontWeight: 'bold'
  }
})

const DayView = withRouter((props) => {
  const {classes} = props
  const uid = props.router.query.uid
  console.log(uid)
  const splitDate = props.router.query.date.split('-')
  const displayDate = <div className={`${classes.mainWrapper}`}>
                        <div className={`${classes.firstDateLine}`}>
                          <span className={`${classes.selectedDay}`}>{splitDate[0]}</span>
                          <span className={`${classes.selectedMonth}`}>{splitDate[1]}</span>
                        </div>
                        |<br/>
                        |<br/>
                        |
                        <div className={`${classes.selectedYear}`}>{splitDate[2]}</div>
                      </div>
    return (<div>
      {displayDate}
      <DayLayout/>
    </div>)
})

export default withStyles(styles)(DayView)
