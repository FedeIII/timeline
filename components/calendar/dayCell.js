import format from 'date-fns/format';
import styles from './calendar.module.scss';

export default function DayCell(props) {
  const { day, eventsAtDay, register, isEditMode, isOngoingEvent } = props;
  const event = (eventsAtDay && eventsAtDay[0]) || {};
  const { title, type, id } = event;

  let cellBodyClass = styles.cellBody;

  let cellBodyStyle = { width: '50px' };
  if (eventsAtDay) {
    cellBodyStyle = {};
  }

  if (type === 'START') {
    cellBodyClass += ' ' + styles.start;
  } else if (type === 'MIDDLE') {
    cellBodyClass += ' ' + styles.middle;
  } else if (type === 'END') {
    cellBodyClass += ' ' + styles.end;
  } else if (!eventsAtDay && isOngoingEvent) {
    cellBodyClass += ' ' + styles.ongoing;
    cellBodyStyle = { width: '72px' };
  }

  const shouldShowEvent = isOngoingEvent || eventsAtDay;

  return (
    <div className={styles.cell}>
      <div className={styles.cellHeader}>
        {format(day, 'EE')} <span>{format(day, 'd')}</span>
      </div>
      <div className={cellBodyClass} style={cellBodyStyle}>
        {shouldShowEvent && (
          <div className={styles.event}>
            {eventsAtDay && (
              <textarea
                defaultValue={title}
                {...register(`${id}#title`)}
                className={styles.eventInput}
                disabled={!isEditMode}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
