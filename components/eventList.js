import { useEffect, useCallback, useState } from 'react';
import { useForm, useFormState } from "react-hook-form";

import EventCard from './eventCard';

export default function EventList(props) {
  const { events, editEventTitle } = props;

  const [ submitted, setSubmitted ] = useState(false);
  const { register, handleSubmit, control, reset } = useForm();
  const { touchedFields } = useFormState({ control });
  const submit = useCallback(handleSubmit(data => {
    setSubmitted(true);

    const fieldTouched = Object.keys(touchedFields)[0];
    const eventId = fieldTouched.split('-')[0];
    console.log('submitting');
    editEventTitle(eventId, data[fieldTouched]);
  }), [handleSubmit, touchedFields, reset]);

  useEffect(() => {
    if (submitted) {
      reset({}, { keepValues: true });
      setSubmitted(false);
    }

  }, [reset, submitted, setSubmitted]);

  return (
    <form onBlur={submit}>
      {events.map(event =>
        <EventCard
          key={event.id}
          {...event}
          register={register}
        />)}
    </form>
  );
}