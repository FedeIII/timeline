import Image from 'next/image';
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { useMemo } from 'react';

import styles from './event.module.scss';

function useDistancePercentage(duration, start, date) {
  return useMemo(() => {
    const startDistance = formatDistanceStrict(
      new Date(start),
      new Date(date),
      { unit: 'day' }
    ).split(' ')[0];

    return startDistance / duration * 100;
  }, [duration, start, date]);
}

function useDynamicWidthStyle(title) {
  return useMemo(() => {
    const width = title.length / 2;

    return {
      width: `${width}rem`,
      marginTop: `${0.355 * width + 0.51}rem`,
      marginLeft: `${-0.855 * width - 0.009}rem`,
    };
  }, [title]);
}

export default function Event(props) {
  const { type } = props;

  if (type == 'START_PROJECT') return <StartProjectEvent {...props} />
  if (type == 'PROMPT') return <PromptEvent {...props} />
  if (type == 'START') return <StartEvent {...props} />
  if (type == 'END_PROJECT') return <EndProjectEvent {...props} />
}

function StartProjectEvent(props) {
  const { imgUrl, title, description, date, type, timelineDuration } = props;

  const dynamicStyle = useDynamicWidthStyle(title);

  return (
    <div className={`${styles.eventKnob} ${styles.startProjectKnob}`}>
      <div className={`${styles.eventLabel} ${styles.startProjectLabel}`} style={dynamicStyle}>
        {title}
      </div>
    </div >
  );
}

function PromptEvent(props) {
  const { imgUrl, title, description, date, type, timelineDuration, projectStart } = props;

  const leftPosition = useDistancePercentage(timelineDuration, projectStart, date);
  const dynamicStyle = useDynamicWidthStyle(title);

  return (
    <div className={styles.eventKnob} style={{ left: `${leftPosition}%` }} >
      <div className={styles.eventLabel} style={dynamicStyle}>
        {title}
      </div>
    </div>
  );
}

function StartEvent(props) {
  const { imgUrl, title, description, date, type, timelineDuration, projectStart } = props;

  const leftPosition = useDistancePercentage(timelineDuration, projectStart, date);
  const dynamicStyle = useDynamicWidthStyle(title);

  return (
    <div className={styles.eventKnob} style={{ left: `${leftPosition}%` }} >
      <div className={styles.eventLabel} style={dynamicStyle}>
        {title}
      </div>
    </div>
  );
}

function EndProjectEvent(props) {
  const { imgUrl, title, description, date, type, timelineDuration } = props;

  const dynamicStyle = useDynamicWidthStyle(title);

  return (
    <div className={`${styles.eventKnob} ${styles.endProjectKnob}`}>
      <div className={styles.eventLabel} style={dynamicStyle}>
        {title}
      </div>
    </div>
  );
}