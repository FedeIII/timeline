import format from 'date-fns/format';
import { useMemo } from 'react';
import styles from './calendar.module.scss';

function useEventsAtDay(day, events) {
  return useMemo(() => {
    const eventsAtDay = events.filter(
      event => format(day, 'yyyy-MM-dd') === event.date
    );

    if (eventsAtDay.length > 0) return eventsAtDay;
    else return null;
  }, [day, events]);
}

export default function DayCell(props) {
  const { day, events, register, isEditMode } = props;

  const eventsAtDay = useEventsAtDay(day, events);

  const cellBodyStyle = eventsAtDay ? {} : { width: '50px', height: '50px' };
  const event = (eventsAtDay && eventsAtDay[0]) || {};
  const { title, id } = event;

  return (
    <div className={styles.cell}>
      <div className={styles.cellHeader}>{format(day, 'EE')}</div>
      <div className={styles.cellBody} style={cellBodyStyle}>
        <span>{format(day, 'd')}</span>
        {eventsAtDay && (
          <textarea
            defaultValue={title}
            {...register(`${id}#title`)}
            className={styles.eventTitleInput}
            disabled={!isEditMode}
          />
        )}
      </div>
    </div>
  );
}
