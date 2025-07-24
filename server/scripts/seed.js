const mongoose = require('mongoose');
require('dotenv').config();

// Импорт моделей
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Car = require('../models/Car');
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const News = require('../models/News');
const Contact = require('../models/Contact');

// Подключение к базе данных
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Подключение к MongoDB успешно');
    seedDatabase();
  })
  .catch(err => {
    console.error('Ошибка подключения к MongoDB:', err);
    process.exit(1);
  });

async function seedDatabase() {
  try {
    // Очистка базы данных
    console.log('Очистка базы данных...');
    await Promise.all([
      Brand.deleteMany({}),
      Category.deleteMany({}),
      Car.deleteMany({}),
      User.deleteMany({}),
      Service.deleteMany({}),
      Order.deleteMany({}),
      Appointment.deleteMany({}),
      Review.deleteMany({}),
      News.deleteMany({}),
      Contact.deleteMany({})
    ]);

    // Создание брендов
    console.log('Создание брендов...');
    const brands = await Brand.insertMany([
      {
        name: 'BMW',
        logo: '/img/brands/bmw.png',
        description: 'Баварская компания по производству автомобилей, мотоциклов, двигателей и велосипедов.',
        country: 'Германия',
        founded: 1916,
        website: 'https://www.bmw.com',
        models: [
          { name: '3 Series', category: 'Седан', priceRange: { min: 2500000, max: 4000000 } },
          { name: 'X5', category: 'Кроссовер', priceRange: { min: 4500000, max: 7000000 } },
          { name: 'X3', category: 'Кроссовер', priceRange: { min: 3500000, max: 5500000 } }
        ]
      },
      {
        name: 'Audi',
        logo: '/img/brands/audi.png',
        description: 'Немецкий производитель легковых автомобилей, входящий в концерн Volkswagen Group.',
        country: 'Германия',
        founded: 1909,
        website: 'https://www.audi.com',
        models: [
          { name: 'A4', category: 'Седан', priceRange: { min: 2200000, max: 3800000 } },
          { name: 'Q5', category: 'Кроссовер', priceRange: { min: 3200000, max: 5200000 } },
          { name: 'A6', category: 'Седан', priceRange: { min: 3500000, max: 6000000 } }
        ]
      },
      {
        name: 'Mercedes-Benz',
        logo: '/img/brands/mercedes.png',
        description: 'Немецкий производитель премиальных легковых автомобилей, грузовиков, автобусов и других транспортных средств.',
        country: 'Германия',
        founded: 1926,
        website: 'https://www.mercedes-benz.com',
        models: [
          { name: 'C-Class', category: 'Седан', priceRange: { min: 2800000, max: 4500000 } },
          { name: 'GLC', category: 'Кроссовер', priceRange: { min: 3800000, max: 6200000 } },
          { name: 'E-Class', category: 'Седан', priceRange: { min: 4200000, max: 7500000 } }
        ]
      },
      {
        name: 'Volkswagen',
        logo: '/img/brands/volkswagen.png',
        description: 'Немецкий автомобилестроительный концерн, один из крупнейших автопроизводителей в мире.',
        country: 'Германия',
        founded: 1937,
        website: 'https://www.volkswagen.com',
        models: [
          { name: 'Polo', category: 'Хэтчбек', priceRange: { min: 1200000, max: 1800000 } },
          { name: 'Tiguan', category: 'Кроссовер', priceRange: { min: 2500000, max: 3800000 } },
          { name: 'Passat', category: 'Седан', priceRange: { min: 2200000, max: 3500000 } }
        ]
      },
      {
        name: 'Toyota',
        logo: '/img/brands/toyota.png',
        description: 'Японская автомобилестроительная корпорация, крупнейший автопроизводитель в мире.',
        country: 'Япония',
        founded: 1937,
        website: 'https://www.toyota.com',
        models: [
          { name: 'Camry', category: 'Седан', priceRange: { min: 2000000, max: 3200000 } },
          { name: 'RAV4', category: 'Кроссовер', priceRange: { min: 2800000, max: 4200000 } },
          { name: 'Land Cruiser', category: 'Внедорожник', priceRange: { min: 5500000, max: 8500000 } }
        ]
      }
    ]);

    // Создание категорий
    console.log('Создание категорий...');
    const categories = await Category.insertMany([
      {
        name: 'Седан',
        description: 'Классический тип кузова легкового автомобиля с четырьмя дверями и отдельным багажником.',
        icon: 'Car',
        image: '/img/categories/sedan.jpg',
        sortOrder: 1
      },
      {
        name: 'Хэтчбек',
        description: 'Тип кузова легкового автомобиля с укороченным задним свесом и дверью в задней стенке.',
        icon: 'Car',
        image: '/img/categories/hatchback.jpg',
        sortOrder: 2
      },
      {
        name: 'Универсал',
        description: 'Тип кузова легкового автомобиля с увеличенным багажным отделением.',
        icon: 'Car',
        image: '/img/categories/wagon.jpg',
        sortOrder: 3
      },
      {
        name: 'Кроссовер',
        description: 'Тип автомобиля, сочетающий в себе свойства легкового автомобиля и внедорожника.',
        icon: 'Truck',
        image: '/img/categories/crossover.jpg',
        sortOrder: 4
      },
      {
        name: 'Внедорожник',
        description: 'Автомобиль, предназначенный для езды по бездорожью и в сложных дорожных условиях.',
        icon: 'Truck',
        image: '/img/categories/suv.jpg',
        sortOrder: 5
      },
      {
        name: 'Купе',
        description: 'Тип кузова легкового автомобиля с двумя дверями и спортивным дизайном.',
        icon: 'Car',
        image: '/img/categories/coupe.jpg',
        sortOrder: 6
      }
    ]);

    // Создание пользователей
    console.log('Создание пользователей...');
    const users = await User.insertMany([
      {
        name: 'Администратор',
        email: 'admin@autopremium.ru',
        phone: '+7 (495) 123-45-67',
        password: 'admin123',
        role: 'admin',
        address: {
          street: 'ул. Примерная, 123',
          city: 'Москва',
          region: 'Московская область',
          postalCode: '123456'
        }
      },
      {
        name: 'Александр Иванов',
        email: 'manager1@autopremium.ru',
        phone: '+7 (495) 123-45-68',
        password: 'manager123',
        role: 'manager',
        address: {
          street: 'ул. Менеджерская, 45',
          city: 'Москва',
          region: 'Московская область',
          postalCode: '123457'
        }
      },
      {
        name: 'Елена Петрова',
        email: 'manager2@autopremium.ru',
        phone: '+7 (495) 123-45-69',
        password: 'manager123',
        role: 'manager',
        address: {
          street: 'ул. Автомобильная, 78',
          city: 'Москва',
          region: 'Московская область',
          postalCode: '123458'
        }
      },
      {
        name: 'Дмитрий Сидоров',
        email: 'dmitry@example.com',
        phone: '+7 (999) 111-22-33',
        password: 'user123',
        role: 'user',
        preferences: {
          brands: ['BMW', 'Audi'],
          priceRange: { min: 2000000, max: 5000000 },
          bodyTypes: ['Седан', 'Кроссовер'],
          fuelTypes: ['Бензин']
        },
        address: {
          street: 'ул. Клиентская, 12',
          city: 'Москва',
          region: 'Московская область',
          postalCode: '123459'
        }
      },
      {
        name: 'Анна Козлова',
        email: 'anna@example.com',
        phone: '+7 (999) 222-33-44',
        password: 'user123',
        role: 'user',
        preferences: {
          brands: ['Mercedes-Benz', 'Audi'],
          priceRange: { min: 3000000, max: 7000000 },
          bodyTypes: ['Кроссовер', 'Внедорожник'],
          fuelTypes: ['Бензин', 'Гибрид']
        },
        address: {
          street: 'пр. Покупательский, 89',
          city: 'Москва',
          region: 'Московская область',
          postalCode: '123460'
        }
      }
    ]);

    // Создание автомобилей
    console.log('Создание автомобилей...');
    const cars = [];
    
    // BMW автомобили
    const bmwBrand = brands.find(b => b.name === 'BMW');
    const sedanCategory = categories.find(c => c.name === 'Седан');
    const crossoverCategory = categories.find(c => c.name === 'Кроссовер');

    cars.push({
      name: 'BMW 3 Series 320i',
      brand: bmwBrand._id,
      model: '3 Series',
      year: 2024,
      price: 2890000,
      mileage: 0,
      fuel: 'Бензин',
      transmission: 'Автоматическая',
      bodyType: 'Седан',
      drive: 'Задний',
      engine: {
        volume: 2.0,
        power: 184,
        type: 'Бензиновый'
      },
      color: 'Серебристый металлик',
      vin: 'WBAVA31070NL12345',
      images: [
        '/img/35658ce2-0e0f-41a4-a417-c35990cabc29.jpg',
        '/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg'
      ],
      features: [
        'Кожаный салон',
        'Подогрев сидений',
        'Навигационная система',
        'Климат-контроль',
        'Bluetooth',
        'USB порты',
        'Круиз-контроль',
        'Парктроник'
      ],
      description: 'Элегантный и динамичный BMW 3 Series представляет собой идеальное сочетание спортивности и комфорта. Этот седан оснащен передовыми технологиями и обеспечивает превосходное качество вождения.',
      condition: 'Новый',
      availability: 'В наличии',
      category: sedanCategory._id,
      specifications: {
        dimensions: {
          length: 4709,
          width: 1827,
          height: 1442,
          wheelbase: 2851
        },
        weight: 1570,
        fuelTank: 59,
        trunkVolume: 480,
        doors: 4,
        seats: 5,
        maxSpeed: 235,
        acceleration: 7.1,
        consumption: 6.8
      },
      isHit: true,
      isNew: true,
      views: 245
    });

    cars.push({
      name: 'BMW X5 xDrive40i',
      brand: bmwBrand._id,
      model: 'X5',
      year: 2023,
      price: 5200000,
      mileage: 15000,
      fuel: 'Бензин',
      transmission: 'Автоматическая',
      bodyType: 'Кроссовер',
      drive: 'Полный',
      engine: {
        volume: 3.0,
        power: 340,
        type: 'Бензиновый'
      },
      color: 'Черный металлик',
      vin: 'WBAVA31070NL54321',
      images: [
        '/img/35658ce2-0e0f-41a4-a417-c35990cabc29.jpg'
      ],
      features: [
        'xDrive полный привод',
        'Harman Kardon аудиосистема',
        'Головной дисплей',
        'Массаж сидений',
        'Панорамная крыша',
        'Адаптивная подвеска',
        'Система помощи при парковке',
        'Камера заднего вида'
      ],
      description: 'Роскошный кроссовер BMW X5 сочетает в себе мощность, комфорт и передовые технологии. Идеальный выбор для тех, кто ценит качество и престиж.',
      condition: 'Б/у',
      availability: 'В наличии',
      category: crossoverCategory._id,
      specifications: {
        dimensions: {
          length: 4922,
          width: 2004,
          height: 1745,
          wheelbase: 2975
        },
        weight: 2135,
        fuelTank: 83,
        trunkVolume: 650,
        doors: 5,
        seats: 7,
        maxSpeed: 243,
        acceleration: 5.5,
        consumption: 9.1
      },
      isHit: false,
      isNew: false,
      views: 189
    });

    // Audi автомобили
    const audiBrand = brands.find(b => b.name === 'Audi');

    cars.push({
      name: 'Audi Q5 45 TFSI quattro',
      brand: audiBrand._id,
      model: 'Q5',
      year: 2024,
      price: 3450000,
      mileage: 0,
      fuel: 'Бензин',
      transmission: 'Автоматическая',
      bodyType: 'Кроссовер',
      drive: 'Полный',
      engine: {
        volume: 2.0,
        power: 249,
        type: 'Бензиновый'
      },
      color: 'Белый перламутр',
      vin: 'WAUZZZ8R0KA123456',
      images: [
        '/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg'
      ],
      features: [
        'quattro полный привод',
        'Панорамная крыша',
        'LED Matrix фары',
        'Virtual Cockpit',
        'Bang & Olufsen аудиосистема',
        'Адаптивная подвеска',
        'Система помощи при движении',
        'Беспроводная зарядка'
      ],
      description: 'Современный кроссовер Audi Q5 предлагает идеальный баланс между производительностью, комфортом и технологиями. Превосходный выбор для активного образа жизни.',
      condition: 'Новый',
      availability: 'В наличии',
      category: crossoverCategory._id,
      specifications: {
        dimensions: {
          length: 4663,
          width: 1893,
          height: 1659,
          wheelbase: 2819
        },
        weight: 1770,
        fuelTank: 70,
        trunkVolume: 550,
        doors: 5,
        seats: 5,
        maxSpeed: 237,
        acceleration: 6.1,
        consumption: 7.4
      },
      isHit: true,
      isNew: true,
      views: 312
    });

    cars.push({
      name: 'Audi A4 40 TFSI',
      brand: audiBrand._id,
      model: 'A4',
      year: 2023,
      price: 2650000,
      mileage: 8500,
      fuel: 'Бензин',
      transmission: 'Автоматическая',
      bodyType: 'Седан',
      drive: 'Передний',
      engine: {
        volume: 2.0,
        power: 190,
        type: 'Бензиновый'
      },
      color: 'Серый металлик',
      vin: 'WAUZZZ8K0KA654321',
      images: [
        '/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg'
      ],
      features: [
        'quattro полный привод',
        'Matrix LED фары',
        'Bang & Olufsen звук',
        'Адаптивная подвеска',
        'Virtual Cockpit Plus',
        'Система помощи при движении',
        'Подогрев и вентиляция сидений',
        'Беспроводная зарядка телефона'
      ],
      description: 'Элегантный седан Audi A4 сочетает в себе спортивный характер и премиальный комфорт. Идеальный автомобиль для деловых поездок и повседневного использования.',
      condition: 'Б/у',
      availability: 'В наличии',
      category: sedanCategory._id,
      specifications: {
        dimensions: {
          length: 4762,
          width: 1847,
          height: 1428,
          wheelbase: 2820
        },
        weight: 1520,
        fuelTank: 54,
        trunkVolume: 460,
        doors: 4,
        seats: 5,
        maxSpeed: 237,
        acceleration: 7.1,
        consumption: 6.9
      },
      isHit: true,
      isNew: false,
      views: 156
    });

    // Mercedes-Benz автомобили
    const mercedesBrand = brands.find(b => b.name === 'Mercedes-Benz');
    const coupeCategory = categories.find(c => c.name === 'Купе');

    cars.push({
      name: 'Mercedes-Benz C-Class Coupe C 300',
      brand: mercedesBrand._id,
      model: 'C-Class Coupe',
      year: 2024,
      price: 4120000,
      mileage: 0,
      fuel: 'Бензин',
      transmission: 'Автоматическая',
      bodyType: 'Купе',
      drive: 'Задний',
      engine: {
        volume: 2.0,
        power: 258,
        type: 'Бензиновый'
      },
      color: 'Синий металлик',
      vin: 'WDD2053421A123456',
      images: [
        '/img/8da9e761-2e1b-453f-9c89-1afd4df236ee.jpg'
      ],
      features: [
        'AMG пакет',
        'Burmester премиум звук',
        'MBUX мультимедиа',
        'Панорамная крыша',
        'Multibeam LED фары',
        'Air Body Control подвеска',
        'Система помощи при вождении',
        'Беспроводная зарядка'
      ],
      description: 'Стильное купе Mercedes-Benz C-Class сочетает в себе элегантный дизайн, мощную производительность и передовые технологии. Создано для тех, кто ценит индивидуальность.',
      condition: 'Новый',
      availability: 'В наличии',
      category: coupeCategory._id,
      specifications: {
        dimensions: {
          length: 4751,
          width: 1810,
          height: 1421,
          wheelbase: 2840
        },
        weight: 1615,
        fuelTank: 66,
        trunkVolume: 400,
        doors: 2,
        seats: 4,
        maxSpeed: 250,
        acceleration: 5.9,
        consumption: 7.8
      },
      isHit: false,
      isNew: true,
      views: 98
    });

    cars.push({
      name: 'Mercedes-Benz E-Class E 300 Hybrid',
      brand: mercedesBrand._id,
      model: 'E-Class',
      year: 2023,
      price: 3890000,
      mileage: 12000,
      fuel: 'Гибрид',
      transmission: 'Автоматическая',
      bodyType: 'Седан',
      drive: 'Задний',
      engine: {
        volume: 2.0,
        power: 299,
        type: 'Гибридный'
      },
      color: 'Черный обсидиан',
      vin: 'WDD2132421A654321',
      images: [
        '/img/8da9e761-2e1b-453f-9c89-1afd4df236ee.jpg'
      ],
      features: [
        'MBUX интеллектуальная система',
        'Air Body Control подвеска',
        'Burmester 3D звук',
        'Multibeam LED фары',
        'Система помощи при вождении',
        'Панорамная крыша',
        'Массаж сидений',
        'Беспроводная зарядка'
      ],
      description: 'Роскошный седан Mercedes-Benz E-Class с гибридной силовой установкой предлагает исключительный комфорт, передовые технологии и экономичность.',
      condition: 'Б/у',
      availability: 'В наличии',
      category: sedanCategory._id,
      specifications: {
        dimensions: {
          length: 4923,
          width: 1852,
          height: 1468,
          wheelbase: 2939
        },
        weight: 1750,
        fuelTank: 66,
        trunkVolume: 540,
        doors: 4,
        seats: 5,
        maxSpeed: 250,
        acceleration: 5.7,
        consumption: 5.9
      },
      isHit: false,
      isNew: false,
      views: 134
    });

    await Car.insertMany(cars);

    // Создание услуг
    console.log('Создание услуг...');
    const services = await Service.insertMany([
      {
        name: 'ТО-1 (15 000 км)',
        category: 'Техническое обслуживание',
        description: 'Базовое техническое обслуживание включает замену масла, проверку основных систем автомобиля.',
        price: { from: 8500, to: 12000 },
        duration: '2-3 часа',
        requirements: ['Сервисная книжка', 'Документы на автомобиль'],
        includes: ['Замена моторного масла', 'Замена масляного фильтра', 'Проверка уровня жидкостей', 'Диагностика основных систем'],
        warranty: { period: '6 месяцев', description: 'Гарантия на выполненные работы' },
        applicableBrands: ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Toyota'],
        popularity: 95
      },
      {
        name: 'ТО-2 (30 000 км)',
        category: 'Техническое обслуживание',
        description: 'Расширенное техническое обслуживание с заменой дополнительных расходных материалов.',
        price: { from: 12500, to: 18000 },
        duration: '3-4 часа',
        requirements: ['Сервисная книжка', 'Документы на автомобиль'],
        includes: ['Все работы ТО-1', 'Замена воздушного фильтра', 'Замена салонного фильтра', 'Проверка тормозной системы'],
        warranty: { period: '6 месяцев', description: 'Гарантия на выполненные работы' },
        applicableBrands: ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Toyota'],
        popularity: 87
      },
      {
        name: 'Компьютерная диагностика',
        category: 'Диагностика',
        description: 'Полная компьютерная диагностика всех электронных систем автомобиля.',
        price: { from: 2500, to: 4000 },
        duration: '1 час',
        requirements: ['Документы на автомобиль'],
        includes: ['Сканирование ошибок', 'Проверка датчиков', 'Анализ работы систем', 'Отчет о состоянии'],
        warranty: { period: '1 месяц', description: 'Гарантия на точность диагностики' },
        applicableBrands: ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Toyota'],
        difficulty: 'Простая',
        popularity: 78
      },
      {
        name: 'Замена масла и фильтров',
        category: 'Ремонт двигателя',
        description: 'Замена моторного масла и всех необходимых фильтров.',
        price: { from: 3500, to: 6000 },
        duration: '1 час',
        requirements: ['Выбор качественного масла'],
        includes: ['Слив старого масла', 'Замена масляного фильтра', 'Заливка нового масла', 'Проверка уровня'],
        warranty: { period: '6 месяцев', description: 'Гарантия на работы и материалы' },
        applicableBrands: ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Toyota'],
        difficulty: 'Простая',
        popularity: 92
      },
      {
        name: 'Покраска элемента кузова',
        category: 'Кузовной ремонт',
        description: 'Профессиональная покраска одного элемента кузова с подбором цвета.',
        price: { from: 15000, to: 25000 },
        duration: '2-3 дня',
        requirements: ['Оценка повреждений', 'Подбор краски'],
        includes: ['Подготовка поверхности', 'Грунтовка', 'Покраска', 'Полировка', 'Сборка'],
        warranty: { period: '2 года', description: 'Гарантия на покрасочные работы' },
        applicableBrands: ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Toyota'],
        difficulty: 'Сложная',
        popularity: 45
      },
      {
        name: 'Шиномонтаж',
        category: 'Шиномонтаж',
        description: 'Профессиональный шиномонтаж с балансировкой колес.',
        price: { from: 2000, to: 4000 },
        duration: '30-60 минут',
        requirements: ['Шины и диски'],
        includes: ['Демонтаж старых шин', 'Монтаж новых шин', 'Балансировка', 'Установка на автомобиль'],
        warranty: { period: '1 месяц', description: 'Гарантия на балансировку' },
        applicableBrands: ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Toyota'],
        difficulty: 'Простая',
        popularity: 89
      }
    ]);

    // Создание заказов
    console.log('Создание заказов...');
    const orders = [];
    const userDmitry = users.find(u => u.name === 'Дмитрий Сидоров');
    const userAnna = users.find(u => u.name === 'Анна Козлова');
    const manager1 = users.find(u => u.name === 'Александр Иванов');
    const manager2 = users.find(u => u.name === 'Елена Петрова');

    orders.push({
      user: userDmitry._id,
      car: cars[0]._id, // BMW 3 Series
      type: 'credit',
      status: 'confirmed',
      totalAmount: 2890000,
      downPayment: 500000,
      financing: {
        type: 'credit',
        bank: 'Сбербанк',
        term: 36,
        interestRate: 12.5,
        monthlyPayment: 78500
      },
      insurance: {
        company: 'Росгосстрах',
        type: 'КАСКО',
        premium: 85000,
        coverage: 'Полное покрытие'
      },
      delivery: {
        type: 'pickup',
        date: new Date('2024-02-15')
      },
      manager: manager1._id,
      notes: 'Клиент заинтересован в дополнительных опциях'
    });

    orders.push({
      user: userAnna._id,
      car: cars[2]._id, // Audi Q5
      type: 'purchase',
      status: 'processing',
      totalAmount: 3450000,
      downPayment: 3450000,
      financing: {
        type: 'cash'
      },
      insurance: {
        company: 'СОГАЗ',
        type: 'КАСКО + ОСАГО',
        premium: 95000,
        coverage: 'Расширенное покрытие'
      },
      delivery: {
        type: 'delivery',
        address: 'пр. Покупательский, 89, Москва',
        date: new Date('2024-02-20'),
        cost: 5000
      },
      manager: manager2._id,
      notes: 'VIP клиент, требует особого внимания'
    });

    await Order.insertMany(orders);

    // Создание записей на обслуживание
    console.log('Создание записей...');
    const appointments = [];
    const service1 = services.find(s => s.name === 'ТО-1 (15 000 км)');
    const service2 = services.find(s => s.name === 'Компьютерная диагностика');

    appointments.push({
      user: userDmitry._id,
      type: 'service',
      car: cars[1]._id, // BMW X5
      service: service1._id,
      date: new Date('2024-02-10'),
      time: '10:00',
      status: 'confirmed',
      duration: 180,
      notes: 'Плановое ТО',
      carInfo: {
        brand: 'BMW',
        model: 'X5',
        year: 2023,
        mileage: 15000,
        issues: 'Плановое обслуживание'
      },
      manager: manager1._id
    });

    appointments.push({
      user: userAnna._id,
      type: 'test-drive',
      car: cars[4]._id, // Mercedes C-Class Coupe
      date: new Date('2024-02-12'),
      time: '14:00',
      status: 'scheduled',
      duration: 60,
      notes: 'Заинтересована в покупке',
      customerInfo: {
        name: 'Анна Козлова',
        phone: '+7 (999) 222-33-44',
        email: 'anna@example.com',
        drivingExperience: '5-10 лет'
      },
      manager: manager2._id
    });

    appointments.push({
      user: userDmitry._id,
      type: 'service',
      service: service2._id,
      date: new Date('2024-02-08'),
      time: '16:00',
      status: 'completed',
      duration: 60,
      notes: 'Диагностика перед покупкой',
      carInfo: {
        brand: 'Audi',
        model: 'A4',
        year: 2023,
        mileage: 8500,
        issues: 'Проверка перед покупкой'
      },
      manager: manager1._id,
      feedback: {
        rating: 5,
        comment: 'Отличный сервис, все быстро и качественно!',
        submittedAt: new Date('2024-02-08T18:00:00')
      }
    });

    await Appointment.insertMany(appointments);

    // Создание отзывов
    console.log('Создание отзывов...');
    const reviews = [];

    reviews.push({
      user: userDmitry._id,
      car: cars[0]._id, // BMW 3 Series
      order: orders[0]._id,
      type: 'car',
      rating: 5,
      title: 'Отличный автомобиль!',
      comment: 'BMW 3 Series превзошел все мои ожидания. Отличная управляемость, комфортный салон, экономичный расход топлива. Менеджер Александр помог с выбором и оформлением кредита. Рекомендую!',
      pros: ['Отличная управляемость', 'Комфортный салон', 'Экономичный расход', 'Качественная сборка'],
      cons: ['Высокая стоимость обслуживания'],
      isVerified: true,
      isPublished: true,
      helpful: 12,
      moderationStatus: 'approved'
    });

    reviews.push({
      user: userAnna._id,
      service: service2._id,
      type: 'service',
      rating: 5,
      title: 'Профессиональная диагностика',
      comment: 'Очень довольна качеством диагностики. Мастера провели полную проверку автомобиля, выявили все проблемы и дали подробные рекомендации. Сервис на высшем уровне!',
      pros: ['Профессиональные мастера', 'Подробный отчет', 'Быстрое обслуживание'],
      cons: [],
      isVerified: true,
      isPublished: true,
      helpful: 8,
      moderationStatus: 'approved',
      responses: [{
        author: manager2._id,
        text: 'Спасибо за отзыв! Мы всегда стремимся предоставлять качественные услуги нашим клиентам.',
        isOfficial: true
      }]
    });

    reviews.push({
      user: userDmitry._id,
      type: 'company',
      rating: 4,
      title: 'Хороший автосалон',
      comment: 'В целом остался доволен покупкой. Хороший выбор автомобилей, компетентные менеджеры, удобное расположение. Единственный минус - долгое оформление документов.',
      pros: ['Большой выбор', 'Компетентные менеджеры', 'Удобное расположение'],
      cons: ['Долгое оформление документов'],
      isVerified: true,
      isPublished: true,
      helpful: 15,
      moderationStatus: 'approved'
    });

    await Review.insertMany(reviews);

    // Создание новостей
    console.log('Создание новостей...');
    const admin = users.find(u => u.role === 'admin');
    const news = [];

    news.push({
      title: 'Новый BMW 3 Series 2024 уже в наличии!',
      slug: 'novyj-bmw-3-series-2024-uzhe-v-nalichii',
      excerpt: 'Встречайте обновленный BMW 3 Series 2024 модельного года с улучшенным дизайном и новыми технологиями.',
      content: `
        <p>Мы рады сообщить, что новый BMW 3 Series 2024 модельного года уже доступен в нашем автосалоне!</p>
        
        <h3>Основные обновления:</h3>
        <ul>
          <li>Обновленный дизайн передней и задней части</li>
          <li>Новая мультимедийная система BMW iDrive 8</li>
          <li>Улучшенная топливная экономичность</li>
          <li>Расширенный пакет систем безопасности</li>
        </ul>
        
        <p>Приглашаем вас на тест-драйв нового BMW 3 Series. Запишитесь на удобное время по телефону или через наш сайт.</p>
        
        <p>Специальные условия кредитования от 11.9% годовых!</p>
      `,
      author: admin._id,
      category: 'Новые модели',
      tags: ['BMW', '3 Series', '2024', 'новинка'],
      featuredImage: '/img/news/bmw-3-series-2024.jpg',
      images: ['/img/news/bmw-3-series-interior.jpg', '/img/news/bmw-3-series-exterior.jpg'],
      status: 'published',
      publishDate: new Date('2024-01-15'),
      views: 1245,
      likes: 89,
      shares: 23,
      seo: {
        metaTitle: 'Новый BMW 3 Series 2024 в AutoPremium',
        metaDescription: 'Обновленный BMW 3 Series 2024 с новыми технологиями и улучшенным дизайном. Тест-драйв и специальные условия кредитования.',
        keywords: ['BMW 3 Series 2024', 'новый BMW', 'тест-драйв', 'кредит на BMW']
      },
      relatedCars: [cars[0]._id],
      isSticky: true
    });

    news.push({
      title: 'Зимняя акция: скидки до 300 000 рублей!',
      slug: 'zimnyaya-akciya-skidki-do-300000-rublej',
      excerpt: 'Специальные предложения на автомобили в наличии. Успейте воспользоваться выгодными условиями до конца февраля!',
      content: `
        <p>Зима - отличное время для покупки автомобиля! Мы подготовили для вас специальные предложения.</p>
        
        <h3>Условия акции:</h3>
        <ul>
          <li>Скидки до 300 000 рублей на автомобили в наличии</li>
          <li>Кредит от 9.9% годовых</li>
          <li>Trade-in с доплатой до 150 000 рублей</li>
          <li>Бесплатное КАСКО на первый год</li>
        </ul>
        
        <p>Акция действует до 29 февраля 2024 года. Количество автомобилей по специальной цене ограничено.</p>
        
        <p>Не упустите возможность приобрести автомобиль мечты на выгодных условиях!</p>
      `,
      author: admin._id,
      category: 'Акции',
      tags: ['акция', 'скидки', 'зима', 'выгодно'],
      featuredImage: '/img/news/winter-sale.jpg',
      status: 'published',
      publishDate: new Date('2024-01-20'),
      views: 2156,
      likes: 156,
      shares: 78,
      seo: {
        metaTitle: 'Зимняя акция в AutoPremium - скидки до 300 000 рублей',
        metaDescription: 'Специальные предложения на автомобили: скидки до 300 000 рублей, кредит от 9.9%, выгодный trade-in.',
        keywords: ['акция', 'скидки на автомобили', 'выгодный кредит', 'trade-in']
      },
      relatedCars: [cars[0]._id, cars[2]._id, cars[4]._id]
    });

    news.push({
      title: 'Открытие нового сервисного центра',
      slug: 'otkrytie-novogo-servisnogo-centra',
      excerpt: 'Мы расширяемся! Новый современный сервисный центр на севере Москвы готов принимать клиентов.',
      content: `
        <p>Мы рады сообщить об открытии нашего нового сервисного центра на севере Москвы!</p>
        
        <h3>Преимущества нового центра:</h3>
        <ul>
          <li>Современное оборудование для диагностики и ремонта</li>
          <li>Увеличенная пропускная способность</li>
          <li>Комфортная зона ожидания для клиентов</li>
          <li>Расширенный штат сертифицированных мастеров</li>
        </ul>
        
        <p>Адрес: Москва, Северный проезд, 45</p>
        <p>Режим работы: Пн-Пт 8:00-20:00, Сб 9:00-18:00</p>
        
        <p>Записывайтесь на обслуживание по телефону +7 (495) 123-45-72</p>
      `,
      author: admin._id,
      category: 'Новости компании',
      tags: ['сервис', 'открытие', 'новый центр'],
      featuredImage: '/img/news/new-service-center.jpg',
      status: 'published',
      publishDate: new Date('2024-01-25'),
      views: 892,
      likes: 45,
      shares: 12,
      seo: {
        metaTitle: 'Новый сервисный центр AutoPremium на севере Москвы',
        metaDescription: 'Открытие нового современного сервисного центра с передовым оборудованием и комфортными условиями.',
        keywords: ['сервисный центр', 'ремонт автомобилей', 'техобслуживание', 'север Москвы']
      }
    });

    await News.insertMany(news);

    // Создание обращений
    console.log('Создание обращений...');
    const contacts = [];

    contacts.push({
      name: 'Михаил Волков',
      email: 'mikhail@example.com',
      phone: '+7 (999) 333-44-55',
      subject: 'Покупка автомобиля',
      message: 'Здравствуйте! Интересует BMW X5 2023 года. Можно ли посмотреть автомобиль в выходные? Также интересуют условия кредитования.',
      status: 'new',
      priority: 'medium',
      assignedTo: manager1._id,
      source: 'website',
      relatedCar: cars[1]._id,
      customerType: 'new'
    });

    contacts.push({
      name: 'Светлана Морозова',
      email: 'svetlana@example.com',
      phone: '+7 (999) 444-55-66',
      subject: 'Сервисное обслуживание',
      message: 'Добрый день! Нужно записаться на плановое ТО для Audi A4. Когда есть свободное время на следующей неделе?',
      status: 'in-progress',
      priority: 'medium',
      assignedTo: manager2._id,
      source: 'phone',
      customerType: 'existing',
      responses: [{
        author: manager2._id,
        message: 'Здравствуйте! У нас есть свободное время во вторник в 14:00 и в четверг в 10:00. Какое время вам удобнее?',
        isInternal: false
      }]
    });

    contacts.push({
      name: 'Алексей Новиков',
      email: 'alexey@example.com',
      phone: '+7 (999) 555-66-77',
      subject: 'Trade-in',
      message: 'Хочу обменять свой автомобиль на новый. У меня Toyota Camry 2020 года, пробег 45000 км. Какова примерная стоимость trade-in?',
      status: 'resolved',
      priority: 'low',
      assignedTo: manager1._id,
      source: 'website',
      customerType: 'new',
      responses: [{
        author: manager1._id,
        message: 'Здравствуйте! Для точной оценки нужен осмотр автомобиля. Предварительная стоимость trade-in составляет 1 800 000 - 2 100 000 рублей. Приглашаем на оценку.',
        isInternal: false
      }]
    });

    await Contact.insertMany(contacts);

    console.log('База данных успешно заполнена тестовыми данными!');
    console.log(`Создано:
    - Брендов: ${brands.length}
    - Категорий: ${categories.length}
    - Автомобилей: ${cars.length}
    - Пользователей: ${users.length}
    - Услуг: ${services.length}
    - Заказов: ${orders.length}
    - Записей: ${appointments.length}
    - Отзывов: ${reviews.length}
    - Новостей: ${news.length}
    - Обращений: ${contacts.length}`);

  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
  } finally {
    mongoose.connection.close();
  }
}