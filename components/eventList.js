import { useEffect, useCallback, useState } from 'react';
import { useForm } from "react-hook-form";

import EventCard from './eventCard';

export default function EventList(props) {
  const { events, editEvent } = props;

  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const submit = useCallback(handleSubmit(data => {
    setSubmitted(true);

    let updatedEventId, updateData = {};

    Object.entries(data).forEach(([fieldName, fieldValue]) => {
      const [eventId, fieldType] = fieldName.split('-');
      if (typeof fieldValue !== 'undefined') {
        if (!updatedEventId) updatedEventId = eventId;
        if (updatedEventId != eventId) {
          console.error('Trying to update multiple events');
          return;
        }
        updateData[fieldType] = fieldValue;
      }
    });

    console.log('submitting', updatedEventId, updateData);

    if (updatedEventId && Object.keys(updateData).length > 0) {
      editEvent(updatedEventId, updateData);
    }
  }), [handleSubmit, setSubmitted, editEvent]);

  useEffect(() => {
    if (submitted) {
      reset({});
      setSubmitted(false);
    }

  }, [reset, submitted, setSubmitted]);

  return (
    <form>
      {events.map(event =>
        <EventCard
          key={event.id}
          {...event}
          register={register}
          submit={submit}
        />)}
    </form>
  );
}