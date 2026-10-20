export default function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#" aria-label="Студия красоты Мята">
        <span className="brand-mark">М</span>
        <span className="brand-copy">
          <span className="brand-name">Мята</span>
          <span className="brand-subtitle">студия красоты</span>
        </span>
      </a>

      <nav className="site-nav" aria-label="Основная навигация">
        <a className="site-nav-link" href="#">Услуги</a>
        <a className="site-nav-link" href="#">Мастера</a>
        <a className="site-nav-link" href="#">Отзывы</a>
        <span className="site-address">ул. Лесная, 12</span>
      </nav>

      <button className="header-action" type="button">Записаться</button>
    </header>
  );
}
