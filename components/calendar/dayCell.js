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

function EventCell(props) {
  const {
    event = {},
    register = () => {},
    disabled,
    isEditMode,
    setIsSelected,
    isSelected,
  } = props;
  const eventAtDay = event || {};
  const { title, type, id, topic } = eventAtDay;

  const projectContext = useContext(ProjectContext);

  const onDeleteClick = useCallback(() => {
    projectContext.deleteEvent(id);
    setIsSelected(false);
  }, [projectContext && projectContext.deleteEvent, id, setIsSelected]);

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
          <span onClick={onDeleteClick} className={styles.deleteEvent}>
            x
          </span>
        </div>
      )}

      {isSelected && <Media {...eventAtDay} register={register} />}

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

function useCellBodyClass(
  eventsAtDay,
  isAnyEventAtDay,
  isAnyEventOngoing,
  areSelected
) {
  return useMemo(() => {
    let cellBodyClass = styles.cellBody;

    if (isAnyEventAtDay && eventsAtDay.some(e => e && e.type === 'START')) {
      cellBodyClass += ' ' + styles.start;
    } else if (
      isAnyEventAtDay &&
      eventsAtDay.some(e => e && e.type === 'MIDDLE')
    ) {
      cellBodyClass += ' ' + styles.middle;
    } else if (
      isAnyEventAtDay &&
      eventsAtDay.some(e => e && e.type === 'END')
    ) {
      cellBodyClass += ' ' + styles.end;
    } else if (isAnyEventAtDay) {
      cellBodyClass += ' ' + styles.withEvent;
    } else if (isAnyEventOngoing) {
      cellBodyClass += ' ' + styles.ongoing;
    }

    if (areSelected.some(e => e)) cellBodyClass += ' ' + styles.selected;

    return cellBodyClass;
  }, [eventsAtDay, isAnyEventAtDay, isAnyEventOngoing, areSelected]);
}

export default function DayCell(props) {
  const { date, eventsAtDay, register, isEditMode, isOngoingEvents, disabled } =
    props;

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

  const setIsSelected = useCallback(
    index => isSelected => {
      const newAreSelected = [...areSelected];
      newAreSelected[index] = isSelected;
      setAreSelected([...areSelected]);
    },
    [...areSelected, setAreSelected]
  );

  useEffect(() => {
    if (!isAnyEventAtDay) {
      setAreSelected(areSelected.fill(false));
    }
  }, [isAnyEventAtDay, setAreSelected]);

  const cellBodyClass = useCellBodyClass(
    eventsAtDay,
    isAnyEventAtDay,
    isAnyEventOngoing,
    areSelected
  );

  const projectContext = useContext(ProjectContext);

  const onCellSelect = useCallback(
    e => {
      if (isEditMode) {
        e.preventDefault();
        e.stopPropagation();
        projectContext.createEvent({
          id: uuid(),
          title: date,
          date,
          type: 'PROMPT',
        });
      }
    },
    [isEditMode, projectContext && projectContext.createEvent]
  );

  const onEventSelect = useCallback(
    e => {
      if (isEditMode && isAnyEventAtDay) {
        e.stopPropagation();
        e.preventDefault();

        setAreSelected(areSelected.fill(true));
      }
    },
    [isEditMode, isAnyEventAtDay, setAreSelected]
  );

  const onClickOutsideEvent = useCallback(() => {
    setAreSelected(areSelected.fill(false));
  }, [setAreSelected]);

  return (
    <div className={styles.cell} disabled={!isEditMode} onClick={onCellSelect}>
      <span className={styles.cellHeader}>
        {format(new Date(date), 'EE')} {format(new Date(date), 'd')}
      </span>
      {shouldShowEvent &&
        eventsAtDay.map((event, i) => {
          const setSelected = useCallback(setIsSelected(i), [setIsSelected]);
          return (
            <div className={cellBodyClass} key={`${date}-${i}`}>
              {(event || isOngoingEvents[i]) && (
                <OutsideAlerter
                  onClickOutside={onClickOutsideEvent}
                  enabled={isEditMode}
                  className={styles.event}
                  onClick={onEventSelect}
                >
                  {event && (
                    <EventCell
                      event={event}
                      register={register}
                      disabled={disabled}
                      isEditMode={isEditMode}
                      setIsSelected={setSelected}
                      isSelected={areSelected[i]}
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
