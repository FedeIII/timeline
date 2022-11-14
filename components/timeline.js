import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import { useEffect, useMemo, useCallback } from 'react';

import Event from './event';
import styles from './timeline.module.scss';
import TogglableForm from './HOCs/togglableForm';
import CanvasEvents from '../utils/canvasEvents';
import { addEvent } from '../requests/projectRequests';

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

function useTimelineListeners({ startDate, projectId, projectDays, createEvent }) {
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
      });

      this.addRegionEventListener("mouseup", function () {
        var mousePos = events.getMousePos();
        message = `deselect at ${mousePos.x}`;

        const eventDays = projectDays * mousePos.x / canvas.width;

        const eventDate = addDays(new Date(startDate), eventDays);
        const eventDateFormatted = format(eventDate, 'yyyy-MM-dd');

        createEvent(projectId, {
          id: eventDateFormatted,
          title: eventDateFormatted,
          date: eventDateFormatted,
          type: 'PROMPT',
        });
      });

      this.closeRegion();

      CanvasEvents.writeMessage(context, message);
    });

    return () => {
      this.removeRegionEventListener("mousedown");
      this.removeRegionEventListener("mouseup");
    };
  }, []);
}

export default function Timeline(props) {
  const { events, projectId } = props;

  const timelineDuration = useTimelineDuration(events);
  const projectStart = events[0].date;

  useTimelineListeners({
    projectId,
    startDate: events[0].date,
    projectDays: timelineDuration,
    createEvent: addEvent,
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
            <canvas id="timeline" width="100%" height="200" className={styles.canvasLine}></canvas>
            {/* <div className={styles.line} /> */}
            {
              events.map(event =>
                <Event
                  key={event.id}
                  {...event}
                  timelineDuration={timelineDuration}
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