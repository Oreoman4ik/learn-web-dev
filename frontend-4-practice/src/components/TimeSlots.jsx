import { DAYS_OF_WEEK, MONTHS_GENITIVE } from '../utils/date.js';

export default function TimeSlots({ date, slots, loading, error, selectedTime, onTimeClick }) {
  return (
    <aside className="time-card" aria-labelledby="time-title">
      <header className="time-header">
        <h2 className="time-title" id="time-title">Свободное время</h2>
        <p className="time-date">
          {date.getDate()} {MONTHS_GENITIVE[date.getMonth()]} · {DAYS_OF_WEEK[date.getDay()].toLowerCase()}
        </p>
      </header>

      {loading ? (
        <p className="request-state" role="status">Загрузка слотов…</p>
      ) : error ? (
        <p className="request-state request-error" role="alert">
          Не удалось загрузить слоты: {error}
        </p>
      ) : slots.length === 0 ? (
        <p className="request-state" role="status">В этот день нет доступного времени.</p>
      ) : (
        <div className="time-grid">
          {slots.map((slot) => (
            <button
              className={[
                'time-slot',
                !slot.available && 'unavailable',
                slot.time === selectedTime && 'selected',
              ].filter(Boolean).join(' ')}
              type="button"
              key={slot.time}
              aria-pressed={slot.time === selectedTime}
              disabled={!slot.available}
              onClick={() => onTimeClick(slot.time)}
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}

      <div className="slot-legend">
        <span className="legend-item">
          <span className="legend-dot free" />
          Свободно
        </span>
        <span className="legend-item">
          <span className="legend-dot busy" />
          Занято
        </span>
      </div>

      <p className="time-note">Время бронируется на 10 минут после перехода к контактам.</p>
    </aside>
  );
}
