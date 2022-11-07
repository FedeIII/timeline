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

function useLabelWidthStyles(title) {
  return useMemo(() => {
    const width = title.length / 2;

    return {
      width: `${width}rem`,
      marginTop: `${0.355 * width + 0.51}rem`,
      marginLeft: `${-0.855 * width - 0.009}rem`,
    };
  }, [title]);
}

function useKnobStyles(noKnob) {
  if (noKnob) return {
    border: 'none',
    backgroundColor: 'transparent',
  };
}

export default function Event(props) {
  const { type } = props;

  if (type == 'START_PROJECT') return <PromptEvent {...props} />
  if (type == 'PROMPT') return <PromptEvent {...props} />
  if (type == 'START') return <DurationEvent {...props} />
  if (type == 'END_PROJECT') return <PromptEvent {...props} />
}

function PromptEvent(props) {
  const { imgUrl, title, description, date, type, timelineDuration, projectStart, noKnob } = props;

  const leftPosition = useDistancePercentage(timelineDuration, projectStart, date);
  const dynamicStyle = useLabelWidthStyles(title);
  const knobStyles = useKnobStyles(noKnob);

  return (
    <div className={styles.eventKnob} style={{ left: `${leftPosition}%`, ...knobStyles }} >
      <div className={styles.eventLabel} style={dynamicStyle}>
        {title}
      </div>
    </div>
  );
}

function DurationEvent(props) {
  const { imgUrl, title, description, date, type, timelineDuration, projectStart, middle, end } = props;

  const leftPosition = useDistancePercentage(timelineDuration, projectStart, date);
  const dynamicStyle = useLabelWidthStyles(title);
  const eventDurationPercentage = useDistancePercentage(timelineDuration, date, end.date);

  const lineStyles = { left: `${leftPosition}%`, width: `${eventDurationPercentage}%` };

  return (
    <>
      <div className={styles.eventKnob} style={lineStyles} >
        <div className={styles.eventTitle}>{title}</div>
        <div className={styles.eventLabel} style={dynamicStyle}>
          {title}
        </div>
      </div>
      {middle.map(middleEvent => <PromptEvent
        {...middleEvent}
        noKnob
        timelineDuration={timelineDuration}
        projectStart={projectStart}
      />)}
      <PromptEvent
        {...end}
        noKnob
        timelineDuration={timelineDuration}
        projectStart={projectStart}
      />
    </>
  );
}
