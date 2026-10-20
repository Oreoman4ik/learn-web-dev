const SLOT_TIMES = ['10:00', '11:30', '12:15', '13:00', '14:30', '16:00', '17:30', '18:30', '19:00'];

export function getSlots(date) {
  // То же демонстрационное расписание, что и в нативной версии.
  const seed = date.getDate() + date.getMonth() + date.getFullYear();
  return SLOT_TIMES.map((time, index) => ({ time, available: (seed + index) % 4 !== 0 }));
}
