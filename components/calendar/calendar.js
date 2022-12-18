import DayCell from './dayCell';

export default function Calendar(props) {
  const { className, days, ...restProps } = props;

  return (
    <div className={className}>
      {days.map(({ date, isOngoingEvents, events }) => (
        <DayCell
          date={date}
          isOngoingEvents={isOngoingEvents}
          eventsAtDay={events}
          {...restProps}
          key={date}
        />
      ))}
    </div>
  );
}
