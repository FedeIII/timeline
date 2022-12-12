import { compareAsc } from 'date-fns';
import add from 'date-fns/add';
import format from 'date-fns/format';
import styles from './calendar.module.scss';
import { useCallback, useContext, useMemo } from 'react';
import TogglableForm from '../HOCs/togglableForm';
import ProjectContext from '../../contexts/projectContext';
import Calendar from './calendar';
import { useDaysEvents } from '../hooks/useDays';

export default function FormCalendar(props) {
  const { events, projectId } = props;

  const days = useDaysEvents(events);

  const projectContext = useContext(ProjectContext);

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
      projectContext.editEvent(eventId, eventProps);
    });
  }, []);

  return (
    <TogglableForm onFormEdit={onFormEdit} className={styles.calendarContainer}>
      {props => {
        const { topLevelStyles, isEditMode, register, control } = props;

        return (
          <>
            <hr className={styles.line} />
            <Calendar
              className={topLevelStyles}
              days={days}
              register={register}
              control={control}
              isEditMode={isEditMode}
            />
          </>
        );
      }}
    </TogglableForm>
  );
}