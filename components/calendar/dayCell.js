import { v4 as uuid } from 'uuid';
import format from 'date-fns/format';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './calendar.module.scss';
import OutsideAlerter from '../HOCs/outsideAlerter';
import { EventCell } from './eventCell';
import { ProjectLine } from './projectLine';

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
      if (eventsAtDay[i] && eventsAtDay[i]._local)
        cellBodyClass += ' ' + styles.create;

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

  useEffect(() => {
    // on project delete
    // on create event response
    setEventsAtDay(events);
  }, [events.length, events[0] && events[0].id]);

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
    [areSelected]
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
        setIsSelected.at0(true);
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

  const onCreate = useCallback(
    newEvent => {
      setEventsAtDay([newEvent]);
    },
    [eventsAtDay]
  );

  return (
    <div className={styles.cell} disabled={!isEditMode} onClick={onCellSelect}>
      <div className={styles.cellHeader}>
        {format(new Date(date), 'EE')} {format(new Date(date), 'd')}
      </div>
      {eventsAtDay.map((_, i) => (
        <ProjectLine
          key={i}
          index={i}
          date={date}
          firstDates={firstDates}
          lastDates={lastDates}
        />
      ))}

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
