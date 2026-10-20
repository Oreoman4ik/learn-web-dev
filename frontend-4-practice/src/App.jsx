import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import StepIndicator from './components/StepIndicator.jsx';
import Calendar from './components/Calendar.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import { compareDates, formatDate, isDateSelectable } from './utils/date.js';
import { fetchToday, fetchSlots } from './api.js';
import './styles/booking.css';

export default function App() {
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  // Выбранная дата не зависит от месяца, который сейчас просматривают.
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [errorSlots, setErrorSlots] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadToday() {
      try {
        const data = await fetchToday();
        if (!active) return;

        const date = new Date(data.year, data.month, data.day);
        setToday(date);
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDay(date);
      } catch (error) {
        if (active) setErrorToday(error.message || 'Проверьте подключение к серверу.');
      } finally {
        if (active) setLoadingToday(false);
      }
    }

    loadToday();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (selectedDay === null) return;

    // Cleanup отключает обработку старого запроса, включая catch и finally.
    // Ответ для прошлого дня не сможет заменить слоты или снять загрузку нового.
    let active = true;
    const date = {
      day: selectedDay.getDate(),
      month: selectedDay.getMonth(),
      year: selectedDay.getFullYear(),
    };

    async function loadSlots() {
      try {
        const response = await fetchSlots(date);
        if (!active) return;

        if (
          response.date.day !== date.day ||
          response.date.month !== date.month ||
          response.date.year !== date.year
        ) {
          throw new Error('Сервер вернул слоты для другой даты.');
        }

        setSlots(response.slots);
      } catch (error) {
        if (active) setErrorSlots(error.message || 'Проверьте подключение к серверу.');
      } finally {
        if (active) setLoadingSlots(false);
      }
    }

    loadSlots();
    return () => { active = false; };
  }, [selectedDay]);

  function handleDayClick(date) {
    if (!isDateSelectable(date.getDate(), date.getMonth(), date.getFullYear(), today)) return;

    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
    // Повторный клик по выбранному дню не создаёт ещё один запрос.
    if (compareDates(date, selectedDay) === 0) return;

    setSelectedTime(null);
    setSlots([]);
    setErrorSlots(null);
    setLoadingSlots(true);
    setSelectedDay(date);
  }

  function handleTimeClick(time) {
    if (loadingSlots || errorSlots) return;
    if (!slots.some((slot) => slot.time === time && slot.available)) return;
    setSelectedTime(time);
  }

  function handleMonthChange(direction) {
    const month = new Date(currentYear, currentMonth + direction, 1);
    setCurrentMonth(month.getMonth());
    setCurrentYear(month.getFullYear());
  }

  function handleNext() {
    if (loadingSlots || errorSlots || selectedTime === null) return;
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

          {loadingToday ? (
            <p className="request-state" role="status">Загрузка…</p>
          ) : errorToday ? (
            <p className="request-state request-error" role="alert">
              Не удалось загрузить календарь: {errorToday}
            </p>
          ) : (
            <>
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
                  loading={loadingSlots}
                  error={errorSlots}
                  selectedTime={selectedTime}
                  onTimeClick={handleTimeClick}
                />
              </div>

              <BookingBottomBar date={selectedDay} selectedTime={selectedTime} onNext={handleNext} />
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
