import { v4 as uuid } from 'uuid';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import add from 'date-fns/add'
import { useEffect, useMemo, useCallback, useContext } from 'react';

import Event from './event';
import styles from './timeline.module.scss';
import TogglableForm from '../HOCs/togglableForm';
import CanvasEvents from '../../utils/canvasEvents';
import ProjectContext from '../../contexts/projectContext';
import classNames from 'classnames';
import { compareAsc } from 'date-fns';

function useTimelineDuration(firstEvent, lastEvent) {
  return useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    let startDate = (firstEvent && firstEvent.date)
      || today;

    const aMonthAfterStartDate = format(add(new Date(startDate), { months: 1 }), 'yyyy-MM-dd');
    let endDate = (lastEvent && lastEvent.end && lastEvent.end.date)
      || (lastEvent && lastEvent.date)
      || aMonthAfterStartDate;

    let distance = formatDistanceStrict(
      new Date(startDate),
      new Date(endDate),
      { unit: 'day' }
    );

    if (distance < 21) {
      endDate = aMonthAfterStartDate;
    }

    endDate = format(add(new Date(endDate), { days: 7 }), 'yyyy-MM-dd');


    distance = formatDistanceStrict(
      new Date(startDate),
      new Date(endDate),
      { unit: 'day' }
    );

    const timelineDuration = Number(distance.split(' ')[0]);

    return [timelineDuration, startDate, endDate]
  }, [firstEvent, lastEvent]);
}

function useTimelineListeners({ startDate, percentageInterval }) {
  const { createEvent } = useContext(ProjectContext);

  useEffect(() => {
    const canvas = document.getElementById('timeline');
    const context = canvas.getContext("2d");
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let message = "";
    const lineHeight = canvas.height / 3;

    const events = new CanvasEvents("timeline");
    events.setDrawStage(function () {
      this.clear();

      // draw red circle
      this.beginRegion();
      context.beginPath();
      context.lineWidth = 4;
      context.strokeStyle = "black";
      context.fillStyle = "#00D2FF";
      context.moveTo(0, lineHeight);
      context.lineTo(canvas.width, lineHeight);
      context.closePath();
      context.fill();
      context.stroke();
      this.closeRegion();

      this.beginRegion();
      context.beginPath();
      context.lineWidth = 0;
      context.strokeStyle = "transparent";
      context.fillStyle = "transparent";
      context.moveTo(0, lineHeight - 10);
      context.lineTo(canvas.width, lineHeight - 10);
      context.lineTo(canvas.width, lineHeight + 10);
      context.lineTo(0, lineHeight + 10);
      context.closePath();

      this.addRegionEventListener("mousedown", function () {
        var mousePos = events.getMousePos();
        message = `select at ${mousePos.x}`;
        console.log('mousedown');
      });

      let hasExecuted = false;

      this.addRegionEventListener("mouseup", function () {
        if (!hasExecuted) {
          setTimeout(() => {
            hasExecuted = false;
          }, 500);

          var mousePos = events.getMousePos();
          message = `deselect at ${mousePos.x}`;
          console.log('mouseup');

          const percentageClicked = mousePos.x / canvas.width;
          const eventDays = Math.round(percentageClicked * 100 / percentageInterval);
          // const eventDays = projectDays * mousePos.x / canvas.width;

          const eventDate = addDays(new Date(startDate), eventDays);
          const eventDateFormatted = format(eventDate, 'yyyy-MM-dd');

          createEvent({
            id: uuid(),
            title: eventDateFormatted,
            date: eventDateFormatted,
            type: 'PROMPT',
          });
          hasExecuted = true;
        }
      });

      this.closeRegion();

      // CanvasEvents.writeMessage(context, message);
    });

    return () => {
      events.removeRegionEventListener("mousedown");
      events.removeRegionEventListener("mouseup");
    };
  }, []);
}

function useDates(startDate, endDate, lengthInDays) {
  // const dayInterval = lengthInDays / 16;
  const dayInterval = 1;
  const dates = [startDate];
  let lastDate = startDate;
  let done = false
  while (!done) {
    const newDate = format(add(new Date(lastDate), { days: dayInterval }), 'yyyy-MM-dd');
    dates.push(newDate);
    lastDate = newDate;
    if (compareAsc(new Date(endDate), new Date(lastDate)) < 0) {
      done = true;
    }
  }

  dates.push(endDate);

  const percentageInterval = 100 / dates.length;

  return [dates, percentageInterval];
}

function DateLabel(props) {
  const { date, index, percentageInterval } = props;

  const dynamicStyle = {
    left: `calc(${percentageInterval * index}% - 15px)`,
  }

  return (
    <span className={styles.date} style={dynamicStyle}>{date}</span>
  );
}

export default function Timeline(props) {
  const { events, projectId, projectStart } = props;

  const firstEvent = events[0];
  const lastEvent = events[events.length - 1];
  const [timelineDuration, startDate, endDate] = useTimelineDuration(firstEvent, lastEvent);

  const [dates, percentageInterval] = useDates(startDate, endDate, timelineDuration);

  useTimelineListeners({
    startDate: projectStart,
    percentageInterval: percentageInterval,
  });

  const onFormEdit = useCallback(data => {
    console.log('submitting', data);
  });

  return (
    <TogglableForm onFormEdit={onFormEdit} className={styles.timelineContainer}>
      {props => {
        const { topLevelStyles, isEditMode, register } = props;

        return (
          <div className={topLevelStyles}>
            {dates.map((date, index) => <DateLabel
              date={date}
              index={index}
              percentageInterval={percentageInterval}
              key={index}
            />)}

            <canvas id="timeline" width="100%" height="200" className={styles.canvasLine}></canvas>

            {
              events.map(event =>
                <Event
                  key={event.id}
                  {...event}
                  percentageInterval={percentageInterval}
                  projectStart={projectStart}
                />
              )
            }
          </div>
        );
      }}
    </TogglableForm>
  );
}