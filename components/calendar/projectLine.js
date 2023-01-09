import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import styles from './calendar.module.scss';

export function ProjectLine(props) {
  const { index, date, firstDates, lastDates } = props;

  let lineStyles = {
    // top: `${18 + 16 + 95/2 + 95 * i}px`,
    top: `${95 * index + 82}px`,
  };

  if (
    isBefore(new Date(date), new Date(firstDates[index])) ||
    isAfter(new Date(date), new Date(lastDates[index]))
  ) {
    lineStyles = {
      ...lineStyles,
      height: '3px',
      border: 'none',
      backgroundColor: 'lightgray',
    };
  }

  return <hr className={styles.projectLine} style={lineStyles} key={index} />;
}
