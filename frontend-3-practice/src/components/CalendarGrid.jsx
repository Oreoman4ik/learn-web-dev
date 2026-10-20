import {
  buildCalendarGrid, compareDates, formatDate, isDateSelectable, MONTHS_NOMINATIVE,
} from '../utils/date.js';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function CalendarGrid({ month, year, today, selectedDay, onDayClick }) {
  const cells = buildCalendarGrid(year, month).flat();

  return (
    <>
      <div className="calendar-weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday, index) => (
          <span className={`weekday${index >= 5 ? ' weekend' : ''}`} key={weekday}>
            {weekday}
          </span>
        ))}
      </div>

      <div className="calendar-grid" aria-label={`Календарь: ${MONTHS_NOMINATIVE[month]} ${year}`}>
        {cells.map((cell, index) => {
          const date = new Date(cell.year, cell.month, cell.day);
          const selectable = isDateSelectable(cell.day, cell.month, cell.year, today);
          const selected = compareDates(date, selectedDay) === 0;
          const classes = [
            'calendar-day',
            cell.otherMonth && 'other-month',
            index % 7 >= 5 && 'weekend',
            selected && 'selected',
            !selectable && 'disabled',
          ].filter(Boolean).join(' ');

          return (
            <button
              className={classes}
              type="button"
              key={index}
              aria-label={formatDate(date)}
              aria-pressed={selected}
              aria-current={compareDates(date, today) === 0 ? 'date' : undefined}
              disabled={!selectable}
              onClick={() => onDayClick(date)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </>
  );
}
