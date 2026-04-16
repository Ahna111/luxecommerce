import { Product } from "../types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start mb-1">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              {product.category}
            </Badge>
            <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
          </div>
          <CardTitle className="text-lg font-semibold line-clamp-1">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={() => onAddToCart(product)} 
            className="w-full gap-2"
            variant="default"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
