import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, Car, Brand, Category, Service, News, Review, Contact, Appointment } from '@/lib/api';

// Cars hooks
export const useCars = (params?: Parameters<typeof apiClient.getCars>[0]) => {
  return useQuery({
    queryKey: ['cars', params],
    queryFn: () => apiClient.getCars(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCar = (id: string) => {
  return useQuery({
    queryKey: ['car', id],
    queryFn: () => apiClient.getCarById(id),
    enabled: !!id,
  });
};

export const usePopularCars = () => {
  return useQuery({
    queryKey: ['cars', 'popular'],
    queryFn: () => apiClient.getPopularCars(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSimilarCars = (id: string) => {
  return useQuery({
    queryKey: ['cars', 'similar', id],
    queryFn: () => apiClient.getSimilarCars(id),
    enabled: !!id,
  });
};

// Brands hooks
export const useBrands = (isActive = true) => {
  return useQuery({
    queryKey: ['brands', isActive],
    queryFn: () => apiClient.getBrands(isActive),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useBrand = (id: string) => {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: () => apiClient.getBrandById(id),
    enabled: !!id,
  });
};

// Categories hooks
export const useCategories = (isActive = true) => {
  return useQuery({
    queryKey: ['categories', isActive],
    queryFn: () => apiClient.getCategories(isActive),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => apiClient.getCategoryById(id),
    enabled: !!id,
  });
};

// Services hooks
export const useServices = (params?: Parameters<typeof apiClient.getServices>[0]) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => apiClient.getServices(params),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => apiClient.getServiceById(id),
    enabled: !!id,
  });
};

// News hooks
export const useNews = (params?: Parameters<typeof apiClient.getNews>[0]) => {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => apiClient.getNews(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useNewsItem = (id: string) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => apiClient.getNewsById(id),
    enabled: !!id,
  });
};

// Reviews hooks
export const useReviews = (params?: Parameters<typeof apiClient.getReviews>[0]) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => apiClient.getReviews(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReview = (id: string) => {
  return useQuery({
    queryKey: ['review', id],
    queryFn: () => apiClient.getReviewById(id),
    enabled: !!id,
  });
};

// Mutations
export const useCreateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Contact) => apiClient.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Appointment) => apiClient.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Appointments hooks
export const useAppointments = (params?: Parameters<typeof apiClient.getAppointments>[0]) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => apiClient.getAppointments(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};