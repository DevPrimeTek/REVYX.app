/**
 * REVYX web-landing — bilingual marketing copy (RO primary, RU secondary).
 * Single source of truth for all on-page text. No scoring acronyms in UI
 * (benefits language only, per brand rule "puritate i18n").
 */

export type Locale = 'ro' | 'ru';

export interface Benefit {
  title: string;
  body: string;
}

export interface Step {
  n: string;
  title: string;
  body: string;
}

export interface Copy {
  nav: { demo: string; benefits: string; bonus: string; feedback: string; cta: string };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    ctaDemo: string;
    ctaFeedback: string;
    trust: string;
  };
  problem: { eyebrow: string; title: string; items: string[] };
  what: { eyebrow: string; title: string; body: string; notCrm: string };
  benefits: { eyebrow: string; title: string; items: Benefit[] };
  how: { eyebrow: string; title: string; steps: Step[] };
  demo: { eyebrow: string; title: string; body: string; cta: string; note: string };
  bonus: {
    eyebrow: string;
    title: string;
    body: string;
    points: string[];
    cta: string;
  };
  feedback: {
    eyebrow: string;
    title: string;
    body: string;
    name: string;
    email: string;
    role: string;
    roleOptions: string[];
    city: string;
    volume: string;
    volumeOptions: string[];
    pain: string;
    painPlaceholder: string;
    wish: string;
    wishPlaceholder: string;
    consent: string;
    pilot: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    required: string;
  };
  footer: { tagline: string; company: string; confidential: string; rights: string };
}

const ro: Copy = {
  nav: {
    demo: 'Demo',
    benefits: 'Beneficii',
    bonus: 'Bonus',
    feedback: 'Participă',
    cta: 'Încearcă demo',
  },
  hero: {
    badge: 'Instrument de lucru pentru agentul imobiliar',
    title1: 'Nu un CRM.',
    title2: 'Sistemul tău de execuție zilnică.',
    subtitle:
      'REVYX îți spune pe cine să suni acum, ce proprietate se potrivește fiecărui client și în ce stadiu e fiecare tranzacție — ca să nu mai pierzi nicio afacere din lipsă de timp sau de ordine.',
    ctaDemo: 'Încearcă demo-ul live',
    ctaFeedback: 'Participă la dezvoltare',
    trust: 'Construit pentru piața din Republica Moldova · Vânzare și chirie',
  },
  problem: {
    eyebrow: 'Problema',
    title: 'Munca bună se pierde în haos, nu din lipsă de clienți',
    items: [
      'Lead-uri care se răcesc pentru că nu ai apucat să răspunzi la timp.',
      'Nu mai știi ce proprietate se potrivea cu ce client — totul e în cap sau în zeci de conversații.',
      'Tranzacțiile stau pe loc și nu vezi clar ce urmează, cine întârzie și ce risc apare.',
    ],
  },
  what: {
    eyebrow: 'Ce este REVYX',
    title: 'Un Agent Operating System, nu încă o agendă',
    body: 'REVYX este sistemul care organizează munca ta zilnică de la primul contact cu clientul până la semnarea la notar. Preia rutina, îți dă ordinea de priorități și te lasă să faci ce contează: să vorbești cu oamenii și să închizi afaceri.',
    notCrm:
      'Un CRM stochează contacte. REVYX îți spune ce să faci cu ele — pas cu pas.',
  },
  benefits: {
    eyebrow: 'Beneficii',
    title: 'Ce câștigi concret',
    items: [
      {
        title: 'Nu mai pierzi lead-uri',
        body: 'Fiecare cerere nouă e prioritizată automat și primești alertă înainte să se răcească. Sistemul îți amintește să răspunzi la timp.',
      },
      {
        title: 'Îți spune ce să faci acum',
        body: 'În loc de o listă lungă și confuză, vezi următorii pași recomandați pentru fiecare client — sună, programează vizionare, cere documente.',
      },
      {
        title: 'Potriviri client ↔ proprietate',
        body: 'Pentru fiecare cumpărător primești top proprietăți care se potrivesc cu adevărat, iar pentru fiecare proprietate — clienții compatibili.',
      },
      {
        title: 'Tranzacții clare, de la A la Z',
        body: 'Un flux vizual al fiecărei afaceri: în ce stadiu e, cine urmează, ce risc apare și ce comision aduce.',
      },
      {
        title: 'Vânzare și chirie, împreună',
        body: 'REVYX acoperă și vânzările, și închirierile — cu comisioane, documente și pași diferiți, dar în același loc.',
      },
      {
        title: 'Cabinet pentru tine și echipă',
        body: 'Agent, agenție sau grup — fiecare are cabinetul lui: performanță, istoric, clienți și obiective de creștere.',
      },
    ],
  },
  how: {
    eyebrow: 'Cum funcționează',
    title: 'Trei pași, zero bătaie de cap',
    steps: [
      {
        n: '01',
        title: 'Intră clientul',
        body: 'Cererile din reclame, portaluri sau apeluri ajung într-un singur loc, calificate și gata de acțiune.',
      },
      {
        n: '02',
        title: 'Sistemul îți dă direcția',
        body: 'Vezi pe cine să suni acum, ce să-i oferi și ce urmează — fără să mai ții totul în cap.',
      },
      {
        n: '03',
        title: 'Închizi afacerea',
        body: 'Urmărești tranzacția pas cu pas până la semnare, cu documentele și comisionul la vedere.',
      },
    ],
  },
  demo: {
    eyebrow: 'Vezi cu ochii tăi',
    title: 'Testează demo-ul live — fără cont, fără instalare',
    body: 'Deschide platforma exact așa cum o va folosi un agent: lead-uri, potriviri, flux de tranzacții și cabinet. Durează 3 minute.',
    cta: 'Deschide demo-ul',
    note: 'Se deschide într-o filă nouă. Date demonstrative, fără informații reale de clienți.',
  },
  bonus: {
    eyebrow: 'Program de pionierat',
    title: 'Ajută-ne să construim instrumentul potrivit — primești un an gratuit',
    body: 'Căutăm agenți care lucrează zilnic pe teren și ne spun sincer ce au nevoie. Feedback-ul tău intră direct în dezvoltare. Cei care participă acum primesc un an de acces gratuit după lansarea platformei.',
    points: [
      'Un an de acces gratuit după lansare, pentru participanții la această etapă.',
      'Influență reală asupra funcțiilor: ce ceri se construiește.',
      'Acces prioritar la pilot și la noile versiuni.',
    ],
    cta: 'Vreau să particip',
  },
  feedback: {
    eyebrow: 'Participă',
    title: 'Spune-ne cum lucrezi — durează 2 minute',
    body: 'Răspunsurile tale ne arată ce să construim mai întâi. Lasă-ne un email valid ca să-ți rezervăm anul gratuit.',
    name: 'Nume (opțional)',
    email: 'Email',
    role: 'Ce rol ai?',
    roleOptions: [
      'Agent independent',
      'Broker / proprietar de agenție',
      'Manager de rețea',
      'Altul',
    ],
    city: 'Orașul / zona în care lucrezi',
    volume: 'Câți clienți noi ai într-o lună, în medie?',
    volumeOptions: ['Sub 10', '10–30', '30–60', 'Peste 60'],
    pain: 'Care e cea mai mare bătaie de cap în munca ta zilnică?',
    painPlaceholder: 'Ex: pierd lead-uri pentru că nu răspund la timp...',
    wish: 'Ce te-ar face să folosești REVYX în fiecare zi?',
    wishPlaceholder: 'Ex: să văd clar ce am de făcut dimineața...',
    consent: 'Sunt de acord ca REVYX să-mi păstreze datele pentru a mă contacta despre platformă și bonusul de un an.',
    pilot: 'Vreau să fiu contactat pentru a testa platforma în pilot.',
    submit: 'Trimite și rezervă anul gratuit',
    sending: 'Se trimite...',
    success: 'Mulțumim! Ți-am înregistrat răspunsul și anul gratuit. Te contactăm în curând.',
    error: 'Ceva n-a mers. Încearcă din nou sau scrie-ne direct.',
    required: 'Completează câmpurile obligatorii și bifează acordul.',
  },
  footer: {
    tagline: 'Real Estate Execution Intelligence',
    company: 'ITPRO SYSTEM SRL',
    confidential: 'Platformă în dezvoltare · Republica Moldova',
    rights: 'Toate drepturile rezervate.',
  },
};

const ru: Copy = {
  nav: {
    demo: 'Демо',
    benefits: 'Преимущества',
    bonus: 'Бонус',
    feedback: 'Участвовать',
    cta: 'Открыть демо',
  },
  hero: {
    badge: 'Рабочий инструмент для агента по недвижимости',
    title1: 'Не CRM.',
    title2: 'Ваша система ежедневной работы.',
    subtitle:
      'REVYX подсказывает, кому позвонить сейчас, какой объект подходит каждому клиенту и на каком этапе каждая сделка — чтобы вы не теряли сделки из-за нехватки времени или порядка.',
    ctaDemo: 'Открыть живое демо',
    ctaFeedback: 'Участвовать в разработке',
    trust: 'Создано для рынка Республики Молдова · Продажа и аренда',
  },
  problem: {
    eyebrow: 'Проблема',
    title: 'Хорошая работа теряется в хаосе, а не из-за нехватки клиентов',
    items: [
      'Заявки остывают, потому что вы не успели вовремя ответить.',
      'Уже не помните, какой объект подходил какому клиенту — всё в голове или в десятках переписок.',
      'Сделки стоят на месте, и не видно, что дальше, кто задерживает и где риск.',
    ],
  },
  what: {
    eyebrow: 'Что такое REVYX',
    title: 'Operating System для агента, а не ещё один ежедневник',
    body: 'REVYX организует вашу ежедневную работу от первого контакта с клиентом до подписания у нотариуса. Берёт на себя рутину, задаёт приоритеты и оставляет вам главное: общаться с людьми и закрывать сделки.',
    notCrm: 'CRM хранит контакты. REVYX говорит, что с ними делать — шаг за шагом.',
  },
  benefits: {
    eyebrow: 'Преимущества',
    title: 'Что вы получаете конкретно',
    items: [
      {
        title: 'Больше не теряете заявки',
        body: 'Каждая новая заявка автоматически получает приоритет, а вы — напоминание, пока она не остыла.',
      },
      {
        title: 'Система подсказывает действие',
        body: 'Вместо длинного запутанного списка — рекомендованные следующие шаги по каждому клиенту: позвонить, назначить показ, запросить документы.',
      },
      {
        title: 'Совпадения клиент ↔ объект',
        body: 'Для каждого покупателя — топ действительно подходящих объектов, для каждого объекта — совместимые клиенты.',
      },
      {
        title: 'Понятные сделки от А до Я',
        body: 'Наглядный поток каждой сделки: этап, следующий шаг, риск и комиссия.',
      },
      {
        title: 'Продажа и аренда вместе',
        body: 'REVYX охватывает и продажи, и аренду — с разными комиссиями, документами и шагами, но в одном месте.',
      },
      {
        title: 'Кабинет для вас и команды',
        body: 'Агент, агентство или группа — у каждого свой кабинет: результаты, история, клиенты и цели роста.',
      },
    ],
  },
  how: {
    eyebrow: 'Как это работает',
    title: 'Три шага, ноль головной боли',
    steps: [
      {
        n: '01',
        title: 'Приходит клиент',
        body: 'Заявки из рекламы, порталов и звонков попадают в одно место — квалифицированные и готовые к действию.',
      },
      {
        n: '02',
        title: 'Система задаёт направление',
        body: 'Видно, кому звонить сейчас, что предложить и что дальше — не нужно держать всё в голове.',
      },
      {
        n: '03',
        title: 'Вы закрываете сделку',
        body: 'Ведёте сделку шаг за шагом до подписания — с документами и комиссией на виду.',
      },
    ],
  },
  demo: {
    eyebrow: 'Убедитесь сами',
    title: 'Попробуйте живое демо — без аккаунта и установки',
    body: 'Откройте платформу так, как её будет использовать агент: заявки, совпадения, поток сделок и кабинет. Займёт 3 минуты.',
    cta: 'Открыть демо',
    note: 'Откроется в новой вкладке. Демонстрационные данные, без реальной информации клиентов.',
  },
  bonus: {
    eyebrow: 'Программа первопроходцев',
    title: 'Помогите создать правильный инструмент — получите год бесплатно',
    body: 'Мы ищем агентов, которые работают в поле каждый день и честно скажут, что им нужно. Ваш отзыв идёт прямо в разработку. Участники этого этапа получают год бесплатного доступа после запуска платформы.',
    points: [
      'Год бесплатного доступа после запуска — для участников этого этапа.',
      'Реальное влияние на функции: что просите, то и строится.',
      'Приоритетный доступ к пилоту и новым версиям.',
    ],
    cta: 'Хочу участвовать',
  },
  feedback: {
    eyebrow: 'Участвовать',
    title: 'Расскажите, как вы работаете — 2 минуты',
    body: 'Ваши ответы показывают, что строить в первую очередь. Оставьте действующий email, чтобы мы забронировали ваш бесплатный год.',
    name: 'Имя (необязательно)',
    email: 'Email',
    role: 'Ваша роль?',
    roleOptions: ['Независимый агент', 'Брокер / владелец агентства', 'Менеджер сети', 'Другое'],
    city: 'Город / район, где вы работаете',
    volume: 'Сколько новых клиентов у вас в среднем за месяц?',
    volumeOptions: ['Меньше 10', '10–30', '30–60', 'Больше 60'],
    pain: 'Что доставляет больше всего хлопот в вашей ежедневной работе?',
    painPlaceholder: 'Напр.: теряю заявки, потому что не отвечаю вовремя...',
    wish: 'Что заставило бы вас пользоваться REVYX каждый день?',
    wishPlaceholder: 'Напр.: чётко видеть, что делать с утра...',
    consent: 'Согласен, чтобы REVYX хранил мои данные для связи о платформе и бонусе на год.',
    pilot: 'Хочу, чтобы со мной связались для тестирования платформы в пилоте.',
    submit: 'Отправить и забронировать бесплатный год',
    sending: 'Отправка...',
    success: 'Спасибо! Мы записали ваш ответ и бесплатный год. Скоро свяжемся.',
    error: 'Что-то пошло не так. Попробуйте снова или напишите нам напрямую.',
    required: 'Заполните обязательные поля и отметьте согласие.',
  },
  footer: {
    tagline: 'Real Estate Execution Intelligence',
    company: 'ITPRO SYSTEM SRL',
    confidential: 'Платформа в разработке · Республика Молдова',
    rights: 'Все права защищены.',
  },
};

export const content: Record<Locale, Copy> = { ro, ru };
