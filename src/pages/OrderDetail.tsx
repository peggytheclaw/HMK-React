import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Mail, Lock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ordersData from '@/data/orders.json';
import productsData from '@/data/products.json';
import { Order, OrderStatus } from '@/types';
import { format } from 'date-fns';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const order = ordersData.find(o => o.orderNumber === id) as Order;
  const product = order ? productsData.find(p => p.itemNumber === order.itemNumber) : null;

  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order not found</h1>
        <Link to="/orders">
          <Button className="mt-4">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const getStatusInfo = (status: OrderStatus) => {
    const info = {
      [OrderStatus.Processing]: { 
        color: 'yellow', 
        label: 'Processing',
        icon: Lock 
      },
      [OrderStatus.Available]: { 
        color: 'green', 
        label: 'Available',
        icon: CheckCircle 
      },
      [OrderStatus.NotAvailable]: { 
        color: 'red', 
        label: 'Not Available',
        icon: XCircle 
      },
    };
    return info[status as keyof typeof info] || info[OrderStatus.Processing];
  };

  const statusInfo = getStatusInfo(order.orderStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Order {order.orderNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Created {format(new Date(order.createDate), 'PPpp')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Ticket
          </Button>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email Order
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className={`border-${statusInfo.color}-500 border-2`}>
        <CardContent className="flex items-center gap-4">
          <div className={`p-4 bg-${statusInfo.color}-100 dark:bg-${statusInfo.color}-900 rounded-lg`}>
            <StatusIcon className={`w-8 h-8 text-${statusInfo.color}-600 dark:text-${statusInfo.color}-300`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Status: {statusInfo.label}
            </h3>
            {order.isLocked && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Locked by {order.lockedByName}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Info */}
        {product && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product</h2>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {product.itemNumber} • {product.color}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Size: <span className="font-medium">{order.size}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Customer</h2>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-400">Name</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{order.customerName}</dd>
              </div>
              {order.isInternetOrder && (
                <div>
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Internet Order #</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{order.internetOrderNumber}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order Details</h2>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-400">Order Number</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</dd>
              </div>
              {order.autoTransferNumber && (
                <div>
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Transfer Number</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{order.autoTransferNumber}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-400">Created By</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{order.createdByName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-400">Create Date</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {format(new Date(order.createDate), 'PPpp')}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Store Info */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Store Transfer</h2>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-400">From Store</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  Store #{order.storeFromId}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-400">To Store</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  Store #{order.storeToId}
                </dd>
              </div>
              {order.barcode && (
                <div>
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Barcode</dt>
                  <dd className="font-mono font-medium text-gray-900 dark:text-white">
                    {order.barcode}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Mark as Available</Button>
            <Button variant="secondary">Mark as Not Available</Button>
            <Button variant="outline">Reorder</Button>
            <Button variant="danger">Cancel Order</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
