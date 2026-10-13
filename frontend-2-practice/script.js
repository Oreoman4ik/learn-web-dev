(() => {
  'use strict';

  // 1. Данные. Месяцы в Date имеют индексы от 0 до 11.
  const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const SLOT_TIMES = ['10:00', '11:30', '12:15', '13:00', '14:30', '16:00', '17:30', '18:30', '19:00'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 2. Состояние. Выбранная дата не зависит от просматриваемого месяца.
  const state = {
    currentMonth: today.getMonth(),
    currentYear: today.getFullYear(),
    selectedDay: new Date(today),
    selectedTime: null,
    slots: [],
  };
  let elements;

  // 3. Чистые функции.
  function compareDates(date1, date2) {
    const first = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
    const second = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).getTime();
    return Math.sign(first - second);
  }

  function isDateSelectable(day, month, year, referenceDate) {
    return compareDates(new Date(year, month, day), referenceDate) >= 0;
  }

  function buildCalendarGrid(year, month) {
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
    const weeks = [];
    for (let index = 0; index < totalCells; index += 1) {
      const date = new Date(year, month, index - offset + 1);
      if (index % 7 === 0) weeks.push([]);
      weeks[weeks.length - 1].push({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        otherMonth: date.getMonth() !== month,
      });
    }
    return weeks;
  }

  function getSlots(date) {
    // Демонстрационное расписание: занятые слоты меняются в зависимости от даты.
    const seed = date.getDate() + date.getMonth() + date.getFullYear();
    return SLOT_TIMES.map((time, index) => ({ time, available: (seed + index) % 4 !== 0 }));
  }

  function formatDate(date) {
    return `${DAYS_OF_WEEK[date.getDay()]}, ${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
  }

  // 4. Отрисовка и обработчики.
  function renderCalendar() {
    elements.calendarTitle.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
    elements.calendarGrid.setAttribute('aria-label', `Календарь: ${elements.calendarTitle.textContent}`);
    elements.calendarGrid.innerHTML = buildCalendarGrid(state.currentYear, state.currentMonth)
      .flat().map((cell, index) => {
        const date = new Date(cell.year, cell.month, cell.day);
        const selectable = isDateSelectable(cell.day, cell.month, cell.year, today);
        const selected = compareDates(date, state.selectedDay) === 0;
        const classes = ['calendar-day'];
        if (cell.otherMonth) classes.push('other-month');
        if (index % 7 >= 5) classes.push('weekend');
        if (selected) classes.push('selected');
        if (!selectable) classes.push('disabled');
        // Существующие стили не содержат disabled для дней: приглушаем их в JS.
        const disabledStyle = selectable ? '' : ' style="opacity: 0.35; pointer-events: none; cursor: not-allowed;"';
        return `<button class="${classes.join(' ')}" type="button" data-day="${cell.day}" data-month="${cell.month}" data-year="${cell.year}" aria-label="${formatDate(date)}" aria-pressed="${selected}"${compareDates(date, today) === 0 ? ' aria-current="date"' : ''}${selectable ? '' : ' disabled'}${disabledStyle}>${cell.day}</button>`;
      }).join('');
    elements.calendarGrid.querySelectorAll('button:not(:disabled)').forEach((button) => {
      button.addEventListener('click', onDayClick);
    });
  }

  function renderTimeSlots() {
    const date = state.selectedDay;
    elements.timeDate.textContent = `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} · ${DAYS_OF_WEEK[date.getDay()].toLowerCase()}`;
    elements.timeGrid.innerHTML = state.slots.map((slot) => {
      const selected = slot.time === state.selectedTime;
      return `<button class="time-slot${slot.available ? '' : ' unavailable'}${selected ? ' selected' : ''}" type="button" data-time="${slot.time}" aria-pressed="${selected}"${slot.available ? '' : ' disabled'}>${slot.time}</button>`;
    }).join('');
    elements.timeGrid.querySelectorAll('button:not(:disabled)').forEach((button) => {
      button.addEventListener('click', onTimeSlotClick);
    });
  }

  function updateBottomBar() {
    elements.summary.textContent = `${formatDate(state.selectedDay)} • ${state.selectedTime || 'Выберите время'}`;
    elements.nextButton.disabled = state.selectedTime === null;
    elements.nextButton.style.opacity = state.selectedTime === null ? '0.5' : '';
    elements.nextButton.style.cursor = state.selectedTime === null ? 'not-allowed' : '';
  }

  function onDayClick(event) {
    const { day, month, year } = event.currentTarget.dataset;
    if (!isDateSelectable(Number(day), Number(month), Number(year), today)) return;
    state.selectedDay = new Date(Number(year), Number(month), Number(day));
    state.currentMonth = Number(month);
    state.currentYear = Number(year);
    state.selectedTime = null;
    state.slots = getSlots(state.selectedDay);
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
  }

  function onTimeSlotClick(event) {
    const time = event.currentTarget.dataset.time;
    if (!state.slots.some((slot) => slot.time === time && slot.available)) return;
    state.selectedTime = time;
    renderTimeSlots();
    updateBottomBar();
  }

  function setupMonthNavigation() {
    elements.arrows.forEach((button, index) => {
      button.addEventListener('click', () => {
        const month = new Date(state.currentYear, state.currentMonth + (index === 0 ? -1 : 1), 1);
        state.currentMonth = month.getMonth();
        state.currentYear = month.getFullYear();
        renderCalendar();
      });
    });
  }

  // 5. Инициализация.
  function init() {
    elements = {
      calendarTitle: document.querySelector('.calendar-title'),
      calendarGrid: document.querySelector('.calendar-grid'),
      arrows: document.querySelectorAll('.calendar-arrow'),
      timeDate: document.querySelector('.time-date'),
      timeGrid: document.querySelector('.time-grid'),
      summary: document.querySelector('.selection-value'),
      nextButton: document.querySelector('.button-primary'),
    };
    state.slots = getSlots(state.selectedDay);
    elements.summary.setAttribute('aria-live', 'polite');
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
    setupMonthNavigation();
    elements.nextButton.addEventListener('click', () => {
      if (state.selectedTime === null) return;
      window.alert(`Вы выбрали: ${formatDate(state.selectedDay)} • ${state.selectedTime}`);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
