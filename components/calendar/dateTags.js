import format from 'date-fns/format';
import isFirstDayOfMonth from 'date-fns/isFirstDayOfMonth';
import isSameMonth from 'date-fns/isSameMonth';
import isSameYear from 'date-fns/isSameYear';
import styles from '../../pages/projects/index.module.scss';

function getCellWidth(events) {
  let isAnyEvent = false;
  let isAnyBorderEvent = false;
  let isAnyMiddleEvent = false;

  events.forEach(event => {
    if (event) {
      isAnyEvent = true;
      if (event.type === 'START' || event.type === 'END')
        isAnyBorderEvent = true;
      if (event.type === 'MIDDLE') isAnyMiddleEvent = true;
    }
  });

  let cellWidth = 70;
  if (isAnyMiddleEvent) cellWidth = 110;
  if (isAnyBorderEvent) cellWidth = 118;
  if (isAnyEvent && !isAnyMiddleEvent && !isAnyBorderEvent) cellWidth = 126;

  return cellWidth;
}

export function DateTags(props) {
  const { days } = props;

  return (
    <>
      <div className={styles.years}>
        {days.reduce((yearsComponents, day, index) => {
          const { date } = day;
          if (index === 0 || date.substring(5) === '01-01') {
            const width = days
              .slice(
                index,
                days.findIndex(
                  (d, i) =>
                    i > index && !isSameYear(new Date(d.date), new Date(date))
                )
              )
              .reduce((w, day) => w + getCellWidth(day.events), 0);

            return [
              ...yearsComponents,
              <div
                className={styles.dateTagContainer}
                style={{ width: width + 'px' }}
                key={date}
              >
                <span className={styles.dateTag}>
                  {format(new Date(date), 'yyyy')}
                </span>
              </div>,
            ];
          }

          return yearsComponents;
        }, [])}
      </div>

      <div className={styles.months}>
        {days.reduce((monthsComponents, day, index) => {
          const { date } = day;

          if (index === 0 || isFirstDayOfMonth(new Date(date))) {
            const width = days
              .slice(
                index,
                days.findIndex(
                  (d, i) =>
                    i > index && !isSameMonth(new Date(d.date), new Date(date))
                )
              )
              .reduce((w, day) => w + getCellWidth(day.events), 0);

            return [
              ...monthsComponents,
              <div
                className={styles.dateTagContainer}
                style={{ width: width + 'px' }}
                key={date}
              >
                <span className={styles.dateTag}>
                  {format(new Date(date), 'MMMM')}
                </span>
              </div>,
            ];
          }

          return monthsComponents;
        }, [])}
      </div>
    </>
  );
}
