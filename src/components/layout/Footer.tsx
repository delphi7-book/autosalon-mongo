import { Link, useNavigate } from 'react-router-dom';
import { useBrands } from '@/hooks/useApi';
import Icon from '@/components/ui/icon';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { data: brands } = useBrands();

  const footerSections = [
    {
      title: 'Услуги',
      links: [
        { name: 'Продажа автомобилей', href: '/catalog' },
        { name: 'Trade-in', href: '/trade-in' },
        { name: 'Кредитование', href: '/financing' },
        { name: 'Страхование', href: '/insurance' },
        { name: 'Сервисное обслуживание', href: '/service' },
        { name: 'Тест-драйв', href: '/test-drive' }
      ]
    },
    {
      title: 'Информация',
      links: [
        { name: 'О компании', href: '/about' },
        { name: 'Гарантия', href: '/warranty' },
        { name: 'Контакты', href: '/contacts' },
        { name: 'Вакансии', href: '#' },
        { name: 'Новости', href: '#' },
        { name: 'Отзывы', href: '#' }
      ]
    },
    {
      title: 'Марки',
      links: [
        ...(brands?.slice(0, 5).map(brand => ({
          name: brand.name,
          href: `/catalog?brand=${brand._id}`
        })) || []),
        { name: 'Все марки', href: '/catalog' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'YouTube', icon: 'Youtube', href: '#' },
    { name: 'VK', icon: 'MessageCircle', href: '#' },
    { name: 'Telegram', icon: 'Send', href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="Car" size={32} className="text-primary" />
              <span className="text-2xl font-bold">AutoPremium</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Ведущий автосалон премиальных автомобилей в Москве. 
              15 лет успешной работы, более 10,000 довольных клиентов 
              и безупречная репутация на рынке.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Icon name="MapPin" size={16} className="text-primary" />
                <span className="text-sm">Москва, ул. Примерная, 123</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Phone" size={16} className="text-primary" />
                <span className="text-sm">+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={16} className="text-primary" />
                <span className="text-sm">info@autopremium.ru</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Clock" size={16} className="text-primary" />
                <span className="text-sm">Ежедневно с 9:00 до 21:00</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.href} 
                      className="text-gray-400 hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links and Additional Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  <Icon name={social.icon} size={20} />
                </a>
              ))}
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Пользовательское соглашение
              </Link>
              <Link to="/sitemap" className="hover:text-primary transition-colors">
                Карта сайта
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} AutoPremium. Все права защищены.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Лицензия дилера № 123456</span>
              <span>•</span>
              <span>ИНН 7701234567</span>
              <span>•</span>
              <span>ОГРН 1027700123456</span>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-wrap justify-center items-center space-x-8 space-y-4">
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={16} className="text-primary" />
              <span className="text-xs text-gray-400">Официальный дилер BMW</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-primary" />
              <span className="text-xs text-gray-400">Авторизованный партнер Audi</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-primary" />
              <span className="text-xs text-gray-400">Сертифицированный дилер Mercedes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Star" size={16} className="text-primary" />
              <span className="text-xs text-gray-400">ISO 9001:2015</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;