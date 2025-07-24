import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePopularCars, useNews } from '@/hooks/useApi';
import { formatPrice, getImageUrl } from '@/lib/utils';
import Icon from '@/components/ui/icon';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: popularCarsData, isLoading: carsLoading } = usePopularCars();
  const { data: newsData, isLoading: newsLoading } = useNews({ limit: 3, status: 'published' });

  const featuredCars = popularCarsData?.slice(0, 3) || [];
  const latestNews = newsData?.news || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Найдите автомобиль своей мечты</h1>
          <p className="text-xl mb-8 opacity-90">Более 500 премиальных автомобилей в наличии</p>
          
          {/* Quick Search */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex gap-4">
              <Input
                placeholder="Поиск по модели..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Link to={`/catalog${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`}>
                <Button className="bg-primary hover:bg-primary/90">
                  <Icon name="Search" size={16} className="mr-2" />
                  Найти
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Рекомендуемые автомобили</h2>
            <p className="text-gray-600 text-lg">Лучшие предложения этого месяца</p>
          </div>

          {carsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <Card key={car._id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getImageUrl(car.images[0])} 
                      alt={car.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {car.isHit && <Badge className="bg-primary">Хит продаж</Badge>}
                      {car.isNew && <Badge className="bg-green-600">Новый</Badge>}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-secondary">{car.name}</CardTitle>
                    <div className="text-2xl font-bold text-primary">{formatPrice(car.price)} ₽</div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Icon name="Calendar" size={14} className="mr-2" />
                        {car.year} год
                      </div>
                      <div className="flex items-center">
                        <Icon name="Zap" size={14} className="mr-2" />
                        {car.fuel}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {car.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {car.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{car.features.length - 2}
                        </Badge>
                      )}
                    </div>

                    <Link to={`/car/${car._id}`}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Подробнее
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/catalog">
              <Button variant="outline" size="lg">
                Посмотреть все автомобили
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Последние новости</h2>
            <p className="text-gray-600 text-lg">Будьте в курсе всех событий AutoPremium</p>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((article) => (
                <Card key={article._id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getImageUrl(article.featuredImage)} 
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary">
                      {article.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{new Date(article.publishDate).toLocaleDateString('ru-RU')}</span>
                      <div className="flex items-center space-x-2">
                        <Icon name="Eye" size={14} />
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Читать далее
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Наши услуги</h2>
            <p className="text-gray-600 text-lg">Полный спектр автомобильных услуг</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'ShoppingCart', title: 'Продажа авто', description: 'Широкий выбор новых и подержанных автомобилей', link: '/catalog' },
              { icon: 'CreditCard', title: 'Кредит и лизинг', description: 'Выгодные условия финансирования', link: '/financing' },
              { icon: 'Shield', title: 'Страхование', description: 'КАСКО и ОСАГО на лучших условиях', link: '/insurance' },
              { icon: 'Wrench', title: 'Сервисное обслуживание', description: 'Профессиональный ремонт и ТО', link: '/service' }
            ].map((service, index) => (
              <Link key={index} to={service.link}>
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name={service.icon} size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Автомобилей в наличии' },
              { number: '15+', label: 'Лет на рынке' },
              { number: '10000+', label: 'Довольных клиентов' },
              { number: '98%', label: 'Положительных отзывов' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-secondary mb-4">Готовы найти свой автомобиль?</h2>
          <p className="text-gray-600 text-lg mb-8">Свяжитесь с нами для персональной консультации</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contacts">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Icon name="Phone" size={16} className="mr-2" />
                Связаться с нами
              </Button>
            </Link>
            <Link to="/test-drive">
              <Button size="lg" variant="outline">
                <Icon name="Car" size={16} className="mr-2" />
                Записаться на тест-драйв
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;