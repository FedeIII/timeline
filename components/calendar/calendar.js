import DayCell from './dayCell';

export default function Calendar(props) {
  const { className, days, ...restProps } = props;

  return (
    <div className={className}>
      {days.map(({ date, isOngoingEvents, events }) => (
        <DayCell
          date={date}
          isOngoingEvent={isOngoingEvents[0]}
          eventsAtDay={events}
          {...restProps}
          key={date}
        />
      ))}
    </div>
  );
}
