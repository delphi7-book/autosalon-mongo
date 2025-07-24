import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateContact } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Contacts = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    time: ''
  });

  const createContactMutation = useCreateContact();

  const departments = [
    {
      name: 'Отдел продаж',
      phone: '+7 (495) 123-45-67',
      email: 'sales@autopremium.ru',
      hours: 'Пн-Вс: 9:00-21:00',
      description: 'Консультации по покупке автомобилей'
    },
    {
      name: 'Сервисный центр',
      phone: '+7 (495) 123-45-68',
      email: 'service@autopremium.ru',
      hours: 'Пн-Пт: 8:00-20:00, Сб: 9:00-18:00',
      description: 'Запись на техническое обслуживание'
    },
    {
      name: 'Отдел Trade-in',
      phone: '+7 (495) 123-45-69',
      email: 'tradein@autopremium.ru',
      hours: 'Пн-Сб: 10:00-19:00',
      description: 'Оценка и обмен автомобилей'
    },
    {
      name: 'Финансовый отдел',
      phone: '+7 (495) 123-45-70',
      email: 'finance@autopremium.ru',
      hours: 'Пн-Пт: 9:00-18:00',
      description: 'Кредитование и страхование'
    }
  ];

  const locations = [
    {
      name: 'Главный офис',
      address: 'Москва, ул. Примерная, 123',
      phone: '+7 (495) 123-45-67',
      hours: 'Пн-Вс: 9:00-21:00',
      services: ['Продажа автомобилей', 'Сервисное обслуживание', 'Trade-in', 'Кредитование'],
      coordinates: { lat: 55.7558, lng: 37.6176 }
    },
    {
      name: 'Филиал на Севере',
      address: 'Москва, Северный проезд, 45',
      phone: '+7 (495) 123-45-71',
      hours: 'Пн-Сб: 10:00-20:00',
      services: ['Продажа автомобилей', 'Trade-in'],
      coordinates: { lat: 55.8558, lng: 37.6176 }
    },
    {
      name: 'Сервисный центр',
      address: 'Москва, ул. Автомобильная, 78',
      phone: '+7 (495) 123-45-72',
      hours: 'Пн-Пт: 8:00-20:00',
      services: ['Сервисное обслуживание', 'Диагностика', 'Кузовной ремонт'],
      coordinates: { lat: 55.6558, lng: 37.6176 }
    }
  ];

  const team = [
    {
      name: 'Александр Иванов',
      position: 'Директор по продажам',
      phone: '+7 (495) 123-45-67',
      email: 'a.ivanov@autopremium.ru',
      experience: '12 лет в автомобильной индустрии'
    },
    {
      name: 'Елена Петрова',
      position: 'Менеджер по работе с клиентами',
      phone: '+7 (495) 123-45-73',
      email: 'e.petrova@autopremium.ru',
      experience: '8 лет в сфере продаж'
    },
    {
      name: 'Михаил Сидоров',
      position: 'Руководитель сервисного центра',
      phone: '+7 (495) 123-45-68',
      email: 'm.sidorov@autopremium.ru',
      experience: '15 лет в автосервисе'
    },
    {
      name: 'Анна Козлова',
      position: 'Специалист по Trade-in',
      phone: '+7 (495) 123-45-69',
      email: 'a.kozlova@autopremium.ru',
      experience: '6 лет в оценке автомобилей'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createContactMutation.mutate({
      name: contactForm.name,
      phone: contactForm.phone,
      email: contactForm.email,
      subject: contactForm.subject,
      message: contactForm.message,
      source: 'website',
      customerType: 'new'
    }, {
      onSuccess: () => {
        toast({
          title: "Сообщение отправлено",
          description: "Мы ответим вам в ближайшее время",
        });
        setContactForm({
          name: '',
          phone: '',
          email: '',
          subject: '',
          message: ''
        });
      },
      onError: () => {
        toast({
          title: "Ошибка",
          description: "Не удалось отправить сообщение. Попробуйте еще раз.",
          variant: "destructive",
        });
      }
    });
    // Здесь была бы отправка формы
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createContactMutation.mutate({
      name: callbackForm.name,
      phone: callbackForm.phone,
      subject: 'Заказ обратного звонка',
      message: `Прошу перезвонить в удобное время: ${callbackForm.time}`,
      source: 'website',
      customerType: 'new'
    }, {
      onSuccess: () => {
        toast({
          title: "Заявка принята",
          description: "Мы перезвоним вам в указанное время",
        });
        setCallbackForm({
          name: '',
          phone: '',
          time: ''
        });
      },
      onError: () => {
        toast({
          title: "Ошибка",
          description: "Не удалось отправить заявку. Попробуйте еще раз.",
          variant: "destructive",
        });
      }
    });
    // Здесь была бы отправка формы
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Контакты</h1>
          <p className="text-xl opacity-90">Свяжитесь с нами любым удобным способом</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="contacts">Контакты</TabsTrigger>
            <TabsTrigger value="locations">Адреса</TabsTrigger>
            <TabsTrigger value="team">Команда</TabsTrigger>
            <TabsTrigger value="feedback">Обратная связь</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Main Contact Info */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="Phone" size={20} className="mr-2" />
                      Основные контакты
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Главный офис</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Icon name="MapPin" size={16} className="text-primary" />
                            <span>Москва, ул. Примерная, 123</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Icon name="Phone" size={16} className="text-primary" />
                            <span>+7 (495) 123-45-67</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Icon name="Mail" size={16} className="text-primary" />
                            <span>info@autopremium.ru</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Icon name="Clock" size={16} className="text-primary" />
                            <span>Пн-Вс: 9:00-21:00</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Экстренная связь</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Icon name="Phone" size={16} className="text-red-600" />
                            <span>+7 (495) 123-45-99 (24/7)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Icon name="MessageCircle" size={16} className="text-green-600" />
                            <span>WhatsApp: +7 (999) 123-45-67</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Icon name="Send" size={16} className="text-blue-600" />
                            <span>Telegram: @autopremium</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Departments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Отделы и специалисты</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {departments.map((dept, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{dept.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <Icon name="Phone" size={14} className="text-primary" />
                              <span>{dept.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Icon name="Mail" size={14} className="text-primary" />
                              <span>{dept.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Icon name="Clock" size={14} className="text-primary" />
                              <span>{dept.hours}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Contact */}
              <div>
                <div className="sticky top-4 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Заказать звонок</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCallbackSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Имя *</label>
                          <Input
                            required
                            value={callbackForm.name}
                            onChange={(e) => setCallbackForm({...callbackForm, name: e.target.value})}
                            placeholder="Ваше имя"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Телефон *</label>
                          <Input
                            required
                            type="tel"
                            value={callbackForm.phone}
                            onChange={(e) => setCallbackForm({...callbackForm, phone: e.target.value})}
                            placeholder="+7 (999) 123-45-67"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Удобное время</label>
                          <Select value={callbackForm.time} onValueChange={(value) => setCallbackForm({...callbackForm, time: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите время" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="now">Сейчас</SelectItem>
                              <SelectItem value="morning">Утром (9:00-12:00)</SelectItem>
                              <SelectItem value="afternoon">Днем (12:00-15:00)</SelectItem>
                              <SelectItem value="evening">Вечером (15:00-18:00)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                          <Icon name="Phone" size={16} className="mr-2" />
                          Заказать звонок
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Социальные сети</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <a href="#" className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Icon name="Facebook" size={20} className="text-blue-600" />
                          <span>Facebook</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Icon name="Instagram" size={20} className="text-pink-600" />
                          <span>Instagram</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Icon name="Youtube" size={20} className="text-red-600" />
                          <span>YouTube</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Icon name="MessageCircle" size={20} className="text-green-600" />
                          <span>WhatsApp</span>
                        </a>
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
                          <span className="font-medium">9:00 - 21:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Суббота:</span>
                          <span className="font-medium">10:00 - 20:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Воскресенье:</span>
                          <span className="font-medium">10:00 - 19:00</span>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between">
                            <span>Сервисный центр:</span>
                            <span className="font-medium">8:00 - 20:00</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="locations">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {locations.map((location, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="MapPin" size={20} className="mr-2 text-primary" />
                      {location.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="font-medium mb-1">Адрес:</div>
                        <div className="text-sm text-gray-600">{location.address}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Телефон:</div>
                        <div className="text-sm text-gray-600">{location.phone}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Режим работы:</div>
                        <div className="text-sm text-gray-600">{location.hours}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-2">Услуги:</div>
                        <div className="flex flex-wrap gap-1">
                          {location.services.map((service, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-3">
                        <Button variant="outline" className="w-full">
                          <Icon name="Navigation" size={16} className="mr-2" />
                          Построить маршрут
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map placeholder */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Наши адреса на карте</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Icon name="Map" size={48} className="mx-auto mb-2" />
                    <p>Интерактивная карта с нашими адресами</p>
                  </div>
                  <Button 
                    type="submit" 
                    {createContactMutation.isPending ? 'Отправка...' : 'Отправить сообщение'}
                    disabled={createContactMutation.isPending}
                  >
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Icon name="User" size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                    <p className="text-gray-600 mb-3">{member.position}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <Icon name="Phone" size={14} className="text-primary" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Icon name="Mail" size={14} className="text-primary" />
                        <span className="text-xs">{member.email}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">{member.experience}</p>
                    </div>
                    <Button variant="outline" className="w-full mt-3" size="sm">
                      Связаться
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="MessageSquare" size={20} className="mr-2" />
                    Написать нам
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label className="text-sm font-medium mb-1 block">Тема обращения</label>
                      <Select value={contactForm.subject} onValueChange={(value) => setContactForm({...contactForm, subject: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тему" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Покупка автомобиля</SelectItem>
                          <SelectItem value="service">Сервисное обслуживание</SelectItem>
                          <SelectItem value="tradein">Trade-in</SelectItem>
                          <SelectItem value="finance">Кредитование</SelectItem>
                          <SelectItem value="insurance">Страхование</SelectItem>
                          <SelectItem value="complaint">Жалоба</SelectItem>
                          <SelectItem value="suggestion">Предложение</SelectItem>
                          <SelectItem value="other">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Сообщение *</label>
                      <Textarea
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        placeholder="Опишите ваш вопрос или предложение..."
                        rows={5}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={createContactMutation.isPending}
                    >
                      <Icon name="Send" size={16} className="mr-2" />
                      {createContactMutation.isPending ? 'Отправка...' : 'Заказать звонок'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Часто задаваемые вопросы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          question: 'Как записаться на тест-драйв?',
                          answer: 'Вы можете записаться через сайт, по телефону или лично в салоне'
                        },
                        {
                          question: 'Какие документы нужны для покупки?',
                          answer: 'Паспорт, водительское удостоверение и справка о доходах для кредита'
                        },
                        {
                          question: 'Есть ли гарантия на автомобили?',
                          answer: 'Да, на все новые автомобили действует официальная гарантия производителя'
                        },
                        {
                          question: 'Можно ли оформить кредит в салоне?',
                          answer: 'Да, мы работаем с ведущими банками и поможем оформить кредит'
                        }
                      ].map((faq, index) => (
                        <div key={index} className="border-b pb-3">
                          <div className="font-medium mb-1">{faq.question}</div>
                          <div className="text-sm text-gray-600">{faq.answer}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Время ответа</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Телефонный звонок:</span>
                        <span className="font-medium">Сразу</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>WhatsApp/Telegram:</span>
                        <span className="font-medium">5-10 минут</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Email:</span>
                        <span className="font-medium">1-2 часа</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Форма обратной связи:</span>
                        <span className="font-medium">30 минут</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Качество обслуживания</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Средняя оценка:</span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon key={star} name="Star" size={16} className="text-yellow-500 fill-current" />
                          ))}
                          <span className="text-sm font-medium ml-2">4.9</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Основано на 1,247 отзывах клиентов
                      </div>
                      <Button variant="outline" className="w-full" size="sm">
                        Оставить отзыв
                      </Button>
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

export default Contacts;