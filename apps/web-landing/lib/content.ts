/**
 * REVYX web-landing — bilingual marketing copy (RO primary, RU secondary).
 * Single source of truth for all on-page text. No scoring acronyms in UI
 * (benefits language only, per brand rule "puritate i18n").
 */

export type Locale = 'ro' | 'ru';

export interface PillarBlock {
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
  ai: { eyebrow: string; title: string; body: string; points: string[] };
  pillars: { eyebrow: string; title: string; blocks: PillarBlock[]; note: string };
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
    benefits: 'Cum te ajută',
    bonus: 'Bonus',
    feedback: 'Participă',
    cta: 'Încearcă demo',
  },
  hero: {
    badge: 'Instrument de lucru pentru agentul imobiliar',
    title1: 'Puntea ta peste haos și rutină,',
    title2: 'spre tranzacție finisată și client fericit.',
    subtitle:
      'REVYX trece cu tine prin tot fluxul de lucru — de la primul contact până la tranzacția încheiată — și elimină haosul și rutina de pe drum. Rămân doar oamenii și deciziile care contează.',
    ctaDemo: 'Încearcă demo-ul live',
    ctaFeedback: 'Participă la dezvoltare',
    trust: 'De la primul contact până la vânzare efectuată — un singur flux, un singur instrument.',
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
    body: 'REVYX este sistemul care trece cu tine prin tot fluxul de lucru — de la primul contact cu clientul până la semnarea la notar. Preia rutina, îți dă ordinea de priorități și te lasă să faci ce contează: să vorbești cu oamenii și să închizi afaceri.',
    notCrm: 'Un CRM stochează contacte. REVYX îți spune ce să faci cu ele — pas cu pas.',
  },
  ai: {
    eyebrow: 'Rolul tehnologiei',
    title: 'Tehnologia care te pune în față, nu care te înlocuiește',
    body: 'REVYX nu vorbește niciodată în locul tău. Lucrează în spatele tău — strânge informația, așază prioritățile, îți pregătește pasul următor. Tu intri la fiecare discuție pregătit și la timp. Clientul simte un agent mai bun; tu ai mai mult timp pentru oameni și mai puțină rutină.',
    points: ['Deciziile rămân ale tale', 'Relația cu clientul rămâne a ta', 'AI-ul preia rutina, nu rolul tău'],
  },
  pillars: {
    eyebrow: 'Cum te ajută, în fiecare zi',
    title: 'Trei lucruri simple, mereu în fundal',
    blocks: [
      {
        title: 'Știi cu cine să vorbești',
        body: 'Clienții tăi vin ordonați, cei urgenți în față — nu mai cauți prin zeci de conversații ca să afli cine așteaptă un răspuns.',
      },
      {
        title: 'Știi ce să faci',
        body: 'Pasul următor e mereu clar: sună, programează o vizionare, cere acte, pregătește oferta. Fără liste lungi și confuze.',
      },
      {
        title: 'Vezi cât ai crescut',
        body: 'Tranzacții închise, încrederea clienților, obiectivele tale — totul la un loc, ca să știi exact unde ești și unde poți mai mult.',
      },
    ],
    note: 'Nu trebuie să înțelegi tehnologia. Ea lucrează singură în fundal — tu primești un singur lucru, simplu: ce ai de făcut azi.',
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
    benefits: 'Как помогает',
    bonus: 'Бонус',
    feedback: 'Участвовать',
    cta: 'Открыть демо',
  },
  hero: {
    badge: 'Рабочий инструмент для агента по недвижимости',
    title1: 'Ваш мост через хаос и рутину,',
    title2: 'к завершённой сделке и довольному клиенту.',
    subtitle:
      'REVYX проходит с вами через весь рабочий процесс — от первого контакта до завершения сделки — и убирает с пути хаос и рутину. Остаются только люди и решения, которые действительно важны.',
    ctaDemo: 'Открыть живое демо',
    ctaFeedback: 'Участвовать в разработке',
    trust: 'От первого контакта до завершённой продажи — единый поток, единый инструмент.',
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
    body: 'REVYX — это система, которая проходит с вами через весь рабочий процесс — от первого контакта с клиентом до подписания у нотариуса. Берёт на себя рутину, задаёт приоритеты и оставляет вам главное: общаться с людьми и закрывать сделки.',
    notCrm: 'CRM хранит контакты. REVYX говорит, что с ними делать — шаг за шагом.',
  },
  ai: {
    eyebrow: 'Роль технологии',
    title: 'Технология, которая выводит вас вперёд, а не заменяет вас',
    body: 'REVYX никогда не говорит с клиентом вместо вас. Она работает за вашей спиной — собирает информацию, расставляет приоритеты, готовит следующий шаг. Вы приходите на каждую встречу подготовленным и вовремя. Клиент чувствует более внимательного агента; у вас — больше времени для людей и меньше рутины.',
    points: ['Решения остаются за вами', 'Отношения с клиентом остаются вашими', 'ИИ берёт на себя рутину, а не вашу роль'],
  },
  pillars: {
    eyebrow: 'Как это помогает вам, каждый день',
    title: 'Три простые вещи, всегда на фоне',
    blocks: [
      {
        title: 'Вы знаете, с кем говорить',
        body: 'Ваши клиенты приходят упорядоченными, срочные — впереди. Не нужно искать в десятках переписок, кто ждёт ответа.',
      },
      {
        title: 'Вы знаете, что делать',
        body: 'Следующий шаг всегда ясен: позвонить, назначить показ, запросить документы, подготовить предложение. Без длинных запутанных списков.',
      },
      {
        title: 'Вы видите, насколько выросли',
        body: 'Закрытые сделки, доверие клиентов, ваши цели — всё в одном месте, чтобы точно знать, где вы сейчас и где можете больше.',
      },
    ],
    note: 'Вам не нужно разбираться в технологии. Она работает сама на фоне — вы получаете одну простую вещь: что делать сегодня.',
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
