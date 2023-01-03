import DayCell from './dayCell';
import { DateTags } from './dateTags';
import styles from './calendar.module.scss';

export default function Calendar(props) {
  const { className, days, ...restProps } = props;

  return (
    <div className={className}>
      <DateTags days={days} />
      <div className={styles.cells}>
        {days.map(({ date, isOngoingEvents, events }) => (
          <DayCell
            date={date}
            isOngoingEvents={isOngoingEvents}
            events={events}
            {...restProps}
            key={date}
          />
        ))}
      </div>
    </div>
  );
}
