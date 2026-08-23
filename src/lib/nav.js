// Single source of truth for navigation, routes and page metadata.
// `slug` is the URL segment (also the folder name under src/app).
// `icon` is a key into src/components/ui/Icon.js.
// `desc` is the localized subtitle shown in the page header.

export const CATEGORIES = [
  {
    id: 'calculators',
    icon: 'calc',
    label: { en: 'Calculators', uk: 'Калькулятори', ru: 'Калькуляторы' },
    pages: [
      {
        slug: 'pet-calculator', icon: 'paw',
        label: { en: 'Pet Calculator', uk: 'Калькулятор Тварин', ru: 'Калькулятор Питомцев' },
        desc: {
          en: 'Enter base stats and pick modifiers to see final pet stats.',
          uk: 'Введи базові стати та модифікатори — отримай фінальні стати пета.',
          ru: 'Введи базовые статы и модификаторы — получи финальные статы пета.',
        },
      },
      {
        slug: 'arm-calculator', icon: 'dumbbell',
        label: { en: 'Arm Calculator', uk: 'Калькулятор Сили', ru: 'Калькулятор Руки' },
        desc: {
          en: 'Enter base arm stats and pick a golden tier for the maximum.',
          uk: 'Введи базові стати руки та рівень golden — побачиш максимум.',
          ru: 'Введи базовые статы руки и уровень golden — увидишь максимум.',
        },
      },
      {
        slug: 'grind-calculator', icon: 'trending',
        label: { en: 'Grind Calculator', uk: 'Калькулятор Прокачки', ru: 'Калькулятор Качи' },
        desc: {
          en: 'Enter your base grind value, then pick your active boosts.',
          uk: 'Введи базове значення фарму та обери активні бусти.',
          ru: 'Введи базовое значение фарма и выбери активные бусты.',
        },
      },
      {
        slug: 'roulette-calculator', icon: 'target',
        label: { en: 'Roulette Calculator', uk: 'Калькулятор Рулетки', ru: 'Калькулятор Рулетки' },
        desc: {
          en: 'Estimate your roulette odds and expected rewards.',
          uk: 'Оціни шанси рулетки та очікувані нагороди.',
          ru: 'Оцени шансы рулетки и ожидаемые награды.',
        },
      },
      {
        slug: 'boss-calculator', icon: 'swords',
        label: { en: 'Boss Calculator', uk: 'Калькулятор Босів', ru: 'Калькулятор Боссов' },
        desc: {
          en: 'Calculate the damage and time needed to beat a boss.',
          uk: 'Порахуй урон і час, потрібні щоб перемогти боса.',
          ru: 'Посчитай урон и время, нужные чтобы победить босса.',
        },
      },
      {
        slug: 'molten-trainer-calculator', icon: 'flame',
        label: { en: 'Molten Trainers', uk: 'Molten Trainers', ru: 'Molten Trainers' },
        desc: {
          en: 'Trainer upgrade — enter your % and get the result after Molten.',
          uk: 'Апгрейд тренера — введи свій % і отримай результат після Molten.',
          ru: 'Апгрейд тренера — введи свой % и получи результат после Molten.',
        },
      },
    ],
  },
  {
    id: 'info',
    icon: 'info',
    label: { en: 'Info', uk: 'Інформація', ru: 'Информация' },
    pages: [
      {
        slug: 'boosts', icon: 'rocket',
        label: { en: 'Boosts', uk: 'Буст', ru: 'Бусты' },
        desc: {
          en: 'All slime, mutation, size and level multipliers.',
          uk: 'Усі множники слаймів, мутацій, розмірів і рівнів.',
          ru: 'Все множители слаймов, мутаций, размеров и уровней.',
        },
      },
      {
        slug: 'shiny', icon: 'sparkles',
        label: { en: 'Shiny Stats', uk: 'Статистика Шайні', ru: 'Статистика Шайни' },
        desc: {
          en: 'Base stats and their shiny equivalents.',
          uk: 'Базові стати та їхні shiny-еквіваленти.',
          ru: 'Базовые статы и их shiny-эквиваленты.',
        },
      },
      {
        slug: 'secret', icon: 'ghost',
        label: { en: 'Secret Pets', uk: 'Секретні Тварини', ru: 'Секретные Питомцы' },
        desc: {
          en: 'Rare secret pets, their stats and where to find them.',
          uk: 'Рідкісні секретні пети, їхні стати та де їх знайти.',
          ru: 'Редкие секретные петы, их статы и где их найти.',
        },
      },
      {
        slug: 'codes', icon: 'gift',
        label: { en: 'Codes', uk: 'Коди', ru: 'Коды' },
        desc: {
          en: 'Active codes and the rewards they give.',
          uk: 'Активні коди та нагороди, які вони дають.',
          ru: 'Активные коды и награды, которые они дают.',
        },
      },
      {
        slug: 'charms', icon: 'gem',
        label: { en: 'Charms', uk: 'Чари', ru: 'Чармы' },
        desc: {
          en: 'Every charm and what it does.',
          uk: 'Усі чарми та що вони роблять.',
          ru: 'Все чармы и что они делают.',
        },
      },
      {
        slug: 'worlds', icon: 'globe',
        label: { en: 'Worlds', uk: 'Світи', ru: 'Миры' },
        desc: {
          en: 'Every world, its features and requirements.',
          uk: 'Усі світи, їхні особливості та вимоги.',
          ru: 'Все миры, их особенности и требования.',
        },
      },
    ],
  },
];

export const ALL_PAGES = CATEGORIES.flatMap((c) => c.pages);

export const DEFAULT_SLUG = 'pet-calculator';

export function findPage(slug) {
  return ALL_PAGES.find((p) => p.slug === slug) || null;
}
