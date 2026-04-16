import { CartItem } from "../types";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function Cart({ items, onRemove, onUpdateQuantity }: CartProps) {
  const [loading, setLoading] = useState(false);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const { url, error } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        console.error("Checkout error:", error);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <Trash2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 py-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-destructive"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="pt-6 space-y-4">
        <Separator />
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            className="w-full gap-2" 
            size="lg" 
            onClick={handleStripeCheckout}
            disabled={loading}
          >
            <CreditCard className="h-4 w-4" />
            Checkout with Stripe
          </Button>

          <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test" }}>
            <PayPalButtons 
              style={{ layout: "horizontal", height: 44 }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [{
                    amount: {
                      currency_code: "USD",
                      value: total.toFixed(2),
                    },
                  }],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order!.capture().then((details) => {
                  alert(`Transaction completed by ${details.payer.name?.given_name}`);
                });
              }}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}
