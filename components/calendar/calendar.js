import { compareAsc } from 'date-fns';
import add from 'date-fns/add';
import format from 'date-fns/format';
import DayCell from './dayCell';
import styles from './calendar.module.scss';
import { useCallback, useContext, useMemo } from 'react';
import TogglableForm from '../HOCs/togglableForm';
import ProjectContext from '../../contexts/projectContext';

const DAYS_BEFORE_START = 7;
const MIN_NUMBER_OF_DAYS = 28;
const MIN_DAYS_AFTER_START = 7;

function useDays(events = []) {
  return useMemo(() => {
    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];
    const firstDate =
      (firstEvent && firstEvent.date) || format(new Date(), 'yyyy-MM-dd');
    const lastDate =
      (lastEvent && lastEvent.date) ||
      format(add(new Date(), { days: MIN_DAYS_AFTER_START }), 'yyyy-MM-dd');

    // add starting date
    let isOngoingEvent = false;
    const days = [];
    let previousDate = new Date(firstDate);
    days.push({
      date: previousDate,
      isOngoingEvent: false,
      eventsAtDay: firstEvent ? [firstEvent] : null,
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

    // add dates until last event
    let done = false;
    while (!done) {
      const newDate = addDate();

      if (compareAsc(new Date(lastDate), new Date(newDate)) < 0) {
        done = true;
      }
    }

    // add dates until minimum amount of dates
    let minNumberOfExtraDays = MIN_NUMBER_OF_DAYS - days.length;
    if (minNumberOfExtraDays < 0) minNumberOfExtraDays = MIN_NUMBER_OF_DAYS;
    for (let index = 1; index <= minNumberOfExtraDays; index++) {
      addDate();
    }

    // add days before the start
    for (let index = 1; index <= DAYS_BEFORE_START; index++) {
      const newDate = add(new Date(days[0].date), { days: -1 });
      days.unshift({ date: newDate, isOngoingEvent: false, eventsAtDay: null });
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
        const value = fieldValue === '' ? null : fieldValue;
        eventsToUpdate[eventId][eventProp] = value;
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
                  key={format(date, 'yyyy-MM-dd')}
                />
              ))}
            </div>
          </>
        );
      }}
    </TogglableForm>
  );
}
