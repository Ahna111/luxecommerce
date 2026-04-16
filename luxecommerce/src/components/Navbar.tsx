import { ShoppingBag, Menu, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Cart from "./Cart";
import { CartItem } from "../types";

interface NavbarProps {
  cartItems: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function Navbar({ cartItems, onRemoveFromCart, onUpdateQuantity }: NavbarProps) {
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-bottom bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">LUXE</span>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="transition-colors hover:text-primary">Shop</a>
          <a href="#" className="transition-colors hover:text-primary">Collections</a>
          <a href="#" className="transition-colors hover:text-primary">About</a>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
              </SheetHeader>
              <Cart 
                items={cartItems} 
                onRemove={onRemoveFromCart} 
                onUpdateQuantity={onUpdateQuantity} 
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
