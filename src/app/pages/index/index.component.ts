import { Component, AfterViewInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf]
})
export class IndexComponent implements AfterViewInit {

  activeFaq: number | null = null;
  showForm: boolean = false;
  showViewForm: boolean = false;

  // ── Лайтбокс ──────────────────────────────────────────────
  lightboxOpen = false;
  lightboxIndex = 0;

  openLightbox(i: number): void {
    this.lightboxIndex = i;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }

  lightboxNext(): void {
    this.lightboxIndex = (this.lightboxIndex + 1) % this.galleryImages.length;
  }

  lightboxPrev(): void {
    this.lightboxIndex = (this.lightboxIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape')    this.closeLightbox();
    if (e.key === 'ArrowRight') this.lightboxNext();
    if (e.key === 'ArrowLeft')  this.lightboxPrev();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    document.body.style.overflow = this.showForm ? 'hidden' : '';
  }

  closeFormOverlay(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('lp-modal-overlay')) {
      this.toggleForm();
    }
  }

  toggleViewForm() {
    this.showViewForm = !this.showViewForm;
    document.body.style.overflow = this.showViewForm ? 'hidden' : '';
  }

  closeViewFormOverlay(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('lp-modal-overlay')) {
      this.toggleViewForm();
    }
  }

  ngAfterViewInit(): void {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('anim-visible');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));
  }

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }

  // ЭКРАН 2: Направления
  directions = [
    {
      icon: 'fas fa-brain',
      title: 'После инсульта',
      text1: 'Восстановление движения, речи и навыков самообслуживания.',
      text2: 'Снижаем риск повторного инсульта и осложнений.',
      link: '/rehabilitation/insult'
    },
    {
      icon: 'fas fa-bone',
      title: 'Перелом шейки бедра',
      text1: 'Постепенная вертикализация и профилактика тромбоза.',
      text2: 'Помогаем вернуть подвижность безопасно.',
      link: '/rehabilitation/perelom-shejki-bedra'
    },
    {
      icon: 'fas fa-procedures',
      title: 'После эндопротезирования',
      text1: 'Контроль нагрузки и правильное восстановление после замены сустава.',
      text2: 'Снижаем риск осложнений и повторной госпитализации.',
      link: '/rehabilitation/endoprotezirovanie'
    },
    {
      icon: 'fas fa-brain',
      title: 'Деменция / Альцгеймер',
      text1: 'Безопасная среда и контроль состояния.',
      text2: 'Постоянное наблюдение и контроль приёма лекарств.',
      link: '/diagnos/demenciya'
    },
    {
      icon: 'fas fa-hand-holding-medical',
      title: 'Болезнь Паркинсона',
      text1: 'Контроль терапии и профилактика падений.',
      text2: 'Помощь при скованности и нарушении координации.',
      link: '/diagnos/parkinson'
    },
    {
      icon: 'fas fa-heart',
      title: 'Паллиативная помощь',
      text1: 'Обезболивание и облегчение состояния.',
      text2: 'Круглосуточный уход с уважением к пациенту.',
      link: '/diagnos/palliativ'
    },
  ];

  // ЭКРАН 3: Риски
  risks = [
    { icon: 'fas fa-exclamation-triangle', label: 'Повторный инсульт' },
    { icon: 'fas fa-bed', label: 'Пролежни' },
    { icon: 'fas fa-tint', label: 'Тромбоз и пневмония' },
    { icon: 'fas fa-walking', label: 'Отказ от движения' },
    { icon: 'fas fa-link', label: 'Контрактуры суставов' },
    { icon: 'fas fa-level-down-alt', label: 'Ухудшение состояния' },
  ];

  // ЭКРАН 4: Шаги
  steps = [
    'Осмотр врача при поступлении',
    'Оценка двигательных и когнитивных функций',
    'Индивидуальный план реабилитации',
    'Ежедневные занятия ЛФК',
    'Контроль давления и приёма лекарств',
    'Профилактика осложнений',
    'Отчёты родственникам о динамике',
  ];

  // ЭКРАН 7: Персонал — превью (ключевые сотрудники)
  staff = [
    {
      name: 'Жигарёв Антон Юрьевич',
      role: 'Директор стационара',
      photo: 'assets/img/team/Zhigaryov_Anton.webp'
    },
    {
      name: 'Попова Елена Владимировна',
      role: 'Главный врач, врач-терапевт, гастроэнтеролог',
      photo: 'assets/img/team/popova_ev.webp'
    },
    {
      name: 'Левко Наталья Ивановна',
      role: 'Врач-УЗИ',
      photo: 'assets/img/team/levko_ni.webp'
    },
    {
      name: 'Пилипейко Тамара',
      role: 'Cтаршая медсестра',
      photo: 'assets/img/team/pilipeyko.webp'
    },
  ];

  // ЭКРАН 8: Галерея
	galleryImages = [
    { src: 'assets/img/dropme/К8.webp',    alt: 'Медицинский уход' },
    { src: 'assets/img/dropme/gal2.webp',  alt: 'Условия проживания' },
	{ src: 'assets/img/dropme/gal6.webp',  alt: 'стационар' },
    { src: 'assets/img/dropme/gal3.webp',  alt: 'Коридор стационара' },
	{ src: 'assets/img/dropme/gal12.webp', alt: 'Помощь' },
    { src: 'assets/img/dropme/gal4.webp',  alt: 'Реабилитация' },
    { src: 'assets/img/dropme/К17.webp',   alt: 'Занятия ЛФК' },
    { src: 'assets/img/dropme/gal7.webp',  alt: 'Медицинский уход' },
    { src: 'assets/img/dropme/gal5.webp',  alt: 'Территория' },
    { src: 'assets/img/dropme/reab3.webp', alt: 'Условия' },
    { src: 'assets/img/dropme/gal8.webp',  alt: 'Пациенты' },
    { src: 'assets/img/dropme/gal9.webp',  alt: 'Палата' },
    { src: 'assets/img/dropme/К7.webp',    alt: 'Уход' },
    { src: 'assets/img/dropme/gal10.webp', alt: 'Восстановление' },
	{ src: 'assets/img/dropme/gal51.webp',    alt: 'Лечение' },
    { src: 'assets/img/dropme/К9.webp',    alt: 'Лечение' },
    { src: 'assets/img/dropme/reab5.webp', alt: 'Реабилитация' },
	{ src: 'assets/img/dropme/gal15.webp', alt: 'Отдых' },
    { src: 'assets/img/dropme/gal13.webp', alt: 'Досуг' },
    { src: 'assets/img/dropme/gal14.webp', alt: 'Отдых' },
	{ src: 'assets/img/dropme/К10.webp', alt: 'Палата' },
  ];

  // ЭКРАН 9: Отзывы
  reviews = [
    {
      name: 'Родственники пациента',
      diagnosis: 'После инсульта',
      text: 'Мама поступила после ишемического инсульта, не двигалась правая рука и почти не говорила. Дома мы не справлялись, давление постоянно «скакало». В стационаре начали ЛФК уже на первой неделе. Через 6 недель мама начала самостоятельно сидеть и частично обслуживать себя. Спасибо врачам за внимательность и регулярную обратную связь.'
    },
    {
      name: 'Семья пациентки',
      diagnosis: 'После операции на бедре',
      text: 'После операции бабушка не вставала и боялась двигаться. Мы переживали за тромбоз и пролежни. В центре начали постепенную вертикализацию, ежедневные занятия и контроль состояния. Через месяц она начала передвигаться с поддержкой. Главное — осложнений удалось избежать.'
    },
    {
      name: 'Дочь пациента',
      diagnosis: 'После эндопротезирования',
      text: 'Папу выписали из больницы, но дома он почти не двигался из-за боли и страха. В стационаре разработали план восстановления и постепенно увеличивали нагрузку. Через 5 недель он начал ходить с ходунками. Спасибо за профессиональный подход.'
    },
    
  ];

  // ЭКРАН 10: Кому не подойдём
  notForUs = [
    'нужен просто пансионат для престарелых без медконтроля',
    'пациент полностью самостоятельный',
    'вы ищете самый дешёвый вариант',
  ];

  // ЭКРАН 11: FAQ (16 вопросов)
  faqs = [
    {
      question: 'Когда можно начать реабилитацию?',
      answer: 'Чем раньше — тем лучше. Мы принимаем пациентов сразу после выписки из больницы при наличии свободных мест. Заселение возможно в день обращения.'
    },
    {
      question: 'Берёте ли вы лежачих пациентов?',
      answer: 'Да. Мы обеспечиваем полный уход, профилактику пролежней, контроль давления и состояния 24/7.'
    },
    {
      question: 'Можно ли привезти пациента прямо из больницы?',
      answer: 'Да. Мы организуем перевозку лежачих пациентов из больницы или дома и сопровождаем процесс заселения.'
    },
    {
      question: 'Сколько длится реабилитация?',
      answer: 'Срок зависит от состояния пациента. Минимальный рекомендуемый период — от 14 дней. В среднем восстановление занимает от 1 до 3 месяцев.'
    },
    {
      question: 'Гарантируете ли вы результат?',
      answer: 'В медицине невозможно гарантировать конкретный результат. Но мы обеспечиваем профессиональный контроль, соблюдение протоколов и регулярную динамику восстановления.<br><br>Результат зависит от:<br>• диагноза<br>• срока после заболевания<br>• общего состояния пациента'
    },
    {
      question: 'Что входит в стоимость?',
      answer: 'В базовую стоимость входит:<br>• проживание<br>• питание<br>• помощь в гигиене<br>• контроль приёма лекарств<br>• профилактика осложнений<br>• круглосуточное наблюдение<br><br>Дополнительные реабилитационные занятия оплачиваются согласно выбранной программе. Стоимость фиксируется в договоре. Без скрытых платежей.'
    },
    {
      question: 'Можно ли навещать пациента?',
      answer: 'Да, посещение возможно по согласованию. Мы поддерживаем связь с родственниками и регулярно информируем о состоянии пациента.'
    },
    {
      question: 'Можно ли приехать и посмотреть условия заранее?',
      answer: 'Да. Вы можете записаться на просмотр центра и лично оценить условия проживания и познакомиться с персоналом.'
    },
    {
      question: 'Сколько человек находится в одной палате?',
      answer: 'Большинство палат 4-х местные, но есть 6-ти местные. Мы не размещаем большое количество пациентов в одной палате.'
    },
    {
      question: 'Работаете ли вы официально?',
      answer: 'Да. С пациентом заключается официальный договор. У стационара есть лицензия на медицинскую деятельность.'
    },
    {
      question: 'Подойдёт ли ваш стационар, если пациент с деменцией или болезнью Паркинсона?',
      answer: 'Да. Мы принимаем пациентов с деменцией, болезнью Альцгеймера и Паркинсона. Обеспечиваем безопасную среду и контроль терапии.'
    },
    {
      question: 'Принимаете ли вы паллиативных пациентов?',
      answer: 'Да. Мы оказываем паллиативную помощь и обеспечиваем круглосуточный уход и контроль состояния.'
    },
    {
      question: 'Что нужно для заселения?',
      answer: '• Паспорт заказчика<br>• Паспорт проживающего<br>• Копия полиса обязательного медицинского страхования<br>• Выписка из амбулаторной карты или из стационара<br>• Рецепт лекарственных препаратов, назначенных врачом (если есть)<br>• Сменное нижнее бельё<br>• Средства личной гигиены (мочалка, зубная щётка)<br>• Домашняя одежда<br><br>Наш администратор подскажет полный перечень.'
    },
    {
      question: 'Что если состояние ухудшится?',
      answer: 'Пациенты находятся под круглосуточным медицинским наблюдением. При необходимости мы оперативно реагируем и вызываем скорую помощь.'
    },
    {
      question: 'Можно ли оформить размещение срочно?',
      answer: 'Да, при наличии свободных мест заселение возможно в день обращения.'
    },
    {
      question: 'Почему стоит выбрать вас?',
      answer: 'Мы находимся в тихой зелёной зоне вдали от шума трасс, на берегу реки. До стационара удобно добраться из Ногинска, Орехово-Зуево, Ликино-Дулево, Электростали, Павловского Посада, Покрова, Петушков. Мы помогаем организовать перевозку пациента. Накоплен большой опыт в реабилитации и уходе за пожилыми, подобран высокопрофессиональный медицинский персонал.'
    },
  ];
}