import { compareAsc } from 'date-fns';
import add from 'date-fns/add';
import DayCell from './dayCell';
import styles from './calendar.module.scss';
import { useCallback, useContext, useMemo } from 'react';
import TogglableForm from '../HOCs/togglableForm';
import ProjectContext from '../../contexts/projectContext';

function useDays(firstEvent = {}, lastEvent = {}) {
  return useMemo(() => {
    const firstDate = firstEvent.date;
    const lastDate = lastEvent.date;

    const days = [];
    let previousDate = new Date(firstDate);
    days.push(previousDate);

    function addDate() {
      const newDate = add(new Date(previousDate), { days: 1 });
      days.push(newDate);
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
  }, [firstEvent.date, lastEvent.date]);
}

export default function Calendar(props) {
  const { events, projectId } = props;

  const days = useDays(events[0], events[events.length - 1]);

  const { editEvent } = useContext(ProjectContext);

  const onFormEdit = useCallback(data => {
    let eventsToUpdate = {};

    var a = {
      '61a7fc34-3295-4d94-9b5d-d0775daf1c01#title': 'Start project',
      '0e4c5bf7-5495-4eab-a35d-0d3cfbfa3f7e#title': 'Background start',
      '0dh3ac34-4f95-0k94-lk5d-d079kdy51c01#title': 'Varnish',
      'lanf7c34-39h5-7jdg-0ghj-d070sjgf1c01#title': 'End of the Project',
    };

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
          <div className={topLevelStyles}>
            {days.map(day => (
              <DayCell
                day={day}
                events={events}
                register={register}
                control={control}
                isEditMode={isEditMode}
                key={day}
              />
            ))}
          </div>
        );
      }}
    </TogglableForm>
  );
}
