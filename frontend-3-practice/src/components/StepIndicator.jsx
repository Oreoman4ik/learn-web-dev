export default function StepIndicator() {
  return (
    <section className="progress-section" aria-label="Прогресс записи">
      <div className="progress-topline">
        <h2 className="progress-title">Дата и время</h2>
        <span className="progress-counter">Шаг 4 из 6</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span className="progress-value" />
      </div>
    </section>
  );
}
