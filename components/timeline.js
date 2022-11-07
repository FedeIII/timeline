import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { useMemo } from 'react';

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
  const { events } = props;

  const timelineDuration = useTimelineDuration(events);
  const projectStart = events[0].date;

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.line} />
      {events.map(event =>
        <Event
          key={`${event.title}-${event.date}`}
          {...event}
          timelineDuration={timelineDuration}
          projectStart={projectStart}
        />
      )}
    </div>
  );
}