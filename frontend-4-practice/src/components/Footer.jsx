export default function Footer() {
  return (
    <footer className="site-footer">
      <section className="footer-brand-block">
        <span className="footer-brand">Мята</span>
        <p className="footer-description">
          Спокойная студия красоты в центре города. Ежедневно 09:00–21:00.
        </p>
      </section>
      <section className="footer-contact-block">
        <span className="footer-heading">Контакты</span>
        <p className="footer-contact">+7 999 555-24-24<br />ул. Лесная, 12</p>
      </section>
      <section className="footer-booking-block">
        <span className="footer-heading">Запись</span>
        <p className="footer-contact">Выберите мастера, услугу и удобное время онлайн.</p>
      </section>
    </footer>
  );
}
