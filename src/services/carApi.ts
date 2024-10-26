import { toast } from 'react-hot-toast';
import { CarMake, CarModel } from '../types/car';

const BASE_URL = 'https://www.carqueryapi.com/api/0.3/';

// Helper function to handle JSONP responses
const jsonp = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_' + Math.round(100000 * Math.random());
    const script = document.createElement('script');
    
    // Create the callback function
    (window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      resolve(data);
    };

    script.src = `${url}${url.includes('?') ? '&' : '?'}callback=${callbackName}`;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

export const carApi = {
  async getMakes(): Promise<CarMake[]> {
    try {
      const data = await jsonp(`${BASE_URL}?cmd=getMakes`);
      return data.Makes.map((make: any) => ({
        make_id: make.make_id,
        make_display: make.make_display,
        make_is_common: make.make_is_common,
        make_country: make.make_country
      }));
    } catch (error) {
      console.error('Error fetching car makes:', error);
      toast.error('Failed to load car makes');
      return [];
    }
  },

  async getModels(make: string): Promise<CarModel[]> {
    try {
      const data = await jsonp(`${BASE_URL}?cmd=getModels&make=${encodeURIComponent(make)}`);
      return data.Models.map((model: any) => ({
        model_name: model.model_name,
        model_make_id: model.model_make_id
      }));
    } catch (error) {
      console.error('Error fetching car models:', error);
      toast.error('Failed to load car models');
      return [];
    }
  }
};