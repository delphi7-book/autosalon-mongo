import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useCars, useBrands, useCategories } from '@/hooks/useApi';
import { formatPrice, getImageUrl } from '@/lib/utils';
import Icon from '@/components/ui/icon';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortBy, setSortBy] = useState('price-asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Инициализация фильтров из URL
  useEffect(() => {
    const search = searchParams.get('search');
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    if (search) setSearchTerm(search);
    if (brand) setSelectedBrand(brand);
    if (category) setSelectedType(category);
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 10000000
      ]);
    }
  }, [searchParams]);

  // Загрузка данных
  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();
  
  const carsParams = {
    page: currentPage,
    limit: 12,
    ...(searchTerm && { search: searchTerm }),
    ...(selectedBrand !== 'all' && { brand: selectedBrand }),
    ...(selectedType !== 'all' && { bodyType: selectedType }),
    ...(priceRange[0] > 0 && { minPrice: priceRange[0] }),
    ...(priceRange[1] < 10000000 && { maxPrice: priceRange[1] }),
    sortBy: sortBy.split('-')[0],
    sortOrder: sortBy.split('-')[1]
  };
  
  const { data: carsData, isLoading: carsLoading } = useCars(carsParams);

  const brands = brandsData || [];
  const categories = categoriesData || [];
  const cars = carsData?.cars || [];
  const totalPages = carsData?.totalPages || 1;
  const total = carsData?.total || 0;

  // Обновление URL при изменении фильтров
  const updateFilters = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedBrand !== 'all') params.set('brand', selectedBrand);
    if (selectedType !== 'all') params.set('category', selectedType);
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 10000000) params.set('maxPrice', priceRange[1].toString());
    
    setSearchParams(params);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timeoutId = setTimeout(updateFilters, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedBrand, selectedType, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Каталог автомобилей</h1>
          <p className="text-xl opacity-90">Найдите идеальный автомобиль из нашего обширного каталога</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Filter" size={20} className="mr-2" />
                  Фильтры
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Поиск</label>
                  <Input
                    placeholder="Модель автомобиля..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Марка</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите марку" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все марки</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand._id} value={brand._id}>{brand.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Тип кузова</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все типы</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category._id} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Цена: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])} ₽
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000000}
                    min={0}
                    step={100000}
                    className="mt-2"
                  />
                </div>

                {/* Reset Filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedBrand('all');
                    setSelectedType('all');
                    setPriceRange([0, 10000000]);
                  }}
                >
                  Сбросить фильтры
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-secondary">
                  Найдено {total} автомобилей
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Сортировать:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">По цене (возрастание)</SelectItem>
                    <SelectItem value="price-desc">По цене (убывание)</SelectItem>
                    <SelectItem value="year-desc">По году (новые)</SelectItem>
                    <SelectItem value="name-asc">По названию (А-Я)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cars Grid */}
            {carsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
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
            ) : cars.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Автомобили не найдены</h3>
                <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <Card key={car._id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img 
                        src={getImageUrl(car.images[0])} 
                        alt={car.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {car.isNew && <Badge className="bg-green-600">Новый</Badge>}
                        {car.isHit && <Badge className="bg-primary">Хит</Badge>}
                        {car.availability === 'В наличии' && <Badge className="bg-blue-600">В наличии</Badge>}
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-secondary">{car.name}</CardTitle>
                      <div className="text-2xl font-bold text-primary">{formatPrice(car.price)} ₽</div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Icon name="Calendar" size={14} className="mr-1" />
                          {car.year}
                        </div>
                        <div className="flex items-center">
                          <Icon name="Zap" size={14} className="mr-1" />
                          {car.fuel}
                        </div>
                        <div className="flex items-center">
                          <Icon name="Settings" size={14} className="mr-1" />
                          {car.transmission}
                        </div>
                        <div className="flex items-center">
                          <Icon name="Activity" size={14} className="mr-1" />
                          {car.mileage.toLocaleString()} км
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
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

                      <div className="flex gap-2">
                        <Link to={`/car/${car._id}`} className="flex-1">
                          <Button className="w-full bg-primary hover:bg-primary/90">
                            Подробнее
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon">
                          <Icon name="Heart" size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <Icon name="ChevronLeft" size={16} className="mr-2" />
                  Назад
                </Button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Вперед
                  <Icon name="ChevronRight" size={16} className="ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;