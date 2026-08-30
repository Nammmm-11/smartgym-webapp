import React, { useState, useEffect } from 'react';
import { ProductMetricCards } from '../components/ProductMetricCards';
import { ProductFilterBar } from '../components/ProductFilterBar';
import { ProductCardRow } from '../components/ProductCardRow';
import { CreateProductModal } from '../components/CreateProductModal';
import { EditProductModal } from '../components/EditProductModal';
import { productApi, INITIAL_PRODUCTS } from '../api/product.api';
import type { Product, ProductFilterType } from '../types/product.types';
import { FiBox } from 'react-icons/fi';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ProductFilterType>('ALL');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Tải dữ liệu ban đầu từ API / LocalStorage
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productApi.getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
      }
    };
    loadProducts();
  }, []);

  // Cập nhật danh sách state và lưu trữ đồng thời
  const updateProductsList = (newList: Product[]) => {
    setProducts(newList);
    productApi.saveLocalProducts(newList);
  };

  const metrics = productApi.calculateMetrics(products);
  const trashCount = products.filter((p) => p.isDeleted).length;

  // Lọc danh sách sản phẩm theo tab trạng thái/danh mục và từ khóa tìm kiếm
  const filteredProducts = products.filter((product) => {
    if (activeFilter === 'TRASH') {
      if (!product.isDeleted) return false;
    } else {
      if (product.isDeleted) return false;
      if (activeFilter !== 'ALL' && product.category !== activeFilter) return false;
    }
    
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      return (
        product.name.toLowerCase().includes(q) || 
        product.productCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Thêm sản phẩm mới
  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'productCode' | 'isDeleted'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: Date.now().toString(),
      productCode: `PROD${String(products.length + 1).padStart(3, '0')}`,
      isDeleted: false,
    };
    updateProductsList([newProduct, ...products]);
  };

  // Cập nhật sản phẩm
  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    updateProductsList(updated);
    setEditingProduct(null);
  };

  // Chuyển sản phẩm vào thùng rác (Soft Delete)
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Bạn có chắc muốn chuyển sản phẩm này vào thùng rác?')) {
      const updated = products.map((p: Product) => (p.id === id ? { ...p, isDeleted: true } : p));
      updateProductsList(updated);
    }
  };

  // Khôi phục sản phẩm từ thùng rác
  const handleRestoreProduct = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, isDeleted: false } : p));
    updateProductsList(updated);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#050505] text-white">
      {/* Header */}
      <div className="relative z-30 px-8 py-5 border-b border-[#141414] bg-[#070707] flex justify-between items-center flex-shrink-0">
        <div>
          <span className="text-[10px] text-gray-500 font-mono tracking-[0.25em] uppercase">
            FIT.GYM // INVENTORY SYSTEM
          </span>
          <h1 className="text-2xl lg:text-3xl font-black italic tracking-wide uppercase m-0 mt-1 text-white">
            QUẢN LÝ SẢN PHẨM & KHO
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 flex flex-col gap-6 flex-grow overflow-y-auto">
        {/* Thẻ thống kê */}
        <ProductMetricCards metrics={metrics} />

        {/* Thanh tìm kiếm và bộ lọc */}
        <ProductFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          metrics={metrics}
          trashCount={trashCount}
          onAddClick={() => setIsCreateOpen(true)}
        />

        {/* Danh sách sản phẩm dạng Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full bg-[#080808] border border-dashed border-[#1c1c1c] rounded-3xl p-16 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#121212] flex items-center justify-center text-gray-600 mb-3">
                <FiBox size={28} />
              </div>
              <p className="text-xs font-mono text-gray-500 tracking-widest uppercase m-0">
                KHÔNG TÌM THẤY SẢN PHẨM NÀO
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCardRow
                key={product.id}
                product={product}
                onEdit={(p) => setEditingProduct(p)}
                onDelete={handleDeleteProduct}
                onRestore={handleRestoreProduct}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateProductModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={handleAddProduct} 
      />
      
      <EditProductModal 
        isOpen={!!editingProduct} 
        product={editingProduct} 
        onClose={() => setEditingProduct(null)} 
        onSubmit={handleUpdateProduct} 
      />
    </div>
  );
};