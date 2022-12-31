import { v4 as uuid } from 'uuid';
import format from 'date-fns/format';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ProjectContext from '../../contexts/projectContext';
import styles from './calendar.module.scss';
import OutsideAlerter from '../HOCs/outsideAlerter';
import ProjectImage from '../projectImage';
import ProjectVideo from '../projectVideo';

function Media(props) {
  const { event } = props;
  const { imgUrl, videoUrl } = event;

  if (videoUrl)
    return (
      <ProjectVideo
        className={styles.calendarMedia}
        videoWidth="100%"
        videoHeight="100%"
        {...event}
      />
    );
  else return <ImageInput {...props} />;
}

function ImageInput(props) {
  const { event, register } = props;
  const { title, id, imgUrl } = event;

  if (imgUrl)
    return (
      <ProjectImage
        className={styles.calendarMedia}
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

function MiddleRow(props) {
  const { event, disabled, isEditMode, register } = props;
  const { description, id, imgUrl, videoUrl } = event;

  const [isMediaSelected, setIsMediaSelected] = useState(
    !!(imgUrl || videoUrl)
  );

  let className = styles.middleRow;
  if (isMediaSelected) className += ' ' + styles.mediaSelected;

  return (
    <div className={className}>
      <Media {...props} />
      <textarea
        defaultValue={description}
        {...register(`${id}#description`)}
        className={styles.eventDescription}
        disabled={disabled || !isEditMode}
        onFocus={() => setIsMediaSelected(false)}
        onBlur={() => setIsMediaSelected(true)}
      />
    </div>
  );
}

function EventCell(props) {
  const {
    event = {},
    register = () => {},
    disabled,
    isEditMode,
    setIsSelected,
    isSelected,
    onDelete,
    onCreate,
  } = props;
  const eventAtDay = event || {};
  const {
    title,
    type,
    id,
    topic,
    date,
    imgUrl,
    videoUrl,
    description,
    _local,
  } = eventAtDay;

  const projectContext = useContext(ProjectContext);

  const onDeleteClick = useCallback(() => {
    projectContext.deleteEvent(id);
    setIsSelected(false);
    onDelete();
  }, [projectContext && projectContext.deleteEvent, id, setIsSelected]);

  const onCreateClick = () => {
    projectContext.createEvent({
      id,
      imgUrl,
      videoUrl,
      title,
      description,
      date,
      type,
      topic,
    });
    onCreate();
  };

  return (
    <>
      {id && (
        <textarea
          defaultValue={title}
          {...register(`${id}#title`)}
          className={styles.eventInput}
          disabled={disabled || !isEditMode}
        />
      )}

      {isSelected && (
        <div className={styles.editMenu}>
          {_local && (
            <span onClick={onCreateClick} className={styles.createEvent}>
              ✓
            </span>
          )}
          <span onClick={onDeleteClick} className={styles.deleteEvent}>
            x
          </span>
        </div>
      )}

      {isSelected && (
        <MiddleRow
          event={eventAtDay}
          register={register}
          disabled={disabled}
          isEditMode={isEditMode}
        />
      )}

      {isSelected && (
        <input
          defaultValue={topic}
          {...register(`${id}#topic`)}
          className={styles.topic}
          disabled={disabled || !isEditMode}
        />
      )}

      {isSelected && (
        <select
          {...register(`${id}#type`)}
          className={styles.type}
          defaultValue={type}
          disabled={disabled || !isEditMode}
        >
          <option value="START_PROJECT">Start Project</option>
          <option value="PROMPT">Prompt</option>
          <option value="START">Start</option>
          <option value="MIDDLE">Middle</option>
          <option value="END">End</option>
          <option value="END_PROJECT">End Project</option>
        </select>
      )}
    </>
  );
}

function useCellBodyClass(eventsAtDay, isAnyEventOngoing, areSelected) {
  return useMemo(() => {
    return eventsAtDay.map((event, i) => {
      let cellBodyClass = styles.cellBody;

      if (event && event.type === 'START') {
        cellBodyClass += ' ' + styles.start;
      } else if (event && event.type === 'MIDDLE') {
        cellBodyClass += ' ' + styles.middle;
      } else if (event && event.type === 'END') {
        cellBodyClass += ' ' + styles.end;
      } else if (event) {
        cellBodyClass += ' ' + styles.withEvent;
      } else if (isAnyEventOngoing) {
        cellBodyClass += ' ' + styles.ongoing;
      }

      if (areSelected[i]) cellBodyClass += ' ' + styles.selected;

      return cellBodyClass;
    });
  }, [eventsAtDay, isAnyEventOngoing, areSelected]);
}

export default function DayCell(props) {
  const {
    date,
    events,
    register,
    isEditMode,
    isOngoingEvents,
    firstDates,
    lastDates,
    disabled,
  } = props;

  const [eventsAtDay, setEventsAtDay] = useState(events);

  const isAnyEventOngoing = useMemo(() => {
    return isOngoingEvents.some(e => e);
  }, [isOngoingEvents]);
  const isAnyEventAtDay = useMemo(() => {
    return eventsAtDay.some(e => e);
  }, [eventsAtDay]);
  const shouldShowEvent = useMemo(() => {
    return isAnyEventOngoing || isAnyEventAtDay;
  }, [isAnyEventOngoing, isAnyEventAtDay]);

  const [areSelected, setAreSelected] = useState(
    Array(eventsAtDay.length).fill(false)
  );

  const setIsSelected = useMemo(
    () =>
      areSelected.reduce((acc, _, i) => {
        return {
          ...acc,
          [`at${i}`]: isSelected => {
            const newAreSelected = [...areSelected];
            newAreSelected[i] = isSelected;
            setAreSelected([...newAreSelected]);
          },
        };
      }, {}),
    [areSelected, setAreSelected]
  );

  useEffect(() => {
    if (!isAnyEventAtDay) {
      setAreSelected([...areSelected.fill(false)]);
    }
  }, []);

  const onCellSelect = useCallback(
    e => {
      if (isEditMode && !isAnyEventAtDay) {
        e.preventDefault();
        e.stopPropagation();
        setEventsAtDay([
          ...eventsAtDay.filter(e => e),
          {
            id: uuid(),
            title: date,
            date,
            type: 'PROMPT',
            _local: true,
          },
        ]);
      }
    },
    [isEditMode, isAnyEventAtDay, date, eventsAtDay]
  );

  const onEventSelect = useCallback(
    i => e => {
      if (isEditMode && isAnyEventAtDay && !areSelected[i]) {
        e.stopPropagation();
        e.preventDefault();

        setIsSelected[`at${i}`](true);
      }
    },
    [isEditMode, isAnyEventAtDay, areSelected]
  );

  const onClickOutsideEvent = useCallback(
    i => () => {
      if (areSelected[i]) {
        setIsSelected[`at${i}`](false);
      }
    },
    [areSelected]
  );

  const cellBodyClasses = useCellBodyClass(
    eventsAtDay,
    isAnyEventOngoing,
    areSelected
  );

  const onDelete = useCallback(() => {
    setEventsAtDay([null]);
  }, []);

  const onCreate = useCallback(() => {
    const event = eventsAtDay[0];
    event._local = false;
    setEventsAtDay([event]);
  }, [eventsAtDay]);

  return (
    <div className={styles.cell} disabled={!isEditMode} onClick={onCellSelect}>
      <span className={styles.cellHeader}>
        {format(new Date(date), 'EE')} {format(new Date(date), 'd')}
      </span>
      {eventsAtDay.map((_, i) => {
        let lineStyles = {
          // top: `${80 * (i + 1) + 12 * i}px`,
          top: `${92 * i + 80}px`,
        };

        if (
          isBefore(new Date(date), new Date(firstDates[i])) ||
          isAfter(new Date(date), new Date(lastDates[i]))
        ) {
          lineStyles = {
            ...lineStyles,
            height: '3px',
            border: 'none',
            marginTop: '0.5em',
            backgroundColor: 'lightgray',
          };
        }

        return <hr className={styles.projectLine} style={lineStyles} key={i} />;
      })}
      {shouldShowEvent &&
        eventsAtDay.map((event, i) => {
          return (
            <div className={cellBodyClasses[i]} key={`${date}-${i}`}>
              {(event || isOngoingEvents[i]) && (
                <OutsideAlerter
                  onClickOutside={onClickOutsideEvent(i)}
                  enabled={isEditMode}
                  className={styles.event}
                  onClick={onEventSelect(i)}
                >
                  {event && (
                    <EventCell
                      event={event}
                      register={register}
                      disabled={disabled}
                      isEditMode={isEditMode}
                      setIsSelected={setIsSelected[`at${i}`]}
                      isSelected={areSelected[i]}
                      onDelete={onDelete}
                      onCreate={onCreate}
                    />
                  )}
                </OutsideAlerter>
              )}
            </div>
          );
        })}
    </div>
  );
}
