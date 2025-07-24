import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCar, useSimilarCars, useCreateContact } from '@/hooks/useApi';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const CarDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const { data: car, isLoading: carLoading, error } = useCar(id || '');
  const { data: similarCars } = useSimilarCars(id || '');
  const createContactMutation = useCreateContact();

  useEffect(() => {
    if (car && car.images.length > 0) {
      setSelectedImage(0);
    }
  }, [car]);

  if (carLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Автомобиль не найден</h2>
          <p className="text-gray-600 mb-4">Возможно, автомобиль был продан или снят с продажи</p>
          <Link to="/catalog">
            <Button>Вернуться к каталогу</Button>
          </Link>
        </div>
      </div>
    );
  }

  const ContactForm = () => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      createContactMutation.mutate({
        name: contactForm.name,
        phone: contactForm.phone,
        email: contactForm.email,
        subject: 'Покупка автомобиля',
        message: contactForm.message || `Интересует автомобиль: ${car.name}`,
        source: 'website',
        relatedCar: car._id,
        customerType: 'new'
      }, {
        onSuccess: () => {
          toast({
            title: "Заявка отправлена",
            description: "Наш менеджер свяжется с вами в ближайшее время",
          });
          setContactForm({ name: '', phone: '', email: '', message: '' });
        },
        onError: () => {
          toast({
            title: "Ошибка",
            description: "Не удалось отправить заявку. Попробуйте еще раз.",
            variant: "destructive",
          });
        }
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Имя *</label>
          <Input
            required
            value={contactForm.name}
            onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
            placeholder="Ваше имя"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Телефон *</label>
          <Input
            required
            type="tel"
            value={contactForm.phone}
            onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <Input
            type="email"
            value={contactForm.email}
            onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Сообщение</label>
          <Textarea
            value={contactForm.message}
            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
            placeholder="Дополнительная информация..."
            rows={3}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={createContactMutation.isPending}
        >
          {createContactMutation.isPending ? 'Отправка...' : 'Отправить заявку'}
          Отправить заявку
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Главная</Link>
            <Icon name="ChevronRight" size={14} />
            <Link to="/catalog" className="hover:text-primary">Каталог</Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-gray-900">{car.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Main Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative mb-4">
                <img 
                  src={getImageUrl(car.images[selectedImage])} 
                  alt={car.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {car.condition === 'Новый' && <Badge className="bg-green-600">Новый</Badge>}
                  {car.availability === 'В наличии' && <Badge className="bg-primary">В наличии</Badge>}
                  {car.isHit && <Badge className="bg-orange-600">Хит продаж</Badge>}
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img src={getImageUrl(image)} alt={`${car.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Details Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="specs">Характеристики</TabsTrigger>
                <TabsTrigger value="equipment">Комплектация</TabsTrigger>
                <TabsTrigger value="documents">Документы</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Описание</h3>
                  <p className="text-gray-600 leading-relaxed">{car.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Icon name="Zap" size={24} className="text-primary mx-auto mb-2" />
                    <div className="font-semibold">{car.engine.volume}L {car.engine.type}</div>
                    <div className="text-sm text-gray-600">{car.engine.power} л.с.</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Icon name="Activity" size={24} className="text-primary mx-auto mb-2" />
                    <div className="font-semibold">0-100 км/ч</div>
                    <div className="text-sm text-gray-600">{car.specifications.acceleration} сек</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Icon name="Gauge" size={24} className="text-primary mx-auto mb-2" />
                    <div className="font-semibold">Расход</div>
                    <div className="text-sm text-gray-600">{car.specifications.consumption} л/100км</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Icon name="Settings" size={24} className="text-primary mx-auto mb-2" />
                    <div className="font-semibold">{car.drive}</div>
                    <div className="text-sm text-gray-600">{car.transmission}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="specs" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-secondary">Двигатель и трансмиссия</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Двигатель:</span>
                        <span>{car.engine.volume}L {car.engine.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Мощность:</span>
                        <span>{car.engine.power} л.с.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Привод:</span>
                        <span>{car.drive}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">КПП:</span>
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Макс. скорость:</span>
                        <span>{car.specifications.maxSpeed} км/ч</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Разгон 0-100:</span>
                        <span>{car.specifications.acceleration} сек</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-secondary">Габариты и вес</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Размеры:</span>
                        <span>{car.specifications.dimensions.length}×{car.specifications.dimensions.width}×{car.specifications.dimensions.height} мм</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Колесная база:</span>
                        <span>{car.specifications.dimensions.wheelbase} мм</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Багажник:</span>
                        <span>{car.specifications.trunkVolume} л</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Масса:</span>
                        <span>{car.specifications.weight} кг</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Топливный бак:</span>
                        <span>{car.specifications.fuelTank} л</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Количество дверей:</span>
                        <span>{car.specifications.doors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Количество мест:</span>
                        <span>{car.specifications.seats}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="equipment" className="space-y-6 mt-6">
                <div>
                  <h4 className="font-semibold mb-3 text-secondary">Комплектация и опции</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon name="Check" size={16} className="text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-secondary">Основные характеристики</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Тип кузова:</span>
                        <span>{car.bodyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Цвет:</span>
                        <span>{car.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Состояние:</span>
                        <span>{car.condition}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Пробег:</span>
                        <span>{car.mileage.toLocaleString()} км</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Просмотры:</span>
                        <span>{car.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Наличие:</span>
                        <span>{car.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-6 mt-6">
                <div>
                  <h4 className="font-semibold mb-4 text-secondary">Документы и информация</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">VIN номер</h5>
                      <p className="text-sm text-gray-600 font-mono">{car.vin}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Год выпуска</h5>
                      <p className="text-sm text-gray-600">{car.year}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Цвет</h5>
                      <p className="text-sm text-gray-600">{car.color}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Пробег</h5>
                      <p className="text-sm text-gray-600">{car.mileage.toLocaleString()} км</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h5 className="font-medium mb-3">Доступные документы</h5>
                    <div className="space-y-2">
                      {[
                        'Паспорт транспортного средства (ПТС)',
                        'Свидетельство о регистрации ТС (СТС)',
                        'Сервисная книжка',
                        'Договор купли-продажи',
                        'Справка о ДТП'
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Icon name="FileText" size={16} className="text-primary" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Доступен
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Price and Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-secondary">{car.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{formatPrice(car.price)} ₽</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Год:</span>
                      <div className="font-medium">{car.year}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Пробег:</span>
                      <div className="font-medium">{car.mileage.toLocaleString()} км</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Топливо:</span>
                      <div className="font-medium">{car.fuel}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">КПП:</span>
                      <div className="font-medium">{car.transmission}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          <Icon name="Phone" size={16} className="mr-2" />
                          Связаться с менеджером
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Связаться с менеджером</DialogTitle>
                        </DialogHeader>
                        <ContactForm />
                      </DialogContent>
                    </Dialog>

                    <Link to="/test-drive">
                      <Button variant="outline" className="w-full">
                        <Icon name="Car" size={16} className="mr-2" />
                        Записаться на тест-драйв
                      </Button>
                    </Link>

                    <Link to="/financing">
                      <Button variant="outline" className="w-full">
                        <Icon name="Calculator" size={16} className="mr-2" />
                        Рассчитать кредит
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Manager Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ваш менеджер</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Алексей Петров</div>
                      <div className="text-sm text-gray-600">Старший менеджер</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" size={14} className="text-gray-400" />
                      <span>+7 (495) 123-45-67</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Mail" size={14} className="text-gray-400" />
                      <span>a.petrov@autopremium.ru</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Дополнительные услуги</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/trade-in" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Icon name="RefreshCw" size={16} className="text-primary" />
                      <span className="text-sm">Trade-in</span>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-gray-400" />
                  </Link>
                  <Link to="/insurance" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Icon name="Shield" size={16} className="text-primary" />
                      <span className="text-sm">Страхование</span>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-gray-400" />
                  </Link>
                  <Link to="/warranty" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Icon name="Award" size={16} className="text-primary" />
                      <span className="text-sm">Гарантия</span>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-gray-400" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Similar Cars */}
        {similarCars && similarCars.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-secondary mb-8">Похожие автомобили</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCars.slice(0, 3).map((similarCar) => (
                <Card key={similarCar._id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getImageUrl(similarCar.images[0])} 
                      alt={similarCar.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {similarCar.isHit && <Badge className="absolute top-4 right-4 bg-primary">Хит</Badge>}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{similarCar.name}</CardTitle>
                    <div className="text-xl font-bold text-primary">{formatPrice(similarCar.price)} ₽</div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Icon name="Calendar" size={14} className="mr-1" />
                        {similarCar.year}
                      </div>
                      <div className="flex items-center">
                        <Icon name="Activity" size={14} className="mr-1" />
                        {similarCar.mileage.toLocaleString()} км
                      </div>
                    </div>
                    <Link to={`/car/${similarCar._id}`}>
                      <Button className="w-full">Подробнее</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CarDetail;