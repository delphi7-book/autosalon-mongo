const API_BASE_URL = 'http://localhost:5000/api';

// Типы данных
export interface Brand {
  _id: string;
  name: string;
  logo: string;
  description: string;
  country: string;
  founded: number;
  website?: string;
  isActive: boolean;
  models: Array<{
    name: string;
    category: string;
    priceRange: {
      min: number;
      max: number;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Car {
  _id: string;
  name: string;
  brand: Brand;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  bodyType: string;
  drive: string;
  engine: {
    volume: number;
    power: number;
    type: string;
  };
  color: string;
  vin: string;
  images: string[];
  features: string[];
  description: string;
  condition: string;
  availability: string;
  category: Category;
  specifications: {
    dimensions: {
      length: number;
      width: number;
      height: number;
      wheelbase: number;
    };
    weight: number;
    fuelTank: number;
    trunkVolume: number;
    doors: number;
    seats: number;
    maxSpeed: number;
    acceleration: number;
    consumption: number;
  };
  isHit: boolean;
  isNew: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: {
    from: number;
    to?: number;
  };
  duration: string;
  isActive: boolean;
  requirements: string[];
  includes: string[];
  excludes?: string[];
  warranty: {
    period: string;
    description: string;
  };
  applicableBrands: string[];
  difficulty: string;
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

export interface News {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  featuredImage: string;
  images: string[];
  status: string;
  publishDate: string;
  views: number;
  likes: number;
  shares: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  relatedCars: Car[];
  isSticky: boolean;
  commentsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  car?: Car;
  service?: Service;
  order?: string;
  type: string;
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  images: string[];
  isVerified: boolean;
  isPublished: boolean;
  helpful: number;
  responses: Array<{
    author: {
      _id: string;
      name: string;
      role: string;
    };
    text: string;
    date: string;
    isOfficial: boolean;
  }>;
  moderationStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source?: string;
  relatedCar?: string;
  customerType?: string;
}

export interface Appointment {
  user?: string;
  type: string;
  car?: string;
  service?: string;
  date: string;
  time: string;
  duration?: number;
  notes?: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    drivingExperience?: string;
  };
  carInfo?: {
    brand?: string;
    model?: string;
    year?: number;
    vin?: string;
    mileage?: number;
    issues?: string;
  };
}

// API функции
class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Cars
  async getCars(params?: {
    page?: number;
    limit?: number;
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
    fuel?: string;
    transmission?: string;
    bodyType?: string;
    condition?: string;
    availability?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      cars: Car[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/cars?${searchParams.toString()}`);
  }

  async getCarById(id: string) {
    return this.request<Car>(`/cars/${id}`);
  }

  async getPopularCars() {
    return this.request<Car[]>('/cars/popular');
  }

  async getSimilarCars(id: string) {
    return this.request<Car[]>(`/cars/${id}/similar`);
  }

  // Brands
  async getBrands(isActive = true) {
    const params = isActive !== undefined ? `?isActive=${isActive}` : '';
    return this.request<Brand[]>(`/brands${params}`);
  }

  async getBrandById(id: string) {
    return this.request<Brand>(`/brands/${id}`);
  }

  // Categories
  async getCategories(isActive = true) {
    const params = isActive !== undefined ? `?isActive=${isActive}` : '';
    return this.request<Category[]>(`/categories${params}`);
  }

  async getCategoryById(id: string) {
    return this.request<Category>(`/categories/${id}`);
  }

  // Services
  async getServices(params?: { category?: string; isActive?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<Service[]>(`/services?${searchParams.toString()}`);
  }

  async getServiceById(id: string) {
    return this.request<Service>(`/services/${id}`);
  }

  // News
  async getNews(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    author?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      news: News[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/news?${searchParams.toString()}`);
  }

  async getNewsById(id: string) {
    return this.request<News>(`/news/${id}`);
  }

  // Reviews
  async getReviews(params?: {
    page?: number;
    limit?: number;
    type?: string;
    car?: string;
    service?: string;
    rating?: number;
    isPublished?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      reviews: Review[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/reviews?${searchParams.toString()}`);
  }

  async getReviewById(id: string) {
    return this.request<Review>(`/reviews/${id}`);
  }

  // Contacts
  async createContact(data: Contact) {
    return this.request<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Appointments
  async createAppointment(data: Appointment) {
    return this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAppointments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    date?: string;
    user?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      appointments: Appointment[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/appointments?${searchParams.toString()}`);
  }
}

export const apiClient = new ApiClient();