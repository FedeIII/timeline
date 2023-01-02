import isAfter from 'date-fns/isAfter';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import add from 'date-fns/add';
import format from 'date-fns/format';
import { useMemo } from 'react';

const DAYS_BEFORE_START = 7;
const DAYS_AFTER_END = 7;
const MIN_NUMBER_OF_DAYS = 28;
const MIN_DAYS_AFTER_START = 7;

function getEventsAtDay(day, events) {
  const eventsAtDay = events.filter(
    event => format(day, 'yyyy-MM-dd') === event.date
  );

  if (eventsAtDay.length > 0) return eventsAtDay;
  else return null;
}

// [1,2,3,4,5]
//                 [8,9,10]

// [1,2,3,4,5]
//       [4,5,6]

// [1,2,3,4,5]
//   [2,3,4]

//   [2,3,4]
// [1,2,3,4,5]

//       [4,5,6]
// [1,2,3,4,5]

//                 [8,9,10]
// [1,2,3,4,5]

function isNextDay(day, previousDay) {
  return (
    formatDistanceStrict(new Date(day), new Date(previousDay), {
      unit: 'day',
    }) === '1 day' && isAfter(new Date(day), new Date(previousDay))
  );
}

// export function getDays(projects = []) {
//   const isOngoingEvent = [];
//   const days =
//     projects.reduce((days, project, projectIndex) => {
//       const { events = [] } = project;

//       isOngoingEvent[projectIndex] = false;

//       return events.reduce((days, event) => {
//         // console.log('event', event);
//         // console.log('days', days);
//         let firstDate = days && days[0] && days[0].date;
//         let lastDate =
//           days && days[days.length - 1] && days[days.length - 1].date;

//         if (firstDate && lastDate) {
//           if (isNextDay(event.date, lastDate)) {
//             if (event.type === 'START') isOngoingEvent[projectIndex] = true;
//             if (event.type === 'END') isOngoingEvent[projectIndex] = false;

//             // console.log('isNextDay', [
//             //   ...days,
//             //   {
//             //     date: event.date,
//             //     isOngoingEvent,
//             //     events: [event],
//             //   },
//             // ], isOngoingEvent);
//             return [
//               ...days,
//               {
//                 date: event.date,
//                 isOngoingEvent,
//                 events: [event],
//               },
//             ];
//           } else {
//             while (!isNextDay(event.date, lastDate)) {
//               lastDate = add(new Date(lastDate), { days: 1 });
//               lastDate = format(lastDate, 'yyyy-MM-dd');
//               days.push({
//                 date: lastDate,
//                 isOngoingEvent,
//                 events: null,
//               });
//             }

//             const previousIsOngoingEvent = isOngoingEvent.slice();
//             if (event.type === 'START') isOngoingEvent[projectIndex] = true;
//             if (event.type === 'END') isOngoingEvent[projectIndex] = false;

//             // console.log('not next day', [
//             //   ...days,
//             //   {
//             //     date: event.date,
//             //     isOngoingEvent: previousIsOngoingEvent,
//             //     events: [event],
//             //   },
//             // ], isOngoingEvent);
//             return [
//               ...days,
//               {
//                 date: event.date,
//                 isOngoingEvent: previousIsOngoingEvent,
//                 events: [event],
//               },
//             ];
//           }
//         } else {
//           if (event.type === 'START') isOngoingEvent[projectIndex] = true;
//           if (event.type === 'END') isOngoingEvent[projectIndex] = false;

//           // console.log('no first and last date', [
//           //   {
//           //     date: event.date,
//           //     isOngoingEvent,
//           //     events: [event],
//           //   },
//           // ], isOngoingEvent);
//           return [
//             {
//               date: event.date,
//               isOngoingEvent,
//               events: [event],
//             },
//           ];
//         }
//       }, days);
//     }, []) || [];

//   console.log('test days', days);

//   // 7 days before start
//   const firstDate =
//     (days && days[0] && days[0].date) || format(new Date(), 'yyyy-MM-dd');
//   for (let i = 1; i <= DAYS_BEFORE_START; i++) {
//     let newDate = add(new Date(firstDate), { days: -i });
//     newDate = format(newDate, 'yyyy-MM-dd');
//     days.unshift({ date: newDate, isOngoingEvent: false, events: null });
//   }

//   // 7 days after end
//   for (let i = 1; i <= DAYS_AFTER_END; i++) {
//     let newDate = add(new Date(days[days.length - 1].date), { days: 1 });
//     newDate = format(newDate, 'yyyy-MM-dd');
//     days.push({ date: newDate, isOngoingEvent: false, events: null });
//   }

//   return days;
// }

export function getDays(projects = []) {
  const startDates = projects
    .map(
      project => project.events && project.events[0] && project.events[0].date
    )
    .filter(date => date)
    .sort();

  const endDates = projects
    .map(
      project =>
        project.events &&
        project.events[project.events.length - 1] &&
        project.events[project.events.length - 1].date
    )
    .filter(date => date)
    .sort();

  // console.log('startDates', startDates);
  // console.log('endDates', endDates);

  const firstDate = startDates[0] || format(new Date(), 'yyyy-MM-dd');
  const lastDate =
    endDates[endDates.length - 1] || format(new Date(), 'yyyy-MM-dd');
  const distanceInDays = parseInt(
    formatDistanceStrict(new Date(firstDate), new Date(lastDate), {
      unit: 'day',
    }).split(' ')[0],
    10
  );
  const numberOfProjects = projects.length || 1;

  // console.log('firstDate', firstDate);
  // console.log('lastDate', lastDate);
  // console.log('distanceInDays', distanceInDays);

  const days = [];
  for (let i = -DAYS_BEFORE_START; i <= distanceInDays + DAYS_AFTER_END; i++) {
    days.push({
      date: format(add(new Date(firstDate), { days: i }), 'yyyy-MM-dd'),
      isOngoingEvents: Array(numberOfProjects).fill(false),
      events: Array(numberOfProjects).fill(null),
    });
  }

  projects.forEach((project = {}, projectIndex) => {
    if (project.events) {
      project.events.forEach(event => {
        if (event) {
          const eventDayIndex = days.findIndex(day => day.date === event.date);
          const eventDay = days[eventDayIndex];

          if (event.type === 'START') {
            eventDay.isOngoingEvents[projectIndex] = true;
            const endEvent = project.events.find(
              otherEvent =>
                otherEvent.topic &&
                otherEvent.topic === event.topic &&
                otherEvent.type === 'END'
            );
            const endEventDateIndex = endEvent && days.findIndex(
              day => day.date === endEvent.date
            ) || days.length - 1;
            days.slice(eventDayIndex, endEventDateIndex).forEach(day => {
              day.isOngoingEvents[projectIndex] = true;
            });
          } else if (event.type === 'END') {
            eventDay.isOngoingEvents[projectIndex] = true;
          } else {
            eventDay.isOngoingEvents[projectIndex] = false;
          }

          eventDay.events[projectIndex] = event;
        }
      });
    }
  });

  return days;
}

const emptyArray = [];

export function useDaysProjects(projects = emptyArray) {
  return useMemo(() => getDays(projects), [projects]);
}

export function useDaysEvents(events = emptyArray) {
  return useMemo(() => getDays([{ events }]), [events]);
}

// [{
//   date: '2022- 01-08',
//   isOngoingEvent: [false, true],
//   events: [Event]
// }]

// export default function useDays(events = []) {
//   return useMemo(() => {
//     const firstEvent = events[0];
//     const lastEvent = events[events.length - 1];
//     const firstDate =
//       (firstEvent && firstEvent.date) || format(new Date(), 'yyyy-MM-dd');
//     const lastDate =
//       (lastEvent && lastEvent.date) ||
//       format(add(new Date(), { days: MIN_DAYS_AFTER_START }), 'yyyy-MM-dd');

//     // add starting date
//     let isOngoingEvent = false;
//     const days = [];
//     let previousDate = new Date(firstDate);
//     days.push({
//       date: previousDate,
//       isOngoingEvent: false,
//       eventsAtDay: firstEvent ? [firstEvent] : null,
//     });

//     function addDate() {
//       const newDate = add(new Date(previousDate), { days: 1 });

//       const eventsAtDay = getEventsAtDay(newDate, events);
//       const event = (eventsAtDay && eventsAtDay[0]) || {};
//       const { type } = event;

//       if (type === 'START') isOngoingEvent = true;
//       if (type === 'END') isOngoingEvent = false;

//       days.push({ date: newDate, isOngoingEvent, eventsAtDay });
//       previousDate = newDate;

//       return newDate;
//     }

//     // add dates until last event
//     let done = false;
//     while (!done) {
//       const newDate = addDate();

//       if (compareAsc(new Date(lastDate), new Date(newDate)) < 0) {
//         done = true;
//       }
//     }

//     // add dates until minimum amount of dates
//     let minNumberOfExtraDays = MIN_NUMBER_OF_DAYS - days.length;
//     if (minNumberOfExtraDays < 0) minNumberOfExtraDays = MIN_NUMBER_OF_DAYS;
//     for (let index = 1; index <= minNumberOfExtraDays; index++) {
//       addDate();
//     }

//     // add days before the start
//     for (let index = 1; index <= DAYS_BEFORE_START; index++) {
//       const newDate = add(new Date(days[0].date), { days: -1 });
//       days.unshift({ date: newDate, isOngoingEvent: false, eventsAtDay: null });
//     }

//     return days;
//   }, [events]);
// }
