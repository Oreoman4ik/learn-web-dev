import { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import StepIndicator from './components/StepIndicator.jsx';
import Calendar from './components/Calendar.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import { formatDate, isDateSelectable } from './utils/date.js';
import { getSlots } from './data/slots.js';
import './styles/booking.css';

export default function App() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  // Полная дата сохраняется независимо от просматриваемого месяца.
  const [selectedDay, setSelectedDay] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() => getSlots(today));

  function handleDayClick(date) {
    if (!isDateSelectable(date.getDate(), date.getMonth(), date.getFullYear(), today)) return;

    setSelectedDay(date);
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
    setSelectedTime(null);
    setSlots(getSlots(date));
  }

  function handleTimeClick(time) {
    if (!slots.some((slot) => slot.time === time && slot.available)) return;
    setSelectedTime(time);
  }

  function handleMonthChange(direction) {
    const month = new Date(currentYear, currentMonth + direction, 1);
    setCurrentMonth(month.getMonth());
    setCurrentYear(month.getFullYear());
  }

  function handleNext() {
    if (selectedTime === null) return;
    window.alert(`Вы выбрали: ${formatDate(selectedDay)} • ${selectedTime}`);
  }

  return (
    <div className="page-shell">
      <Header />
      <main className="booking-main">
        <StepIndicator />
        <section className="booking-content">
          <header className="content-header">
            <span className="content-eyebrow">Шаг 4</span>
            <h1 className="content-title">Дата и время</h1>
            <p className="content-description">Выберите день, затем свободный слот.</p>
          </header>

          <div className="booking-panels">
            <Calendar
              month={currentMonth}
              year={currentYear}
              today={today}
              selectedDay={selectedDay}
              onDayClick={handleDayClick}
              onPrevMonth={() => handleMonthChange(-1)}
              onNextMonth={() => handleMonthChange(1)}
            />
            <TimeSlots
              date={selectedDay}
              slots={slots}
              selectedTime={selectedTime}
              onTimeClick={handleTimeClick}
            />
          </div>

          <BookingBottomBar date={selectedDay} selectedTime={selectedTime} onNext={handleNext} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
