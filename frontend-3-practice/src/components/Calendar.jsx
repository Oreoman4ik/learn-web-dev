import CalendarHeader from './CalendarHeader.jsx';
import CalendarGrid from './CalendarGrid.jsx';

export default function Calendar({
  month, year, today, selectedDay, onDayClick, onPrevMonth, onNextMonth,
}) {
  return (
    <section className="calendar-card" aria-labelledby="calendar-title">
      <CalendarHeader
        month={month}
        year={year}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
      <CalendarGrid
        month={month}
        year={year}
        today={today}
        selectedDay={selectedDay}
        onDayClick={onDayClick}
      />
    </section>
  );
}
