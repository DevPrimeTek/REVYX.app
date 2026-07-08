/**
 * REVYX web-landing — bilingual marketing copy (RO primary, RU secondary).
 * Single source of truth for all on-page text. No scoring acronyms in UI
 * (benefits language only, per brand rule "puritate i18n").
 */

export type Locale = 'ro' | 'ru';

export interface TitleBody {
  title: string;
  body: string;
}

export interface Step {
  n: string;
  title: string;
  body: string;
}

export interface RatingItem {
  key: string;
  label: string;
  hint: string;
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
  problem: { eyebrow: string; title: string; intro: string; items: TitleBody[] };
  what: { eyebrow: string; title: string; body: string; notCrm: string };
  ai: { eyebrow: string; title: string; body: string; points: string[] };
  pillars: { eyebrow: string; title: string; items: TitleBody[]; note: string };
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
    market: string;
    marketOptions: string[];
    city: string;
    volume: string;
    volumeOptions: string[];
    ratingsTitle: string;
    ratings: RatingItem[];
    pain: string;
    painPlaceholder: string;
    blockers: string;
    blockersPlaceholder: string;
    aiConcern: string;
    aiConcernPlaceholder: string;
    paymentBand: string;
    paymentBandOptions: string[];
    recommend: string;
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
    title: 'Nu lipsa clienților te încetinește — lipsa instrumentului potrivit',
    intro:
      'Agenții buni pierd afaceri nu pentru că muncesc puțin, ci pentru că nimic din ce fac zilnic nu e conectat într-un singur loc.',
    items: [
      {
        title: 'Lipsa unui instrument pentru gestiunea clienților',
        body: 'Clienții, discuțiile și preferințele lor stau împrăștiate în telefon, WhatsApp și notițe — nu într-un singur loc, ordonat și accesibil oricând ai nevoie.',
      },
      {
        title: 'Lipsa analizei automate a lead-urilor',
        body: 'Nu ai un sistem care să-ți spună care lead chiar merită timpul tău acum și care se răcește dacă nu răspunzi imediat.',
      },
      {
        title: 'Lucrul echipei, neconsolidat',
        body: 'Agenți, agenție și grup lucrează fiecare separat, fără o imagine comună asupra clienților, proprietăților și rezultatelor.',
      },
      {
        title: 'Gestiunea proprietăților, împrăștiată',
        body: 'Anunțuri, poze, prețuri și stadiul fiecărei proprietăți stau în locuri diferite, greu de urmărit și de actualizat la zi.',
      },
      {
        title: 'Vânzare și închiriere, tratate separat',
        body: 'Deși fac parte din aceeași muncă zilnică, cele două cer instrumente și fluxuri diferite, greu de ținut simultan sub control.',
      },
      {
        title: 'Tranzacția, greu de urmărit',
        body: 'Nu vezi mereu clar în ce stadiu e o afacere, cine are următorul pas și ce risc apare pe drum, până e prea târziu.',
      },
    ],
  },
  what: {
    eyebrow: 'Ce este REVYX',
    title: 'Sistemul care lucrează în locul tău, pentru munca ta zilnică',
    body: 'REVYX este un Agent Operating System — un sistem format din 8 module care lucrează împreună și trec cu tine prin tot fluxul de lucru: de la primul contact cu clientul până la semnarea la notar. Fiecare modul rezolvă o parte reală din munca ta de zi cu zi, ca tu să te ocupi de oameni, nu de organizare.',
    notCrm: 'Un CRM stochează contacte. REVYX îți spune ce să faci cu ele — pas cu pas.',
  },
  ai: {
    eyebrow: 'Rolul tehnologiei',
    title: 'Tehnologia care te pune în față, nu care te înlocuiește',
    body: 'REVYX nu vorbește niciodată în locul tău. Lucrează în spatele tău — strânge informația, așază prioritățile, îți pregătește pasul următor. Tu intri la fiecare discuție pregătit și la timp. Clientul simte un agent mai bun; tu ai mai mult timp pentru oameni și mai puțină rutină.',
    points: ['Deciziile rămân ale tale', 'Relația cu clientul rămâne a ta', 'AI-ul preia rutina, nu rolul tău'],
  },
  pillars: {
    eyebrow: 'Cele 8 module',
    title: 'Cum lucrează sistemul, pas cu pas',
    items: [
      {
        title: 'Prioritizarea clienților',
        body: 'Fiecare client nou primește automat un rang de prioritate, ca să știi cu cine vorbești primul și să nu mai pierzi pe cei pregătiți să cumpere sau să închirieze acum.',
      },
      {
        title: 'Calitatea ofertei',
        body: 'Sistemul urmărește ce anunțuri sunt proaspete și complete, ca proprietățile tale să rămână vizibile și atractive, nu îngropate în portofoliu.',
      },
      {
        title: 'Potrivirea client ↔ proprietate',
        body: 'Pentru fiecare client primești automat proprietățile care se potrivesc cu adevărat, iar pentru fiecare proprietate — clienții compatibili.',
      },
      {
        title: 'Pasul următor',
        body: 'Nu mai ghicești ce ai de făcut: sistemul îți spune exact acțiunea următoare pentru fiecare client — sună, programează, cere acte.',
      },
      {
        title: 'Șansa de închidere',
        body: 'Vezi cât de aproape e o afacere de a se închide, ca să știi unde să-ți concentrezi timpul chiar acum.',
      },
      {
        title: 'Sănătatea tranzacției',
        body: 'Fiecare tranzacție e urmărită pas cu pas; dacă ceva riscă să întârzie sau să cadă, afli din timp, nu la final.',
      },
      {
        title: 'Performanța ta și a echipei',
        body: 'Rezultatele tale și ale echipei — tranzacții, comisioane, creștere — sunt urmărite clar, într-un singur loc.',
      },
      {
        title: 'Încrederea clientului',
        body: 'Sistemul urmărește dacă îți ții promisiunile față de client, pentru relații care aduc recomandări și clienți noi.',
      },
    ],
    note: 'Nu trebuie să înțelegi tehnologia din spate. Cele 8 module lucrează împreună, în fundal — tu primești un singur lucru, simplu: ce ai de făcut azi.',
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
    title: 'Spune-ne cum lucrezi — durează 3-4 minute',
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
    market: 'Pe ce piață lucrezi?',
    marketOptions: ['Vânzare', 'Chirie', 'Ambele'],
    city: 'Orașul / zona în care lucrezi',
    volume: 'Câți clienți noi ai într-o lună, în medie?',
    volumeOptions: ['Sub 10', '10–30', '30–60', 'Peste 60'],
    ratingsTitle: 'Cât de valoroase ți s-au părut aceste capabilități în demo? (1 = deloc, 5 = foarte mult)',
    ratings: [
      { key: 'leads', label: 'Filtrarea lead-urilor', hint: 'doar contactele bune ajung la tine' },
      { key: 'nba', label: 'Recomandarea pasului următor', hint: 'ce ai de făcut acum, per client' },
      { key: 'match', label: 'Potrivirea client ↔ proprietate', hint: 'top proprietăți per client, clienți per proprietate' },
      { key: 'deals', label: 'Vizibilitatea tranzacțiilor', hint: 'stadiu, risc, cine urmează' },
      { key: 'daily', label: 'Aș folosi REVYX zilnic', hint: 'pe fluxul meu real de lucru' },
    ],
    pain: 'Care e cea mai mare bătaie de cap în munca ta zilnică?',
    painPlaceholder: 'Ex: pierd lead-uri pentru că nu răspund la timp...',
    blockers: 'Ce te-ar opri să folosești REVYX în fiecare zi?',
    blockersPlaceholder: 'Ex: nu are integrare cu portalul X, nu văd comisionul clar...',
    aiConcern: 'Ce te îngrijorează la o platformă ghidată de AI?',
    aiConcernPlaceholder: 'Ex: mă tem că pierd controlul deciziei, că clientul simte o mașină...',
    paymentBand: 'Cât ai fi dispus să plătești lunar pentru un instrument ca acesta? (opțional, ne ajută să stabilim prețul corect)',
    paymentBandOptions: ['Sub 20€', '20–50€', '50–100€', 'Peste 100€', 'Prefer să nu spun'],
    recommend: 'Aș recomanda demo-ul unui alt agent.',
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
    title: 'Вас тормозит не нехватка клиентов — а отсутствие подходящего инструмента',
    intro:
      'Хорошие агенты теряют сделки не потому, что мало работают, а потому, что ничего из того, что они делают ежедневно, не связано в одном месте.',
    items: [
      {
        title: 'Нет инструмента для управления клиентами',
        body: 'Клиенты, переписки и их предпочтения разбросаны по телефону, WhatsApp и заметкам — а не собраны в одном упорядоченном и доступном месте.',
      },
      {
        title: 'Нет автоматического анализа заявок',
        body: 'У вас нет системы, которая скажет, какая заявка действительно заслуживает вашего времени сейчас, а какая остынет, если не ответить сразу.',
      },
      {
        title: 'Работа команды не объединена',
        body: 'Агенты, агентство и группа работают порознь, без общей картины по клиентам, объектам и результатам.',
      },
      {
        title: 'Управление объектами разрознено',
        body: 'Объявления, фото, цены и статус каждого объекта хранятся в разных местах — сложно отслеживать и обновлять вовремя.',
      },
      {
        title: 'Продажа и аренда обрабатываются отдельно',
        body: 'Хотя это часть одной и той же ежедневной работы, для них нужны разные инструменты и процессы, которые сложно контролировать одновременно.',
      },
      {
        title: 'Сделку сложно отслеживать',
        body: 'Не всегда понятно, на каком этапе сделка, за кем следующий шаг и какой риск возникает на пути — пока не станет слишком поздно.',
      },
    ],
  },
  what: {
    eyebrow: 'Что такое REVYX',
    title: 'Система, которая работает за вас, для вашей ежедневной работы',
    body: 'REVYX — это Agent Operating System: система из 8 модулей, которые работают вместе и проходят с вами через весь рабочий процесс — от первого контакта с клиентом до подписания у нотариуса. Каждый модуль решает реальную часть вашей повседневной работы, чтобы вы занимались людьми, а не организацией.',
    notCrm: 'CRM хранит контакты. REVYX говорит, что с ними делать — шаг за шагом.',
  },
  ai: {
    eyebrow: 'Роль технологии',
    title: 'Технология, которая выводит вас вперёд, а не заменяет вас',
    body: 'REVYX никогда не говорит с клиентом вместо вас. Она работает за вашей спиной — собирает информацию, расставляет приоритеты, готовит следующий шаг. Вы приходите на каждую встречу подготовленным и вовремя. Клиент чувствует более внимательного агента; у вас — больше времени для людей и меньше рутины.',
    points: ['Решения остаются за вами', 'Отношения с клиентом остаются вашими', 'ИИ берёт на себя рутину, а не вашу роль'],
  },
  pillars: {
    eyebrow: 'Восемь модулей',
    title: 'Как работает система, шаг за шагом',
    items: [
      {
        title: 'Приоритет клиентов',
        body: 'Каждый новый клиент автоматически получает уровень приоритета — вы знаете, с кем говорить первым, и не теряете тех, кто уже готов купить или снять сейчас.',
      },
      {
        title: 'Качество предложения',
        body: 'Система следит за тем, какие объявления свежие и полные, чтобы ваши объекты оставались на виду, а не терялись в портфеле.',
      },
      {
        title: 'Совпадение клиент ↔ объект',
        body: 'Для каждого клиента вы автоматически получаете подходящие объекты, а для каждого объекта — совместимых клиентов.',
      },
      {
        title: 'Следующий шаг',
        body: 'Не нужно гадать, что делать: система точно говорит, каким будет следующее действие для каждого клиента — позвонить, назначить показ, запросить документы.',
      },
      {
        title: 'Шанс на закрытие',
        body: 'Вы видите, насколько сделка близка к закрытию, чтобы точно знать, куда направить своё время прямо сейчас.',
      },
      {
        title: 'Здоровье сделки',
        body: 'Каждая сделка отслеживается шаг за шагом; если что-то рискует задержаться или сорваться, вы узнаёте заранее, а не в конце.',
      },
      {
        title: 'Ваши результаты и результаты команды',
        body: 'Ваши показатели и показатели команды — сделки, комиссии, рост — видны ясно, в одном месте.',
      },
      {
        title: 'Доверие клиента',
        body: 'Система отслеживает, держите ли вы обещания перед клиентом — для отношений, которые приносят рекомендации и новых клиентов.',
      },
    ],
    note: 'Вам не нужно разбираться в технологии за этим. Восемь модулей работают вместе, на фоне — вы получаете одну простую вещь: что делать сегодня.',
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
    title: 'Расскажите, как вы работаете — 3-4 минуты',
    body: 'Ваши ответы показывают, что строить в первую очередь. Оставьте действующий email, чтобы мы забронировали ваш бесплатный год.',
    name: 'Имя (необязательно)',
    email: 'Email',
    role: 'Ваша роль?',
    roleOptions: ['Независимый агент', 'Брокер / владелец агентства', 'Менеджер сети', 'Другое'],
    market: 'На каком рынке вы работаете?',
    marketOptions: ['Продажа', 'Аренда', 'Оба варианта'],
    city: 'Город / район, где вы работаете',
    volume: 'Сколько новых клиентов у вас в среднем за месяц?',
    volumeOptions: ['Меньше 10', '10–30', '30–60', 'Больше 60'],
    ratingsTitle: 'Насколько ценными показались вам эти возможности в демо? (1 = совсем нет, 5 = очень)',
    ratings: [
      { key: 'leads', label: 'Фильтрация заявок', hint: 'только хорошие контакты доходят до вас' },
      { key: 'nba', label: 'Рекомендация следующего шага', hint: 'что делать сейчас, по каждому клиенту' },
      { key: 'match', label: 'Совпадение клиент ↔ объект', hint: 'топ объектов на клиента, клиентов на объект' },
      { key: 'deals', label: 'Видимость сделок', hint: 'этап, риск, кто следующий' },
      { key: 'daily', label: 'Я бы пользовался REVYX ежедневно', hint: 'в своей реальной работе' },
    ],
    pain: 'Что доставляет больше всего хлопот в вашей ежедневной работе?',
    painPlaceholder: 'Напр.: теряю заявки, потому что не отвечаю вовремя...',
    blockers: 'Что помешало бы вам пользоваться REVYX каждый день?',
    blockersPlaceholder: 'Напр.: нет интеграции с порталом X, не вижу комиссию явно...',
    aiConcern: 'Что вас беспокоит в платформе, управляемой ИИ?',
    aiConcernPlaceholder: 'Напр.: боюсь потерять контроль над решением, что клиент почувствует машину...',
    paymentBand: 'Сколько вы были бы готовы платить в месяц за такой инструмент? (необязательно, поможет установить верную цену)',
    paymentBandOptions: ['Меньше 20€', '20–50€', '50–100€', 'Больше 100€', 'Предпочитаю не говорить'],
    recommend: 'Я бы порекомендовал демо другому агенту.',
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
