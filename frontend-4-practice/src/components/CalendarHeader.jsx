import { MONTHS_NOMINATIVE } from '../utils/date.js';

export default function CalendarHeader({ month, year, onPrevMonth, onNextMonth }) {
  return (
    <header className="calendar-header">
      <button
        className="calendar-arrow"
        type="button"
        aria-label="Предыдущий месяц"
        onClick={onPrevMonth}
      >
        ←
      </button>
      <h2 className="calendar-title" id="calendar-title" aria-live="polite">
        {MONTHS_NOMINATIVE[month]} {year}
      </h2>
      <button
        className="calendar-arrow"
        type="button"
        aria-label="Следующий месяц"
        onClick={onNextMonth}
      >
        →
      </button>
    </header>
  );
}
