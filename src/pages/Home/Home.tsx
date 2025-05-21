import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import slider1 from "@/assets/images/sliders/slider1.png";
import slider2 from "@/assets/images/sliders/slider2.png";
import slider3 from "@/assets/images/sliders/slider3.png";
import slider4 from "@/assets/images/sliders/slider4.png";
import slider5 from "@/assets/images/sliders/slider5.png";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/apis/product.api";
import { sortBy } from "@/constants/sortBy";
import ProductCard from "@/components/dev/ProductCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { path } from "@/constants/path";

const images = [
  {
    src: slider1,
  },
  {
    src: slider2,
  },
  {
    src: slider3,
  },
  {
    src: slider4,
  },
  {
    src: slider5,
  },
] as const;

export default function Home() {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      getProducts({
        sortBy: sortBy.sold,
        order: "desc",
      }),
  });
  return (
    <div>
      <div className="flex items-center justify-center bg-background text-foreground">
        <Carousel className="w-full h-full relative">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  src={image.src}
                  alt="slider"
                  className="w-full h-full object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2" />
        </Carousel>
      </div>
      <div className="container mx-auto py-8">
        <p className="text-primary my-4 text-2xl font-bold text-center">
          Các món bán chạy nhất
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products?.data.data.content.slice(0, 5).map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <ProductCard product={product} isBestSeller />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center mb-6">
        <Link to={path.menu}>
          <Button size="lg">Xem thực đơn</Button>
        </Link>
      </div>
    </div>
  );
}
