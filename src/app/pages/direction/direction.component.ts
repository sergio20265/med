import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SeoService } from '../../seo-service.service';
import { ApiService } from '../../api.service';

export interface DirectionData {
  h1: string;
  subtitle: string;      // крупный подзаголовок (первая строка по ТЗ)
  description: string;   // мелкий описательный текст (вторая строка по ТЗ)
  price: string;
  hasTransport: boolean;
  whenToContact: string[];
  whyDangerousTitle: string;
  whyDangerous: string[];
  whyDangerousNote?: string;
  howItWorksTitle: string;
  howItWorks: string[];
  howItWorksNote?: string;
  whatsIncluded: string[];
  in30daysTitle: string;
  in30days: string[];
  ifDelay: string[];
  trialDayText: string;
  notForUs: string[];
  finalText: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoUrl: string;
  heroImage: string;
  breadcrumbTitle: string;
  // Изображения для блоков контента
  imgWhen: string;     // «Когда к нам обращаются»
  imgDanger: string;   // «Почему опасно»
  imgHow: string;      // «Как проходит»
}

const DIRECTIONS: Record<string, DirectionData> = {

  'insult': {
    h1: 'Реабилитация после инсульта в стационаре 24/7',
    subtitle: 'Возвращаем движение, речь и навыки самообслуживания',
    description: 'под круглосуточным медицинским контролем. Принимаем пациентов сразу после выписки.',
    price: 'От 3 800 ₽/сутки',
    hasTransport: true,
    whenToContact: [
      'Паралич руки или ноги',
      'Нарушение речи',
      'Потеря равновесия',
      'Скачки давления',
      'Страх повторного инсульта',
    ],
    whyDangerousTitle: 'Почему опасно восстанавливаться дома',
    whyDangerous: [
      'Повторный инсульт',
      'Контрактуры суставов',
      'Тромбоз',
      'Пролежни',
      'Резкое ухудшение состояния',
    ],
    whyDangerousNote: 'Без медицинского контроля часто возникают серьёзные осложнения.',
    howItWorksTitle: 'Как проходит восстановление',
    howItWorks: [
      'Осмотр врача при поступлении',
      'Оценка двигательных и речевых функций',
      'Индивидуальный план реабилитации',
      'Ежедневная ЛФК',
      'Контроль давления и лекарств',
      'Отчёты родственникам',
    ],
    howItWorksNote: 'Мы не просто ухаживаем — мы контролируем процесс восстановления.',
    whatsIncluded: [
      'Проживание',
      'Питание',
      'Медицинское наблюдение 24/7',
      'Профилактика осложнений',
      'Индивидуальная программа ЛФК',
    ],
    in30daysTitle: 'Что может измениться через 30 дней',
    in30days: [
      'Начинает сидеть без поддержки',
      'Улучшается речь',
      'Частично возвращает навыки самообслуживания',
      'Снижается риск повторного инсульта',
    ],
    ifDelay: [
      'Потери подвижности',
      'Повторного инсульта',
      'Стойких контрактур',
    ],
    trialDayText: 'Пробный день — 50% стоимости. Если остаётесь — засчитывается в оплату.',
    notForUs: [
      'Если нужен просто пансионат без медконтроля',
      'Если пациент полностью самостоятельный',
      'Если вы ищете самый дешёвый вариант',
    ],
    finalText: 'Чем раньше начата реабилитация, тем выше шанс вернуть самостоятельность.',
    seoTitle: 'Реабилитация после инсульта в стационаре',
    seoDescription: 'Восстановление движения и речи под контролем 24/7. Принимаем сразу после выписки. Есть свободные места.',
    seoKeywords: 'реабилитация после инсульта, восстановление после инсульта, стационар после инсульта, лечение инсульта, реабилитационный центр',
    seoUrl: 'https://nmrehab.ru/rehabilitation/insult',
    heroImage: 'assets/img/dropme/hd_0.png',
    breadcrumbTitle: 'После инсульта',
    imgWhen:   'assets/img/dropme/pgs.webp',
    imgDanger: 'assets/img/dropme/gal81.webp',
    imgHow:    'assets/img/dropme/k131.webp',
  },

  'perelom-shejki-bedra': {
    h1: 'Реабилитация после перелома шейки бедра',
    subtitle: 'Постепенная вертикализация и профилактика осложнений',
    description: 'под контролем опытного медперсонала 24/7',
    price: 'От 3 800 ₽/сутки',
    hasTransport: true,
    whenToContact: [
      'Пациент не встаёт после травмы или операции',
      'Сильная слабость и боязнь движения',
      'Риск тромбоза и пролежней',
      'Родственники не могут обеспечить уход',
    ],
    whyDangerousTitle: 'Почему нужен стационар и медицинское наблюдение',
    whyDangerous: [
      'Тромбоз',
      'Пневмония',
      'Пролежни',
      'Потеря подвижности',
    ],
    whyDangerousNote: 'После операции по замене тазобедренного сустава необходимо начинать реабилитацию сразу в профильном стационаре.',
    howItWorksTitle: 'Как проходит восстановление',
    howItWorks: [
      'Контроль боли с первых дней',
      'Постепенная нагрузка под контролем врача',
      'Ежедневная ЛФК',
      'Профилактика осложнений',
      'Поддержка и контроль 24/7',
    ],
    whatsIncluded: [
      'Проживание',
      'Питание',
      'Медицинское наблюдение 24/7',
      'Профилактика тромбоза и пролежней',
      'Индивидуальная программа ЛФК',
    ],
    in30daysTitle: 'Что меняется через 30 дней',
    in30days: [
      'Пациент начинает вставать',
      'Улучшается подвижность',
      'Снижается риск тромбоза',
    ],
    ifDelay: [
      'Полная потеря подвижности',
      'Тромбообразование',
      'Застойные осложнения',
    ],
    trialDayText: 'Пробный день — 50% стоимости. Если остаётесь — засчитывается в оплату.',
    notForUs: [
      'Если вы хотите начать реабилитацию дома',
      'Если вы ищете самый дешёвый вариант',
    ],
    finalText: 'Чем раньше начата реабилитация, тем выше шанс вернуть подвижность тазобедренного сустава и избежать осложнений.',
    seoTitle: 'Реабилитация после перелома шейки бедра',
    seoDescription: 'Вертикализация и профилактика тромбоза. Медицинский контроль 24/7. Перевозка пациента.',
    seoKeywords: 'реабилитация после перелома шейки бедра, перелом бедра, вертикализация, восстановление, стационар',
    seoUrl: 'https://nmrehab.ru/rehabilitation/perelom-shejki-bedra',
    heroImage: 'assets/img/dropme/hd_1.png',
    breadcrumbTitle: 'Перелом шейки бедра',
    imgWhen:   'assets/img/dropme/reab3.webp',
    imgDanger: 'assets/img/dropme/sb2.webp',
    imgHow:    'assets/img/dropme/sb3.webp',
  },

  'endoprotezirovanie': {
    h1: 'Восстановление после замены тазобедренного или коленного сустава',
    subtitle: 'Контроль нагрузки, безопасная реабилитация и профилактика осложнений',
    description: 'под контролем опытного медперсонала 24/7',
    price: 'От 3 800 ₽/сутки',
    hasTransport: true,
    whenToContact: [
      'Пациент выписан после замены тазобедренного или коленного сустава',
      'Есть страх давать нагрузку на ногу',
      'Отёк, боль, скованность движений',
      'Сложно самостоятельно вставать и ходить',
      'Родственники боятся осложнений',
    ],
    whyDangerousTitle: 'Почему восстановление дома может быть опасным',
    whyDangerous: [
      'Смещение импланта',
      'Неправильная нагрузка на сустав',
      'Отёк и воспаление',
      'Тромбообразование',
      'Ограничение подвижности',
    ],
    whyDangerousNote: 'Без контроля специалиста пациент либо боится двигаться, либо перегружает сустав слишком рано. Обе ситуации замедляют восстановление.',
    howItWorksTitle: 'Как проходит реабилитация в стационаре',
    howItWorks: [
      'Осмотр врача при поступлении',
      'Оценка состояния сустава и объёма движения',
      'Индивидуальный план нагрузки',
      'Постепенное увеличение активности',
      'Ежедневные занятия ЛФК',
      'Контроль боли и отёков',
      'Профилактика осложнений',
    ],
    howItWorksNote: 'Мы контролируем не только упражнения, но и правильную механику движения.',
    whatsIncluded: [
      'Медицинское наблюдение 24/7',
      'Контроль нагрузки на сустав',
      'ЛФК под контролем специалиста',
      'Помощь при передвижении',
      'Контроль приёма препаратов',
      'Профилактика тромбоза',
    ],
    in30daysTitle: 'Что может измениться через 30 дней',
    in30days: [
      'Уверенно встаёт с кровати',
      'Передвигается с ходунками или тростью',
      'Уменьшается боль',
      'Увеличивается объём движения',
      'Снижается риск повторной госпитализации',
    ],
    ifDelay: [
      'Скованность и ограничение подвижности',
      'Нарушение походки',
      'Хроническая боль',
      'Повторная госпитализация',
    ],
    trialDayText: 'Вы можете оформить пробный день и оценить условия, программу и подход специалистов. Если вы остаётесь — стоимость засчитывается.',
    notForUs: [
      'Если вы хотите начать реабилитацию дома',
      'Если вы ищете самый дешёвый вариант',
    ],
    finalText: 'Мы специализируемся на медицинском контроле восстановления. Чем раньше начата реабилитация, тем выше шанс вернуть подвижность суставов и избежать осложнений.',
    seoTitle: 'Восстановление после эндопротезирования',
    seoDescription: 'Реабилитация после замены сустава. Контроль нагрузки и ЛФК. Стационар 24/7.',
    seoKeywords: 'реабилитация после эндопротезирования, замена сустава, тазобедренный сустав, коленный сустав, восстановление, стационар',
    seoUrl: 'https://nmrehab.ru/rehabilitation/endoprotezirovanie',
    heroImage: 'assets/img/dropme/hd_2.png',
    breadcrumbTitle: 'После эндопротезирования',
    imgWhen:   'assets/img/dropme/pe1.webp',
    imgDanger: 'assets/img/dropme/pe2.webp',
    imgHow:    'assets/img/dropme/sb3.webp',
  },

  'demenciya': {
    h1: 'Уход при деменции и болезни Альцгеймера 24/7',
    subtitle: 'Безопасная среда, контроль поведения и приёма лекарств',
    description: 'под круглосуточным медицинским наблюдением. Пациенты не остаются одни. Контроль состояния 24/7',
    price: 'От 1 800 ₽/сутки',
    hasTransport: false,
    whenToContact: [
      'Пациент теряется и уходит из дома',
      'Забывает принимать лекарства',
      'Проявляется агрессия или тревожность',
      'Нарушен сон',
      'Родственники физически не справляются',
    ],
    whyDangerousTitle: 'Почему уход дома становится опасным',
    whyDangerous: [
      'Падения и травмы',
      'Уход из дома',
      'Отказ от еды',
      'Пропуск лекарств',
      'Резкое ухудшение состояния',
    ],
    whyDangerousNote: 'Даже внимательные родственники не могут обеспечить контроль 24 часа в сутки.',
    howItWorksTitle: 'Как организован уход в стационаре',
    howItWorks: [
      'Осмотр врача при поступлении',
      'Оценка когнитивных функций',
      'Контроль приёма препаратов',
      'Круглосуточное наблюдение',
      'Помощь в гигиене',
      'Поддерживающее общение',
    ],
    howItWorksNote: 'Пациент находится в безопасной среде без риска ухода или травм.',
    whatsIncluded: [
      'Проживание',
      'Питание',
      'Помощь в гигиене',
      'Контроль лекарств',
      'Наблюдение 24/7',
      'Безопасная среда',
    ],
    in30daysTitle: 'Что даёт размещение в стационаре',
    in30days: [
      'Стабилизация состояния',
      'Регулярный приём лекарств',
      'Снижение тревожности',
      'Предсказуемый режим дня',
      'Спокойствие семьи',
    ],
    ifDelay: [
      'Травмы при падениях',
      'Усиление агрессии',
      'Уход из дома',
      'Быстрое прогрессирование состояния',
    ],
    trialDayText: 'Вы можете оформить пробный день, оценить условия и познакомиться с персоналом. Если остаётесь — стоимость засчитывается.',
    notForUs: [
      'Если пациент полностью самостоятельный',
      'Если нужен только пансионат без медконтроля',
      'Если вы ищете самый дешёвый вариант',
    ],
    finalText: 'Мы специализируемся на медицинском наблюдении. Когда пациент с деменцией находится под контролем, семья может быть спокойна.',
    seoTitle: 'Уход при деменции и болезни Альцгеймера',
    seoDescription: 'Круглосуточный контроль и безопасная среда. Медицинский уход для пожилых.',
    seoKeywords: 'уход при деменции, болезнь Альцгеймера, деменция стационар, круглосуточный уход, контроль поведения',
    seoUrl: 'https://nmrehab.ru/diagnos/demenciya',
    heroImage: 'assets/img/dropme/hd_10.png',
    breadcrumbTitle: 'Деменция / Альцгеймер',
    imgWhen:   'assets/img/dropme/uh1.webp',
    imgDanger: 'assets/img/dropme/uh2.webp',
    imgHow:    'assets/img/dropme/uh3.webp',
  },

  'parkinson': {
    h1: 'Уход и контроль при болезни Паркинсона 24/7',
    subtitle: 'Контроль терапии, профилактика падений и поддержание подвижности',
    description: 'под медицинским наблюдением. Пациент не остаётся без контроля ни днём, ни ночью.',
    price: 'От 1 800 ₽/сутки',
    hasTransport: true,
    whenToContact: [
      'Частые падения',
      'Скованность движений',
      'Усиление тремора',
      'Трудности с приёмом лекарств по расписанию',
      'Нарушение сна',
      'Родственники не справляются',
    ],
    whyDangerousTitle: 'Почему восстановление дома может быть опасным',
    whyDangerous: [
      'Падения и травмы',
      'Нарушение приёма препаратов',
      'Усиление скованности',
      'Быстрое ухудшение подвижности',
    ],
    whyDangerousNote: 'Даже кратковременное нарушение режима лекарств может ухудшить состояние пациента.',
    howItWorksTitle: 'Как организован уход',
    howItWorks: [
      'Осмотр врача при поступлении',
      'Оценка двигательных функций',
      'Контроль приёма препаратов по расписанию',
      'Помощь при передвижении',
      'Упражнения для поддержания подвижности',
      'Профилактика падений',
      'Контроль сна и питания',
    ],
    howItWorksNote: 'Главная задача — сохранить стабильность состояния и предотвратить травмы.',
    whatsIncluded: [
      'Проживание',
      'Питание',
      'Контроль терапии',
      'Помощь при ходьбе',
      'Наблюдение 24/7',
      'Профилактика травм',
    ],
    in30daysTitle: 'Что даёт размещение в стационаре',
    in30days: [
      'Стабилизация состояния',
      'Снижение риска падений',
      'Регулярный приём препаратов',
      'Улучшение уверенности при ходьбе',
      'Спокойствие родственников',
    ],
    ifDelay: [
      'Усиление скованности',
      'Частые падения и переломы',
      'Потеря самостоятельности',
    ],
    trialDayText: 'Вы можете оформить пробный день и оценить подход специалистов. Если остаётесь — стоимость засчитывается.',
    notForUs: [
      'Если требуется только проживание без медконтроля',
      'Если вы ищете самый дешёвый вариант',
    ],
    finalText: 'Мы специализируемся на медицинском контроле состояния пациента. При болезни Паркинсона важно не оставлять пациента без контроля.',
    seoTitle: 'Уход при болезни Паркинсона 24/7',
    seoDescription: 'Контроль терапии и профилактика падений. Стационар для пожилых пациентов.',
    seoKeywords: 'болезнь Паркинсона, уход при Паркинсоне, контроль терапии, профилактика падений, стационар Паркинсон',
    seoUrl: 'https://nmrehab.ru/diagnos/parkinson',
    heroImage: 'assets/img/dropme/hd_20.png',
    breadcrumbTitle: 'Болезнь Паркинсона',
    imgWhen:   'assets/img/dropme/pa.webp',
    imgDanger: 'assets/img/dropme/sb3.webp',
    imgHow:    'assets/img/dropme/pa3.webp',
  },

  'palliativ': {
    h1: 'Паллиативная помощь и медицинский уход 24/7',
    subtitle: 'Контроль боли, круглосуточное наблюдение и достойные условия',
    description: 'для пациентов с тяжёлыми заболеваниями. Пациент не остаётся без внимания ни днём, ни ночью.',
    price: 'От 1 800 ₽/сутки',
    hasTransport: true,
    whenToContact: [
      'Тяжёлое хроническое заболевание',
      'Выраженный болевой синдром',
      'Необходим круглосуточный уход',
      'Пациент не может обслуживать себя',
      'Родственники не справляются',
    ],
    whyDangerousTitle: 'Почему дома часто недостаточно ухода',
    whyDangerous: [
      'Усиление боли без профессионального контроля',
      'Нарушение режима лекарств',
      'Пролежни',
      'Обезвоживание',
      'Резкое ухудшение состояния',
    ],
    whyDangerousNote: 'Даже при внимательном уходе дома сложно обеспечить постоянный медицинский контроль.',
    howItWorksTitle: 'Как организована паллиативная помощь',
    howItWorks: [
      'Осмотр врача при поступлении',
      'Подбор и контроль обезболивающей терапии',
      'Круглосуточное наблюдение',
      'Помощь в гигиене',
      'Контроль питания',
      'Профилактика пролежней',
      'Поддержка родственников',
    ],
    howItWorksNote: 'Наша задача — максимально облегчить состояние пациента и обеспечить достойные условия.',
    whatsIncluded: [
      'Проживание',
      'Питание',
      'Медицинское наблюдение 24/7',
      'Контроль болевого синдрома',
      'Гигиенический уход',
      'Профилактика осложнений',
    ],
    in30daysTitle: 'Что получает семья',
    in30days: [
      'Уверенность в контроле состояния',
      'Снижение болевого синдрома',
      'Постоянная связь с персоналом',
      'Спокойствие за близкого человека',
    ],
    ifDelay: [
      'Усиление болевого синдрома',
      'Быстрое ухудшение состояния',
      'Риск осложнений без медицинского контроля',
    ],
    trialDayText: 'Вы можете оформить пробный день и оценить условия и подход персонала. Если вы принимаете решение остаться — стоимость засчитывается.',
    notForUs: [],
    finalText: 'В паллиативной помощи особенно важно постоянное наблюдение и контроль боли. Мы обеспечим достойные условия для вашего близкого.',
    seoTitle: 'Паллиативная помощь и уход 24/7',
    seoDescription: 'Контроль боли и круглосуточный уход. Медицинское наблюдение в стационаре.',
    seoKeywords: 'паллиативная помощь, паллиативный уход, контроль боли, круглосуточный уход, медицинское наблюдение тяжёлые пациенты',
    seoUrl: 'https://nmrehab.ru/diagnos/palliativ',
    heroImage: 'assets/img/dropme/hd_01.png',
    breadcrumbTitle: 'Паллиативная помощь',
    imgWhen:   'assets/img/dropme/pal1.webp',
    imgDanger: 'assets/img/dropme/pal2.webp',
    imgHow:    'assets/img/dropme/pal3.webp',
  },
};

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, RouterLink]
})
export class DirectionComponent implements OnInit {

  data!: DirectionData;

  // ── Модалки ─────────────────────────────────────────
  showCheckModal   = false;
  showConsultModal = false;
  checkSent        = false;
  consultSent      = false;
  checkModalTitle  = 'Проверить наличие мест';

  checkForm = new FormGroup({
    name:  new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  consultForm = new FormGroup({
    name:  new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  // ── Персонал ─────────────────────────────────────────
  staff = [
    {
      name: 'Жигарёв Антон Юрьевич',
      role: 'Директор стационара',
      photo: 'assets/img/team/zhigarev.webp'
    },
    {
      name: 'Попова Елена Владимировна',
      role: 'Главный врач, врач-терапевт, гастроэнтеролог<span>Стаж работы - 25лет</span>',
      photo: 'assets/img/team/popova_ev.webp'
    },
    {
      name: 'Левко Наталья Ивановна',
      role: 'Врач-УЗИ<span>Стаж работы - 36лет</span>',
      photo: 'assets/img/team/levko_ni.webp'
    },
    {
      name: 'Пилипейко Тамара',
      role: 'Cтаршая медсестра<span>Стаж работы - 14лет</span>',
      photo: 'assets/img/team/pilipeyko.webp'
    },
  ];

  // ── Галерея ───────────────────────────────────────────
  lightboxOpen  = false;
  lightboxIndex = 0;

  galleryImages = [
    { src: 'assets/img/dropme/К8.webp',    alt: 'Медицинский уход' },
    { src: 'assets/img/dropme/gal2.webp',  alt: 'Условия проживания' },
    { src: 'assets/img/dropme/gal3.webp',  alt: 'Коридор стационара' },
    { src: 'assets/img/dropme/gal4.webp',  alt: 'Реабилитация' },
    { src: 'assets/img/dropme/К17.webp',   alt: 'Занятия ЛФК' },
    { src: 'assets/img/dropme/gal7.webp',  alt: 'Медицинский уход' },
    { src: 'assets/img/dropme/gal5.webp',  alt: 'Территория' },
    { src: 'assets/img/dropme/455.webp',   alt: 'Занятия' },
    { src: 'assets/img/dropme/reab3.webp', alt: 'Условия' },
    { src: 'assets/img/dropme/gal8.webp',  alt: 'Пациенты' },
    { src: 'assets/img/dropme/gal9.webp',  alt: 'Палата' },
    { src: 'assets/img/dropme/К7.webp',    alt: 'Уход' },
    { src: 'assets/img/dropme/gal10.webp', alt: 'Восстановление' },
    { src: 'assets/img/dropme/gal11.webp', alt: 'В стационаре' },
    { src: 'assets/img/dropme/gal12.webp', alt: 'Помощь' },
    { src: 'assets/img/dropme/К9.webp',    alt: 'Лечение' },
    { src: 'assets/img/dropme/reab5.webp', alt: 'Реабилитация' },
    { src: 'assets/img/dropme/gal13.webp', alt: 'Досуг' },
    { src: 'assets/img/dropme/gal14.webp', alt: 'Отдых' },
    { src: 'assets/img/dropme/gal15.webp', alt: 'Отдых' },
  ];

  openLightbox(i: number): void {
    this.lightboxIndex = i;
    this.lightboxOpen  = true;
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
    if (this.lightboxOpen) {
      if (e.key === 'Escape')     this.closeLightbox();
      if (e.key === 'ArrowRight') this.lightboxNext();
      if (e.key === 'ArrowLeft')  this.lightboxPrev();
    }
    if ((this.showCheckModal || this.showConsultModal) && e.key === 'Escape') {
      this.closeModals();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private seo: SeoService,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      // Статические маршруты передают slug через data,
      // динамические (:slug) — через params (fallback)
      const slug: string = routeData['slug'] ?? this.route.snapshot.params['slug'];
      this.data = DIRECTIONS[slug] ?? DIRECTIONS['insult'];
      this.seo.updateSeoData({
        title:       this.data.seoTitle,
        description: this.data.seoDescription,
        keywords:    this.data.seoKeywords,
        url:         this.data.seoUrl,
        schemaType:  'medicalBusiness',
        breadcrumbs: [
          { name: 'Главная', url: 'https://nmrehab.ru/' },
          { name: this.data.breadcrumbTitle, url: this.data.seoUrl },
        ],
      });
    });
  }

  // ── Модалки ──────────────────────────────────────────
  openCheckModal(title = 'Проверить наличие мест'): void {
    this.checkModalTitle = title;
    this.showCheckModal = true;
    document.body.style.overflow = 'hidden';
  }
  openConsultModal(): void {
    this.showConsultModal = true;
    document.body.style.overflow = 'hidden';
  }
  closeModals(): void {
    this.showCheckModal   = false;
    this.showConsultModal = false;
    document.body.style.overflow = '';
  }
  closeOnOverlay(e: MouseEvent, modal: string): void {
    if ((e.target as HTMLElement).classList.contains('lp-modal-overlay')) {
      this.closeModals();
    }
  }

  submitCheck(): void {
    if (this.checkForm.valid) {
      const { name, phone } = this.checkForm.value;
      this.api.sendFormNotification(name!, phone!, `🛏 Проверить места (${this.data.breadcrumbTitle})`);
      this.checkSent = true;
      this.checkForm.reset();
    }
  }

  submitConsult(): void {
    if (this.consultForm.valid) {
      const { name, phone } = this.consultForm.value;
      this.api.sendFormNotification(name!, phone!, `💬 Консультация (${this.data.breadcrumbTitle})`);
      this.consultSent = true;
      this.consultForm.reset();
    }
  }

  initials(name: string): string {
    return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('');
  }
}
