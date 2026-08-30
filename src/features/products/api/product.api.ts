import type { Product, ProductMetrics } from '../types/product.types';

// Import chính xác 5 file ảnh từ thư mục assets/products/
import wheyImg from '../../../assets/products/whey.jpg';
import gangTayImg from '../../../assets/products/gang-tay-tap-gym.jpg';
import khanImg from '../../../assets/products/khan.jpg';
import monsterImg from '../../../assets/products/monster.jpg';
import nuocSuoiImg from '../../../assets/products/nuoc-suoi.jpg';

const STORAGE_KEY = 'gym_products';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    productCode: 'PROD001',
    name: 'WHEY PROTEIN 2KG',
    category: 'Thực phẩm bổ sung',
    price: 1500000,
    costPrice: 1100000,
    stock: 15,
    unit: 'Hũ',
    image: wheyImg,
    isDeleted: false,
  },
  {
    id: '2',
    productCode: 'PROD002',
    name: 'GĂNG TAY TẬP GYM',
    category: 'Phụ kiện',
    price: 250000,
    costPrice: 180000,
    stock: 20,
    unit: 'Đôi',
    image: gangTayImg,
    isDeleted: false,
  },
  {
    id: '3',
    productCode: 'PROD003',
    name: 'NƯỚC TĂNG LỰC MONSTER',
    category: 'Nước uống',
    price: 35000,
    costPrice: 24000,
    stock: 45,
    unit: 'Lon',
    image: monsterImg,
    isDeleted: false,
  },
  {
    id: '4',
    productCode: 'PROD004',
    name: 'NƯỚC SUỐI AQUAFINA',
    category: 'Nước uống',
    price: 10000,
    costPrice: 5000,
    stock: 100,
    unit: 'Chai',
    image: nuocSuoiImg,
    isDeleted: false,
  },
  {
    id: '5',
    productCode: 'PROD005',
    name: 'KHĂN LAU MỒ HÔI',
    category: 'Phụ kiện',
    price: 50000,
    costPrice: 30000,
    stock: 35,
    unit: 'Cái',
    image: khanImg,
    isDeleted: false,
  },
];

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    const local = localStorage.getItem(STORAGE_KEY);
    if (!local) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(local);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveLocalProducts: (products: Product[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  },

  calculateMetrics: (products: Product[]): ProductMetrics => {
    const activeProducts = products.filter((p) => !p.isDeleted);
    const totalStock = activeProducts.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = activeProducts.filter((p) => p.stock <= 5).length;
    
    return {
      totalProducts: activeProducts.length,
      totalStock,
      lowStockCount,
      categoriesCount: 4,
    };
  },
};