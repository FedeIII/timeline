import { compareAsc } from 'date-fns';
import add from 'date-fns/add';
import format from 'date-fns/format';
import DayCell from './dayCell';
import styles from './calendar.module.scss';
import { useCallback, useContext, useMemo } from 'react';
import TogglableForm from '../HOCs/togglableForm';
import ProjectContext from '../../contexts/projectContext';

function useDays(events = []) {
  return useMemo(() => {
    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];
    const firstDate = firstEvent.date;
    const lastDate = lastEvent.date;

    let isOngoingEvent = false;
    const days = [];
    let previousDate = new Date(firstDate);
    days.push({
      date: previousDate,
      isOngoingEvent: false,
      eventsAtDay: [firstEvent],
    });

    function addDate() {
      const newDate = add(new Date(previousDate), { days: 1 });

      const eventsAtDay = getEventsAtDay(newDate, events);
      const event = (eventsAtDay && eventsAtDay[0]) || {};
      const { type } = event;

      if (type === 'START') isOngoingEvent = true;
      if (type === 'END') isOngoingEvent = false;

      days.push({ date: newDate, isOngoingEvent, eventsAtDay });
      previousDate = newDate;

      return newDate;
    }

    let done = false;
    while (!done) {
      const newDate = addDate();

      if (compareAsc(new Date(lastDate), new Date(newDate)) < 0) {
        done = true;
      }
    }

    for (let index = 1; index <= 7; index++) {
      addDate();
    }

    return days;
  }, [events]);
}

function getEventsAtDay(day, events) {
  const eventsAtDay = events.filter(
    event => format(day, 'yyyy-MM-dd') === event.date
  );

  if (eventsAtDay.length > 0) return eventsAtDay;
  else return null;
}

export default function Calendar(props) {
  const { events, projectId } = props;

  const days = useDays(events);

  const { editEvent } = useContext(ProjectContext);

  const onFormEdit = useCallback(data => {
    let eventsToUpdate = {};

    Object.entries(data).forEach(([fieldName, fieldValue]) => {
      if (typeof fieldValue !== 'undefined') {
        const [eventId, eventProp] = fieldName.split(/#(.*)/s);

        eventsToUpdate[eventId] = eventsToUpdate[eventId] || {};
        eventsToUpdate[eventId][eventProp] = fieldValue;
      }
    });

    Object.entries(eventsToUpdate).forEach(([eventId, eventProps]) => {
      console.log('submitting', eventId, eventProps);
      editEvent(eventId, eventProps);
    });
  }, []);

  return (
    <TogglableForm onFormEdit={onFormEdit} className={styles.calendarContainer}>
      {props => {
        const { topLevelStyles, isEditMode, register, control } = props;

        return (
          <>
            <hr className={styles.line} />
            <div className={topLevelStyles}>
              {days.map(({ date, isOngoingEvent, eventsAtDay }) => (
                <DayCell
                  day={date}
                  isOngoingEvent={isOngoingEvent}
                  eventsAtDay={eventsAtDay}
                  register={register}
                  control={control}
                  isEditMode={isEditMode}
                  key={date}
                />
              ))}
            </div>
          </>
        );
      }}
    </TogglableForm>
  );
}
