import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, List, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import productsData from '@/data/products.json';
import { Product } from '@/types';

export default function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');

  const vendors = useMemo(() => {
    const vendorSet = new Set(productsData.map(p => p.vendor));
    return ['all', ...Array.from(vendorSet)];
  }, []);

  const filteredProducts = useMemo(() => {
    return (productsData as Product[]).filter(product => {
      const matchesSearch = 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.color.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVendor = selectedVendor === 'all' || product.vendor === selectedVendor;
      
      return matchesSearch && matchesVendor;
    });
  }, [searchTerm, selectedVendor]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Product Catalog
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse and search {productsData.length} products
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Vendor Filter */}
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {vendors.map(vendor => (
                <option key={vendor} value={vendor}>
                  {vendor === 'all' ? 'All Vendors' : vendor}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p>Showing {filteredProducts.length} products</p>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.itemNumber} product={product} viewMode={viewMode} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProductCard({ product, viewMode }: { product: Product; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <Link to={`/products/${product.itemNumber}`}>
        <Card hover>
          <CardContent className="flex items-center gap-6">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {product.itemNumber} • {product.color}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {product.shortDescription}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.localOnHand} in stock
              </p>
              {product.markdown && (
                <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-xs font-medium">
                  <Tag className="w-3 h-3 inline mr-1" />
                  Markdown
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/products/${product.itemNumber}`}>
      <Card hover className="h-full">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <CardContent>
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {product.itemNumber} • {product.color}
            </p>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 line-clamp-2">
            {product.shortDescription}
          </p>
          
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {product.localOnHand} in stock
            </p>
          </div>
          
          {product.markdown && (
            <div className="mt-3">
              <span className="inline-block px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-xs font-medium">
                <Tag className="w-3 h-3 inline mr-1" />
                Markdown
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
