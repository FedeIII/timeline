import { v4 as uuid } from 'uuid';
import format from 'date-fns/format';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ProjectContext from '../../contexts/projectContext';
import styles from './calendar.module.scss';
import OutsideAlerter from '../HOCs/outsideAlerter';
import ProjectImage from '../projectImage';
import ProjectVideo from '../projectVideo';

function Media(props) {
  const { imgUrl, videoUrl } = props;

  if (videoUrl)
    return (
      <ProjectVideo
        className={styles.calendarVideo}
        videoWidth="100%"
        videoHeight="100%"
        {...props}
      />
    );
  else return <ImageInput {...props} />;
}

function ImageInput(props) {
  const { title, id, imgUrl, register } = props;

  if (imgUrl)
    return (
      <ProjectImage
        className={styles.calendarImage}
        imgUrl={imgUrl}
        alt={title}
      />
    );

  return (
    <div className={styles.noImage}>
      <span className={styles.imgUrlTag}>Image URL:</span>
      <input {...register(`${id}#imgUrl`)} className={styles.imgUrlInput} />
    </div>
  );
}

function useCellBodyClass(eventType, eventsAtDay, isOngoingEvent, isSelected) {
  return useMemo(() => {
    let cellBodyClass = styles.cellBody;

    if (eventType === 'START') {
      cellBodyClass += ' ' + styles.start;
    } else if (eventType === 'MIDDLE') {
      cellBodyClass += ' ' + styles.middle;
    } else if (eventType === 'END') {
      cellBodyClass += ' ' + styles.end;
    } else if (eventsAtDay) {
      cellBodyClass += ' ' + styles.withEvent;
    } else if (isOngoingEvent) {
      cellBodyClass += ' ' + styles.ongoing;
    }

    if (isSelected) cellBodyClass += ' ' + styles.selected;

    return cellBodyClass;
  }, [eventType, eventsAtDay, isOngoingEvent, isSelected]);
}

export default function DayCell(props) {
  const { day, eventsAtDay, register, isEditMode, isOngoingEvent } = props;
  const event = (eventsAtDay && eventsAtDay[0]) || {};
  const { title, type, id, imgUrl, topic } = event;

  const shouldShowEvent = isOngoingEvent || eventsAtDay;

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (!eventsAtDay) {
      setIsSelected(false);
    }
  }, [eventsAtDay, setIsSelected]);

  const cellBodyClass = useCellBodyClass(
    type,
    eventsAtDay,
    isOngoingEvent,
    isSelected
  );

  const { createEvent, deleteEvent } = useContext(ProjectContext);

  const onCellSelect = useCallback(() => {
    if (isEditMode) {
      const date = format(day, 'yyyy-MM-dd');
      createEvent({
        id: uuid(),
        title: date,
        date,
        type: 'PROMPT',
      });
    }
  }, [isEditMode, createEvent]);

  const onEventSelect = useCallback(
    e => {
      if (isEditMode && eventsAtDay && eventsAtDay.length) {
        e.stopPropagation();
        e.preventDefault();

        setIsSelected(true);
      }
    },
    [isEditMode, eventsAtDay, setIsSelected]
  );

  const onClickOutsideEvent = useCallback(() => {
    setIsSelected(false);
  }, [isSelected, setIsSelected]);

  const onDeleteClick = useCallback(() => {
    deleteEvent(id);
    setIsSelected(false);
  }, [deleteEvent, id, setIsSelected]);

  return (
    <div className={styles.cell} disabled={!isEditMode} onClick={onCellSelect}>
      <div className={styles.cellHeader}>
        {format(day, 'EE')} <span>{format(day, 'd')}</span>
      </div>
      <div className={cellBodyClass}>
        {shouldShowEvent && (
          <OutsideAlerter
            onClickOutside={onClickOutsideEvent}
            enabled={isEditMode}
            className={styles.event}
            onClick={onEventSelect}
          >
            {eventsAtDay && (
              <textarea
                defaultValue={title}
                {...register(`${id}#title`)}
                className={styles.eventInput}
                disabled={!isEditMode}
              />
            )}
            {isSelected && (
              <div className={styles.editMenu}>
                <span onClick={onDeleteClick} className={styles.deleteEvent}>
                  x
                </span>
              </div>
            )}
            {isSelected && <Media {...event} register={register} />}
            {isSelected && (
              <input
                defaultValue={topic}
                {...register(`${id}#topic`)}
                className={styles.topic}
              />
            )}
            {isSelected && (
              <select
                {...register(`${id}#type`)}
                className={styles.type}
                defaultValue={type}
              >
                <option value="START_PROJECT">Start Project</option>
                <option value="PROMPT">Prompt</option>
                <option value="START">Start</option>
                <option value="MIDDLE">Middle</option>
                <option value="END">End</option>
                <option value="END_PROJECT">End Project</option>
              </select>
            )}
          </OutsideAlerter>
        )}
      </div>
    </div>
  );
}
