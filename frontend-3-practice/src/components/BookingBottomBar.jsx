import { formatDate } from '../utils/date.js';

export default function BookingBottomBar({ date, selectedTime, onNext }) {
  return (
    <div className="booking-actions">
      <button className="button button-secondary" type="button">Назад</button>
      <div className="selection-summary">
        <span className="selection-label">Выбрано</span>
        <strong className="selection-value" aria-live="polite">
          {formatDate(date)} • {selectedTime || 'Выберите время'}
        </strong>
      </div>
      <button
        className="button button-primary"
        type="button"
        disabled={selectedTime === null}
        onClick={onNext}
      >
        Далее
      </button>
    </div>
  );
}
