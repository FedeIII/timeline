import { getDays } from '../components/hooks/useDays';

describe('useDays', () => {
  const RealDate = window.Date;
  window.Date = function (arg) {
    if (arg) return new RealDate(arg);
    else return new RealDate('2022-01-01');
  };
  window.Date.UTC = RealDate.UTC;

  test('no projects', () => {
    expect(getDays()).toEqual([
      {
        date: '2021-12-25',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2021-12-26',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2021-12-27',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2021-12-28',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2021-12-29',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2021-12-30',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2021-12-31',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-01-01',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-01-02',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-01-03',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-01-04',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-01-05',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-01-06',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-01-07',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-01-08',
        events: [null],
        isOngoingEvents: [false],
      },
    ]);
  });

  test('no events', () => {
    expect(getDays([{}, {}, {}])).toEqual([
      {
        date: '2021-12-25',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2021-12-26',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2021-12-27',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2021-12-28',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2021-12-29',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2021-12-30',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2021-12-31',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2022-01-01',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2022-01-02',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2022-01-03',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2022-01-04',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2022-01-05',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2022-01-06',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2022-01-07',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
      {
        date: '2022-01-08',
        events: [null, null, null],
        isOngoingEvents: [false, false, false],
      },
    ]);
  });

  test('one project, one event', () => {
    expect(getDays([{ events: [{ date: '2022-07-10' }] }])).toEqual([
      {
        date: '2022-07-03',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-04',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-05',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-06',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-07',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-08',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-09',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-10',
        events: [
          {
            date: '2022-07-10',
          },
        ],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-11',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-12',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-13',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-14',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-15',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-16',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-17',
        events: [null],
        isOngoingEvents: [false],
      },
    ]);
  });

  test('one project, multiple events', () => {
    expect(
      getDays([
        {
          events: [
            { date: '2022-07-10' },
            { date: '2022-07-13' },
            { date: '2022-07-17' },
          ],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-04',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-05',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-06',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-07',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-08',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-09',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-10',
        events: [
          {
            date: '2022-07-10',
          },
        ],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-11',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-12',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-13',
        events: [
          {
            date: '2022-07-13',
          },
        ],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-14',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-15',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-16',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-17',
        events: [
          {
            date: '2022-07-17',
          },
        ],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-18',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-19',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-20',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-21',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-22',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-23',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-24',
        events: [null],
        isOngoingEvents: [false],
      },
    ]);
  });

  test('one project, ongoing events', () => {
    expect(
      getDays([
        {
          events: [
            { date: '2022-07-10', type: 'START', topic: 'some topic' },
            { date: '2022-07-13', type: 'END', topic: 'some topic' },
            { date: '2022-07-17' },
          ],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-04',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-05',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-06',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-07',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-08',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-09',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-10',
        events: [
          {
            date: '2022-07-10',
            type: 'START',
            topic: 'some topic',
          },
        ],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-11',
        events: [null],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-12',
        events: [null],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-13',
        events: [
          {
            date: '2022-07-13',
            type: 'END',
            topic: 'some topic',
          },
        ],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-14',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-15',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-16',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-17',
        events: [
          {
            date: '2022-07-17',
          },
        ],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-18',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-19',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-20',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-21',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-22',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-23',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-24',
        events: [null],
        isOngoingEvents: [false],
      },
    ]);
  });

  test('one project, 3 ongoing events', () => {
    expect(
      getDays([
        {
          events: [
            { date: '2022-07-10', type: 'START', topic: 'some topic' },
            { date: '2022-07-13', type: 'END', topic: 'some topic' },
            { date: '2022-07-15', type: 'START', topic: 'some other topic' },
            { date: '2022-07-17', type: 'END', topic: 'some other topic' },
            { date: '2022-07-20', type: 'START', topic: 'one last topic' },
            { date: '2022-07-21', type: 'END', topic: 'one last topic' },
            { date: '2022-07-23' },
          ],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-04',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-05',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-06',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-07',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-08',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-09',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-10',
        events: [
          {
            date: '2022-07-10',
            type: 'START',
            topic: 'some topic',
          },
        ],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-11',
        events: [null],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-12',
        events: [null],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-13',
        events: [
          {
            date: '2022-07-13',
            type: 'END',
            topic: 'some topic',
          },
        ],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-14',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-15',
        events: [
          {
            date: '2022-07-15',
            type: 'START',
            topic: 'some other topic',
          },
        ],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-16',
        events: [null],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-17',
        events: [
          {
            date: '2022-07-17',
            type: 'END',
            topic: 'some other topic',
          },
        ],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-18',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-19',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-20',
        events: [
          {
            date: '2022-07-20',
            type: 'START',
            topic: 'one last topic',
          },
        ],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-21',
        events: [
          {
            date: '2022-07-21',
            type: 'END',
            topic: 'one last topic',
          },
        ],
        isOngoingEvents: [true],
      },
      {
        date: '2022-07-22',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-23',
        events: [
          {
            date: '2022-07-23',
          },
        ],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-24',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-25',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-26',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-27',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-28',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-29',
        events: [null],
        isOngoingEvents: [false],
      },
      {
        date: '2022-07-30',
        events: [null],
        isOngoingEvents: [false],
      },
    ]);
  });

  test('two projects, gap', () => {
    expect(
      getDays([
        {
          events: [
            { date: '2022-07-10' },
            { date: '2022-07-11' },
            { date: '2022-07-12' },
          ],
        },
        {
          events: [
            { date: '2022-07-15' },
            { date: '2022-07-16' },
            { date: '2022-07-17' },
          ],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-04',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-05',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-06',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-07',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-08',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-09',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-10',
        events: [
          {
            date: '2022-07-10',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-11',
        events: [
          {
            date: '2022-07-11',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-12',
        events: [
          {
            date: '2022-07-12',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-13',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-14',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-15',
        events: [
          null,
          {
            date: '2022-07-15',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-16',
        events: [
          null,
          {
            date: '2022-07-16',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-17',
        events: [
          null,
          {
            date: '2022-07-17',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-18',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-19',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-20',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-21',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-22',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-23',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-24',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
    ]);
  });

  test('two projects, overlap at end, same days', () => {
    expect(
      getDays([
        {
          events: [
            { date: '2022-07-10' },
            { date: '2022-07-11' },
            { date: '2022-07-12' },
            { date: '2022-07-13' },
          ],
        },
        {
          events: [
            { date: '2022-07-12' },
            { date: '2022-07-13' },
            { date: '2022-07-14' },
          ],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-04',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-05',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-06',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-07',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-08',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-09',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-10',
        events: [
          {
            date: '2022-07-10',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-11',
        events: [
          {
            date: '2022-07-11',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-12',
        events: [
          {
            date: '2022-07-12',
          },
          {
            date: '2022-07-12',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-13',
        events: [
          {
            date: '2022-07-13',
          },
          {
            date: '2022-07-13',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-14',
        events: [
          null,
          {
            date: '2022-07-14',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-15',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-16',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-17',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-18',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-19',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-20',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-21',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
    ]);
  });

  test('two projects, overlap at end, different days', () => {
    expect(
      getDays([
        {
          events: [
            { date: '2022-07-10' },
            { date: '2022-07-11' },
            { date: '2022-07-13' },
          ],
        },
        {
          events: [
            { date: '2022-07-12' },
            { date: '2022-07-14' },
            { date: '2022-07-15' },
          ],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-04',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-05',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-06',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-07',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-08',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-09',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-10',
        events: [
          {
            date: '2022-07-10',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-11',
        events: [
          {
            date: '2022-07-11',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-12',
        events: [
          null,
          {
            date: '2022-07-12',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-13',
        events: [
          {
            date: '2022-07-13',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-14',
        events: [
          null,
          {
            date: '2022-07-14',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-15',
        events: [
          null,
          {
            date: '2022-07-15',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-16',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-17',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-18',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-19',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-20',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-21',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-22',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
    ]);
  });

  test('two projects, second is contained, same days', () => {
    expect(
      getDays([
        {
          events: [
            { date: '2022-07-10' },
            { date: '2022-07-11' },
            { date: '2022-07-12' },
            { date: '2022-07-13' },
          ],
        },
        {
          events: [{ date: '2022-07-11' }, { date: '2022-07-12' }],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-04',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-05',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-06',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-07',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-08',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-09',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-10',
        events: [
          {
            date: '2022-07-10',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-11',
        events: [
          {
            date: '2022-07-11',
          },
          {
            date: '2022-07-11',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-12',
        events: [
          {
            date: '2022-07-12',
          },
          {
            date: '2022-07-12',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-13',
        events: [
          {
            date: '2022-07-13',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-14',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-15',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-16',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-17',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-18',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-19',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-20',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
    ]);
  });

  test('two projects, second is contained, different days', () => {
    expect(
      getDays([
        {
          events: [
            { date: '2022-07-10' },
            { date: '2022-07-11' },
            { date: '2022-07-15' },
          ],
        },
        {
          events: [{ date: '2022-07-13' }, { date: '2022-07-14' }],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-04',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-05',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-06',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-07',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-08',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-09',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-10',
        events: [
          {
            date: '2022-07-10',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-11',
        events: [
          {
            date: '2022-07-11',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-12',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-13',
        events: [
          null,
          {
            date: '2022-07-13',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-14',
        events: [
          null,
          {
            date: '2022-07-14',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-15',
        events: [
          {
            date: '2022-07-15',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-16',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-17',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-18',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-19',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-20',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-21',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-22',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
    ]);
  });

  test('two projects, first is contained, same days', () => {
    expect(
      getDays([
        {
          events: [{ date: '2022-07-11' }, { date: '2022-07-12' }],
        },
        {
          events: [
            { date: '2022-07-10' },
            { date: '2022-07-11' },
            { date: '2022-07-12' },
            { date: '2022-07-13' },
          ],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-04',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-05',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-06',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-07',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-08',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-09',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-10',
        events: [
          null,
          {
            date: '2022-07-10',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-11',
        events: [
          {
            date: '2022-07-11',
          },
          {
            date: '2022-07-11',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-12',
        events: [
          {
            date: '2022-07-12',
          },
          {
            date: '2022-07-12',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-13',
        events: [
          null,
          {
            date: '2022-07-13',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-14',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-15',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-16',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-17',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-18',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-19',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-20',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
    ]);
  });

  test('two projects, first is contained, different days', () => {
    expect(
      getDays([
        {
          events: [{ date: '2022-07-13' }, { date: '2022-07-14' }],
        },
        {
          events: [
            { date: '2022-07-10' },
            { date: '2022-07-11' },
            { date: '2022-07-15' },
          ],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-04',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-05',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-06',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-07',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-08',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-09',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-10',
        events: [
          null,
          {
            date: '2022-07-10',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-11',
        events: [
          null,
          {
            date: '2022-07-11',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-12',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-13',
        events: [
          {
            date: '2022-07-13',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-14',
        events: [
          {
            date: '2022-07-14',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-15',
        events: [
          null,
          {
            date: '2022-07-15',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-16',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-17',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-18',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-19',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-20',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-21',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-22',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
    ]);
  });

  test('two projects, overlap at start, same days', () => {
    expect(
      getDays([
        {
          events: [
            { date: '2022-07-12' },
            { date: '2022-07-13' },
            { date: '2022-07-14' },
          ],
        },
        {
          events: [
            { date: '2022-07-10' },
            { date: '2022-07-11' },
            { date: '2022-07-12' },
            { date: '2022-07-13' },
          ],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-04',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-05',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-06',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-07',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-08',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-09',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-10',
        events: [
          null,
          {
            date: '2022-07-10',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-11',
        events: [
          null,
          {
            date: '2022-07-11',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-12',
        events: [
          {
            date: '2022-07-12',
          },
          {
            date: '2022-07-12',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-13',
        events: [
          {
            date: '2022-07-13',
          },
          {
            date: '2022-07-13',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-14',
        events: [
          {
            date: '2022-07-14',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-15',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-16',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-17',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-18',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-19',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-20',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-21',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
    ]);
  });

  test('two projects, overlap at start, different days', () => {
    expect(
      getDays([
        {
          events: [
            { date: '2022-07-12' },
            { date: '2022-07-14' },
            { date: '2022-07-15' },
          ],
        },
        {
          events: [
            { date: '2022-07-10' },
            { date: '2022-07-11' },
            { date: '2022-07-13' },
          ],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-04',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-05',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-06',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-07',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-08',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-09',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-10',
        events: [
          null,
          {
            date: '2022-07-10',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-11',
        events: [
          null,
          {
            date: '2022-07-11',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-12',
        events: [
          {
            date: '2022-07-12',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-13',
        events: [
          null,
          {
            date: '2022-07-13',
          },
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-14',
        events: [
          {
            date: '2022-07-14',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-15',
        events: [
          {
            date: '2022-07-15',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-16',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-17',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-18',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-19',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-20',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-21',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-22',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
    ]);
  });

  test('two projects, overlap, ongoing events', () => {
    expect(
      getDays([
        {
          events: [
            { date: '2022-07-10' },
            { date: '2022-07-13', type: 'START', topic: 'some topic' },
            { date: '2022-07-17', type: 'END', topic: 'some topic' },
          ],
        },
        {
          events: [
            { date: '2022-07-11', type: 'START', topic: 'some other topic' },
            { date: '2022-07-15', type: 'END', topic: 'some other topic' },
            { date: '2022-07-20' },
          ],
        },
      ])
    ).toEqual([
      {
        date: '2022-07-03',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-04',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-05',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-06',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-07',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-08',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-09',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-10',
        events: [
          {
            date: '2022-07-10',
          },
          null,
        ],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-11',
        events: [
          null,
          { date: '2022-07-11', type: 'START', topic: 'some other topic' },
        ],
        isOngoingEvents: [false, true],
      },
      {
        date: '2022-07-12',
        events: [null, null],
        isOngoingEvents: [false, true],
      },
      {
        date: '2022-07-13',
        events: [
          { date: '2022-07-13', type: 'START', topic: 'some topic' },
          null,
        ],
        isOngoingEvents: [true, true],
      },
      {
        date: '2022-07-14',
        events: [null, null],
        isOngoingEvents: [true, true],
      },
      {
        date: '2022-07-15',
        events: [
          null,
          { date: '2022-07-15', type: 'END', topic: 'some other topic' },
        ],
        isOngoingEvents: [true, true],
      },
      {
        date: '2022-07-16',
        events: [null, null],
        isOngoingEvents: [true, false],
      },
      {
        date: '2022-07-17',
        events: [
          { date: '2022-07-17', type: 'END', topic: 'some topic' },
          null,
        ],
        isOngoingEvents: [true, false],
      },
      {
        date: '2022-07-18',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-19',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-20',
        events: [null, { date: '2022-07-20' }],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-21',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-22',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-23',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-24',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-25',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-26',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
      {
        date: '2022-07-27',
        events: [null, null],
        isOngoingEvents: [false, false],
      },
    ]);
  });
});
