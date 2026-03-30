import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

const UserCart = () => {
  const { items } = useCartStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Your Cart</h2>
        <p className="text-muted-foreground text-sm mt-1">Review items in your shopping cart</p>
      </div>

      {items.length === 0 ? (
        <Card className="border-border shadow-sm">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag size={24} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm mb-4">Your cart is empty</p>
              <Link to="/shop">
                <Button size="sm" className="gap-2">
                  <ShoppingBag size={14} />
                  Browse Shop
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.variantId} className="border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.product.node.images.edges[0] && (
                      <img
                        src={item.product.node.images.edges[0].node.url}
                        alt={item.product.node.title}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{item.product.node.title}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-primary font-semibold">
                    {item.price.currencyCode} {(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="pt-2">
            <Link to="/shop">
              <Button variant="outline" className="gap-2">
                <ShoppingBag size={14} />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCart;
