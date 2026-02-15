import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Store, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import productsData from '@/data/products.json';
import { Product } from '@/types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = productsData.find(p => p.itemNumber === id) as Product;

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product not found</h1>
        <Link to="/products">
          <Button className="mt-4">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <Card>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-[500px] object-cover rounded-lg"
          />
        </Card>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {product.itemNumber} • {product.styleNumber}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.longName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {product.shortDescription}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </p>
            {product.markdown && (
              <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium">
                On Sale
              </span>
            )}
          </div>

          {/* Product Info */}
          <Card>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Color</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{product.color}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Quarter</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{product.quarter}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Gender</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{product.gender || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Vendor</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{product.vendor}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 dark:text-white">Available Sizes</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    disabled={!size.available}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                      size.available
                        ? 'border-primary-500 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900'
                        : 'border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                Inventory Levels
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Company-wide</span>
                  <span className="font-bold text-gray-900 dark:text-white">{product.companyOnHand} units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Local Store</span>
                  <span className="font-bold text-gray-900 dark:text-white">{product.localOnHand} units</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Inventory */}
          {product.inventory.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Store Availability
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {product.inventory.map((inv) => (
                    <div key={`${inv.storeNumber}-${inv.size}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Store #{inv.storeNumber}</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-3">Size {inv.size}</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{inv.quantity} units</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Link to="/orders/new" className="flex-1">
              <Button className="w-full">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Create Order
              </Button>
            </Link>
            <Button variant="outline">
              Print Label
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Related Products</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.relatedProducts.map((relatedId) => {
                const related = productsData.find(p => p.itemNumber === relatedId);
                if (!related) return null;
                
                return (
                  <Link key={relatedId} to={`/products/${relatedId}`}>
                    <Card hover>
                      <img
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <CardContent>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {related.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{related.color}</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                          ${related.price.toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
