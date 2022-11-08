import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { useMemo, useEffect, useCallback, useState } from 'react';
import { useForm, useFormState } from "react-hook-form";

import Event from './event';
import styles from './timeline.module.scss';

function useTimelineDuration(events) {
  return useMemo(() => {
    const firstEvent = events[0];
    let lastEvent = events[events.length - 1];
    if (lastEvent.end) lastEvent = lastEvent.end;

    const distance = formatDistanceStrict(
      new Date(firstEvent.date),
      new Date(lastEvent.date),
      { unit: 'day' }
    );

    return Number(distance.split(' ')[0]);
  }, events);
}

export default function Timeline(props) {
  const { events, editEventTitle } = props;

  const [ submitted, setSubmitted ] = useState(false);
  const { register, handleSubmit, control, reset } = useForm();
  const { touchedFields } = useFormState({ control });
  const submit = useCallback(handleSubmit(data => {
    setSubmitted(true);

    const fieldTouched = Object.keys(touchedFields)[0];
    const eventId = fieldTouched.split('-')[0];
    editEventTitle(eventId, data[fieldTouched]);
  }), [handleSubmit, touchedFields, reset]);

  useEffect(() => {
    if (submitted) {
      reset({}, { keepValues: true });
      setSubmitted(false);
    }

  }, [reset, submitted, setSubmitted]);

  const timelineDuration = useTimelineDuration(events);
  const projectStart = events[0].date;

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.line} />
      <form onBlur={submit}>
        {events.map(event =>
          <Event
            key={event.id}
            {...event}
            register={register}
            timelineDuration={timelineDuration}
            projectStart={projectStart}
          />
        )}
      </form>
    </div>
  );
}