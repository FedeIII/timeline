import format from 'date-fns/format';
import styles from './calendar.module.scss';

function useCellBodyClass(eventType, eventsAtDay, isOngoingEvent) {
  let cellBodyClass = styles.cellBody;

  if (eventType === 'START') {
    cellBodyClass += ' ' + styles.start;
  } else if (eventType === 'MIDDLE') {
    cellBodyClass += ' ' + styles.middle;
  } else if (eventType === 'END') {
    cellBodyClass += ' ' + styles.end;
  } else if (eventsAtDay) {
    cellBodyClass += ' ' + styles.withEvent;
  } else if (isOngoingEvent) {
    cellBodyClass += ' ' + styles.ongoing;
  }

  return cellBodyClass;
}

export default function DayCell(props) {
  const { day, eventsAtDay, register, isEditMode, isOngoingEvent } = props;
  const event = (eventsAtDay && eventsAtDay[0]) || {};
  const { title, type, id } = event;

  const shouldShowEvent = isOngoingEvent || eventsAtDay;

  const cellBodyClass = useCellBodyClass(type, eventsAtDay, isOngoingEvent);

  return (
    <div className={styles.cell}>
      <div className={styles.cellHeader}>
        {format(day, 'EE')} <span>{format(day, 'd')}</span>
      </div>
      <div className={cellBodyClass}>
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
