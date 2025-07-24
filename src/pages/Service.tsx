import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useServices, useCreateAppointment } from '@/hooks/useApi';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Service = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    carModel: '',
    year: '',
    vin: '',
    mileage: '',
    description: ''
  });

  const { data: servicesData, isLoading: servicesLoading } = useServices({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    isActive: true
  });
  const createAppointmentMutation = useCreateAppointment();

  const services = servicesData || [];
  const categories = [...new Set(services.map(service => service.category))];

  // Группировка услуг по категориям
  const groupedServices = categories.reduce((acc, category) => {
    acc[category] = services.filter(service => service.category === category);
    return acc;
  }, {} as Record<string, typeof services>);

  const specialists = [
    {
      name: 'Михаил Иванов',
      position: 'Главный механик',
      experience: '15 лет',
      specialization: 'BMW, Mercedes',
      rating: 4.9,
      image: '/placeholder.svg'
    },
    {
      name: 'Алексей Петров',
      position: 'Мастер-диагност',
      experience: '12 лет',
      specialization: 'Audi, Volkswagen',
      rating: 4.8,
      image: '/placeholder.svg'
    },
    {
      name: 'Сергей Сидоров',
      position: 'Кузовщик',
      experience: '10 лет',
      specialization: 'Кузовной ремонт',
      rating: 4.9,
      image: '/placeholder.svg'
    }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedServiceData = services.find(s => s.name === selectedService);
    
    createAppointmentMutation.mutate({
      type: 'service',
      service: selectedServiceData?._id,
      date: new Date().toISOString().split('T')[0], // Сегодняшняя дата как заглушка
      time: '10:00', // Время по умолчанию
      customerInfo: {
        name: bookingForm.name,
        phone: bookingForm.phone,
        email: bookingForm.email
      },
      carInfo: {
        brand: bookingForm.carModel.split(' ')[0],
        model: bookingForm.carModel,
        year: bookingForm.year ? parseInt(bookingForm.year) : undefined,
        vin: bookingForm.vin,
        mileage: bookingForm.mileage ? parseInt(bookingForm.mileage) : undefined,
        issues: bookingForm.description
      },
      notes: bookingForm.description
    }, {
      onSuccess: () => {
        toast({
          title: "Запись создана",
          description: "Мы свяжемся с вами для подтверждения времени",
        });
        setBookingForm({
          name: '',
          phone: '',
          email: '',
          carModel: '',
          year: '',
          vin: '',
          mileage: '',
          description: ''
        });
      },
      onError: () => {
        toast({
          title: "Ошибка",
          description: "Не удалось создать запись. Попробуйте еще раз.",
          variant: "destructive",
        });
      }
    });
  };

  const BookingForm = () => (
    <form onSubmit={handleBookingSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Имя *</label>
          <Input
            required
            value={bookingForm.name}
            onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
            placeholder="Ваше имя"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Телефон *</label>
          <Input
            required
            type="tel"
            value={bookingForm.phone}
            onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Email</label>
        <Input
          type="email"
          value={bookingForm.email}
          onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
          placeholder="your@email.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Модель автомобиля *</label>
          <Input
            required
            value={bookingForm.carModel}
            onChange={(e) => setBookingForm({...bookingForm, carModel: e.target.value})}
            placeholder="BMW 3 Series"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Год выпуска</label>
          <Input
            value={bookingForm.year}
            onChange={(e) => setBookingForm({...bookingForm, year: e.target.value})}
            placeholder="2020"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">VIN номер</label>
          <Input
            value={bookingForm.vin}
            onChange={(e) => setBookingForm({...bookingForm, vin: e.target.value})}
            placeholder="WBAVA31070NL12345"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Пробег</label>
          <Input
            value={bookingForm.mileage}
            onChange={(e) => setBookingForm({...bookingForm, mileage: e.target.value})}
            placeholder="50000"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Описание проблемы</label>
        <Textarea
          value={bookingForm.description}
          onChange={(e) => setBookingForm({...bookingForm, description: e.target.value})}
          placeholder="Опишите проблему или желаемые работы..."
          rows={3}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90"
        disabled={createAppointmentMutation.isPending}
      >
        {createAppointmentMutation.isPending ? 'Отправка...' : 'Записаться на сервис'}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Сервисное обслуживание</h1>
          <p className="text-xl opacity-90">Профессиональный ремонт и обслуживание автомобилей</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="services">Услуги</TabsTrigger>
            <TabsTrigger value="specialists">Специалисты</TabsTrigger>
            <TabsTrigger value="equipment">Оборудование</TabsTrigger>
            <TabsTrigger value="warranty">Гарантия</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Category Filter */}
                <div className="mb-6">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {servicesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-6 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(groupedServices).map(([category, categoryServices]) => (
                      <div key={category}>
                        <h2 className="text-2xl font-bold text-secondary mb-6">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categoryServices.map((service) => (
                            <Card key={service._id} className="hover:shadow-lg transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg">{service.name}</CardTitle>
                                  <Badge variant="outline">
                                    от {formatPrice(service.price.from)} ₽
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Icon name="Clock" size={14} className="mr-1" />
                                    {service.duration}
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        onClick={() => setSelectedService(service.name)}
                                      >
                                        Записаться
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Запись на сервис: {service.name}</DialogTitle>
                                      </DialogHeader>
                                      <BookingForm />
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="sticky top-4 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Экспресс-запись</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Тип услуги</label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите услугу" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Телефон</label>
                          <Input placeholder="+7 (999) 123-45-67" />
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          <Icon name="Phone" size={16} className="mr-2" />
                          Заказать звонок
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Режим работы</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Понедельник - Пятница:</span>
                          <span>8:00 - 20:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Суббота:</span>
                          <span>9:00 - 18:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Воскресенье:</span>
                          <span>10:00 - 16:00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Преимущества</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          'Оригинальные запчасти',
                          'Гарантия на работы',
                          'Современное оборудование',
                          'Сертифицированные мастера',
                          'Прозрачное ценообразование'
                        ].map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Icon name="Check" size={16} className="text-green-600" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specialists">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialists.map((specialist, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Icon name="User" size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{specialist.name}</h3>
                    <p className="text-gray-600 mb-1">{specialist.position}</p>
                    <p className="text-sm text-gray-500 mb-2">Опыт: {specialist.experience}</p>
                    <Badge variant="outline" className="mb-3">{specialist.specialization}</Badge>
                    <div className="flex items-center justify-center space-x-1 mb-4">
                      <Icon name="Star" size={16} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{specialist.rating}</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Записаться к мастеру
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="equipment">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Диагностическое оборудование',
                  description: 'Современные сканеры для всех марок автомобилей',
                  features: ['Bosch KTS', 'Launch X431', 'Autel MaxiSys']
                },
                {
                  name: 'Подъемники и стенды',
                  description: 'Профессиональные подъемники для безопасной работы',
                  features: ['4-стоечные подъемники', 'Ножничные подъемники', 'Стенды развал-схождения']
                },
                {
                  name: 'Покрасочная камера',
                  description: 'Современная покрасочная камера с системой фильтрации',
                  features: ['Контроль температуры', 'Система вентиляции', 'LED освещение']
                },
                {
                  name: 'Сварочное оборудование',
                  description: 'Профессиональное сварочное оборудование',
                  features: ['Споттер', 'Полуавтомат', 'Аргонная сварка']
                },
                {
                  name: 'Шиномонтаж',
                  description: 'Современное оборудование для работы с шинами',
                  features: ['Автоматические станки', 'Балансировочные стенды', 'Азотная накачка']
                },
                {
                  name: 'Инструменты',
                  description: 'Профессиональный инструмент ведущих производителей',
                  features: ['Snap-on', 'Gedore', 'Hazet']
                }
              ].map((equipment, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{equipment.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{equipment.description}</p>
                    <div className="space-y-2">
                      {equipment.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Icon name="Check" size={14} className="text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="warranty">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Гарантийные обязательства</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">На выполненные работы:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Техническое обслуживание - 6 месяцев</li>
                        <li>• Ремонт двигателя - 12 месяцев</li>
                        <li>• Кузовной ремонт - 24 месяца</li>
                        <li>• Покрасочные работы - 36 месяцев</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">На установленные запчасти:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Оригинальные запчасти - согласно гарантии производителя</li>
                        <li>• Неоригинальные запчасти - 12 месяцев</li>
                        <li>• Расходные материалы - 6 месяцев</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">Условия гарантии:</h5>
                      <ul className="space-y-1 text-sm text-blue-800">
                        <li>• Соблюдение регламента ТО</li>
                        <li>• Использование рекомендованных материалов</li>
                        <li>• Сохранение гарантийного талона</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Что не покрывается гарантией</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <Icon name="X" size={14} className="text-red-600 mt-0.5" />
                        <span>Механические повреждения в результате ДТП</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Icon name="X" size={14} className="text-red-600 mt-0.5" />
                        <span>Естественный износ деталей</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Icon name="X" size={14} className="text-red-600 mt-0.5" />
                        <span>Повреждения от неправильной эксплуатации</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Icon name="X" size={14} className="text-red-600 mt-0.5" />
                        <span>Самостоятельное вмешательство в ремонт</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Icon name="X" size={14} className="text-red-600 mt-0.5" />
                        <span>Использование неоригинальных запчастей</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Как воспользоваться гарантией</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <div className="font-medium">Обратитесь в сервис</div>
                          <div className="text-sm text-gray-600">Свяжитесь с нами по телефону или приезжайте лично</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <div className="font-medium">Предоставьте документы</div>
                          <div className="text-sm text-gray-600">Гарантийный талон и документы на автомобиль</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <div className="font-medium">Диагностика</div>
                          <div className="text-sm text-gray-600">Мы проведем диагностику и определим причину</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                          <div className="font-medium">Устранение</div>
                          <div className="text-sm text-gray-600">Бесплатное устранение гарантийного случая</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Service;