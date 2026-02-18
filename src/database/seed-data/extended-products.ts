import { ProductCategory } from '../../modules/products/schemas/products.schema';

export interface ExtendedProductSeed {
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  stockQuantity: number;
  discountPercentage: number;
  description?: string;
  sizes?: string[];
  colors?: string[];
}

export const EXTENDED_PRODUCTS_SEED: ExtendedProductSeed[] = [
  {
    name: 'Royal Elegance Dress',
    price: 249.99,
    image:
      'https://images.unsplash.com/photo-1764265149077-b9b0dde8970b?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 15,
    discountPercentage: 0,
  },
  {
    name: 'Heritage Print Collection',
    price: 189.99,
    image:
      'https://images.unsplash.com/photo-1709281961493-a9acb8558177?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 8,
    discountPercentage: 15,
  },
  {
    name: 'Ankara Maxi Dress',
    price: 299.99,
    image:
      'https://images.unsplash.com/photo-1768212566108-4ce4f329e4d2?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 5,
    discountPercentage: 0,
  },
  {
    name: 'Elegant Evening Gown',
    price: 349.99,
    image:
      'https://images.unsplash.com/photo-1764593827518-8a5e4275e884?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 7,
    discountPercentage: 0,
  },
  {
    name: 'Traditional Kente Wrap',
    price: 179.99,
    image:
      'https://images.unsplash.com/photo-1763823133159-c6f8ec380e33?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 12,
    discountPercentage: 20,
  },
  {
    name: 'Silk Kaftan Gown',
    price: 279.99,
    image:
      'https://images.unsplash.com/photo-1697924293303-34488b60bf36?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 10,
    discountPercentage: 10,
  },
  {
    name: 'Modern Dashiki Dress',
    price: 159.99,
    image:
      'https://images.unsplash.com/photo-1709809081557-78f803ce93a0?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 18,
    discountPercentage: 0,
  },
  {
    name: 'Printed Midi Skirt',
    price: 129.99,
    image:
      'https://images.unsplash.com/photo-1767962270264-173be593095b?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 22,
    discountPercentage: 5,
  },
  {
    name: 'Embroidered Tunic',
    price: 139.99,
    image:
      'https://images.unsplash.com/photo-1765229276796-c93c73cc3f3b?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 14,
    discountPercentage: 0,
  },
  {
    name: 'Beaded Cocktail Dress',
    price: 319.99,
    image:
      'https://images.unsplash.com/photo-1697924293303-34488b60bf36?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 6,
    discountPercentage: 25,
  },
  {
    name: 'Flowing Maxi Skirt',
    price: 99.99,
    image:
      'https://images.unsplash.com/photo-1764265149077-b9b0dde8970b?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 20,
    discountPercentage: 0,
  },
  {
    name: 'Peplum Top & Skirt Set',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1768212566108-4ce4f329e4d2?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 11,
    discountPercentage: 15,
  },
  {
    name: 'Batik Wrap Dress',
    price: 169.99,
    image:
      'https://images.unsplash.com/photo-1709809081557-78f803ce93a0?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 0,
    discountPercentage: 0,
  },
  {
    name: 'Sequined Party Dress',
    price: 289.99,
    image:
      'https://images.unsplash.com/photo-1764593827518-8a5e4275e884?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 9,
    discountPercentage: 10,
  },
  {
    name: 'Cape Sleeve Gown',
    price: 329.99,
    image:
      'https://images.unsplash.com/photo-1765229276796-c93c73cc3f3b?w=1080',
    category: ProductCategory.FEMALE,
    stockQuantity: 7,
    discountPercentage: 0,
  },
  {
    name: 'Executive Suit',
    price: 459.99,
    image:
      'https://images.unsplash.com/photo-1686628101951-ce2bd65ab579?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 12,
    discountPercentage: 10,
  },
  {
    name: 'Casual Smart Shirt',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1630494693052-5bef2683bcaa?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 0,
    discountPercentage: 0,
  },
  {
    name: 'Traditional Agbada Set',
    price: 399.99,
    image:
      'https://images.unsplash.com/photo-1686628101951-ce2bd65ab579?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 8,
    discountPercentage: 20,
  },
  {
    name: 'Dashiki Shirt',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1657405592096-0eb9199a8634?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 25,
    discountPercentage: 0,
  },
  {
    name: 'Modern Kaftan',
    price: 149.99,
    image:
      'https://images.unsplash.com/photo-1630494693052-5bef2683bcaa?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 15,
    discountPercentage: 5,
  },
  {
    name: 'Formal Blazer',
    price: 279.99,
    image:
      'https://images.unsplash.com/photo-1686628101951-ce2bd65ab579?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 10,
    discountPercentage: 15,
  },
  {
    name: 'Printed Casual Shirt',
    price: 69.99,
    image:
      'https://images.unsplash.com/photo-1657405592096-0eb9199a8634?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 30,
    discountPercentage: 0,
  },
  {
    name: 'Senator Suit',
    price: 349.99,
    image:
      'https://images.unsplash.com/photo-1630494693052-5bef2683bcaa?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 6,
    discountPercentage: 10,
  },
  {
    name: 'Linen Trouser Set',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1686628101951-ce2bd65ab579?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 18,
    discountPercentage: 0,
  },
  {
    name: 'Embroidered Tunic',
    price: 119.99,
    image:
      'https://images.unsplash.com/photo-1657405592096-0eb9199a8634?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 14,
    discountPercentage: 0,
  },
  {
    name: 'Polo Shirt Set',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1630494693052-5bef2683bcaa?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 22,
    discountPercentage: 0,
  },
  {
    name: 'Formal Waistcoat',
    price: 169.99,
    image:
      'https://images.unsplash.com/photo-1686628101951-ce2bd65ab579?w=1080',
    category: ProductCategory.MALE,
    stockQuantity: 12,
    discountPercentage: 5,
  },
  {
    name: 'Kids Festival Outfit',
    price: 129.99,
    image:
      'https://images.unsplash.com/photo-1717454284403-a88a7f26c91b?w=1080',
    category: ProductCategory.KIDS,
    stockQuantity: 20,
    discountPercentage: 0,
  },
  {
    name: 'Colorful Dashiki Set',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1628360983286-f01b2cdcbe2d?w=1080',
    category: ProductCategory.KIDS,
    stockQuantity: 25,
    discountPercentage: 10,
  },
  {
    name: 'Traditional Dress',
    price: 99.99,
    image:
      'https://images.unsplash.com/photo-1717454284403-a88a7f26c91b?w=1080',
    category: ProductCategory.KIDS,
    stockQuantity: 18,
    discountPercentage: 0,
  },
  {
    name: 'Boys Agbada Mini',
    price: 119.99,
    image:
      'https://images.unsplash.com/photo-1628360983286-f01b2cdcbe2d?w=1080',
    category: ProductCategory.KIDS,
    stockQuantity: 15,
    discountPercentage: 15,
  },
  {
    name: 'Girls Party Dress',
    price: 139.99,
    image:
      'https://images.unsplash.com/photo-1717454284403-a88a7f26c91b?w=1080',
    category: ProductCategory.KIDS,
    stockQuantity: 12,
    discountPercentage: 0,
  },
  {
    name: 'Ankara Shorts Set',
    price: 59.99,
    image:
      'https://images.unsplash.com/photo-1628360983286-f01b2cdcbe2d?w=1080',
    category: ProductCategory.KIDS,
    stockQuantity: 30,
    discountPercentage: 5,
  },
  {
    name: 'Formal Kids Suit',
    price: 149.99,
    image:
      'https://images.unsplash.com/photo-1717454284403-a88a7f26c91b?w=1080',
    category: ProductCategory.KIDS,
    stockQuantity: 10,
    discountPercentage: 0,
  },
  {
    name: 'Casual T-Shirt & Pants',
    price: 69.99,
    image:
      'https://images.unsplash.com/photo-1628360983286-f01b2cdcbe2d?w=1080',
    category: ProductCategory.KIDS,
    stockQuantity: 28,
    discountPercentage: 0,
  },
  {
    name: 'Gold Jewelry Set',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1767249630751-5d8f13cfdb04?w=1080',
    category: ProductCategory.GENERAL,
    stockQuantity: 25,
    discountPercentage: 5,
  },
  {
    name: 'Beaded Necklace',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1769116416641-e714b71851e8?w=1080',
    category: ProductCategory.GENERAL,
    stockQuantity: 40,
    discountPercentage: 0,
  },
  {
    name: 'Luxury Handbag',
    price: 249.99,
    image:
      'https://images.unsplash.com/photo-1709281961493-a9acb8558177?w=1080',
    category: ProductCategory.GENERAL,
    stockQuantity: 8,
    discountPercentage: 20,
  },
  {
    name: 'Traditional Headwrap',
    price: 39.99,
    image:
      'https://images.unsplash.com/photo-1768212566108-4ce4f329e4d2?w=1080',
    category: ProductCategory.GENERAL,
    stockQuantity: 50,
    discountPercentage: 0,
  },
  {
    name: 'Leather Sandals',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1709281961493-a9acb8558177?w=1080',
    category: ProductCategory.GENERAL,
    stockQuantity: 35,
    discountPercentage: 10,
  },
  {
    name: 'Ankara Face Mask Set',
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1768212566108-4ce4f329e4d2?w=1080',
    category: ProductCategory.GENERAL,
    stockQuantity: 100,
    discountPercentage: 15,
  },
  {
    name: 'Embroidered Clutch',
    price: 119.99,
    image:
      'https://images.unsplash.com/photo-1709281961493-a9acb8558177?w=1080',
    category: ProductCategory.GENERAL,
    stockQuantity: 18,
    discountPercentage: 0,
  },
  {
    name: 'Gold-plated Bangles',
    price: 149.99,
    image:
      'https://images.unsplash.com/photo-1767249630751-5d8f13cfdb04?w=1080',
    category: ProductCategory.GENERAL,
    stockQuantity: 22,
    discountPercentage: 5,
  },
  {
    name: 'Woven Basket Bag',
    price: 69.99,
    image:
      'https://images.unsplash.com/photo-1709281961493-a9acb8558177?w=1080',
    category: ProductCategory.GENERAL,
    stockQuantity: 30,
    discountPercentage: 0,
  },
  {
    name: 'Silk Scarf Collection',
    price: 59.99,
    image:
      'https://images.unsplash.com/photo-1768212566108-4ce4f329e4d2?w=1080',
    category: ProductCategory.GENERAL,
    stockQuantity: 45,
    discountPercentage: 10,
  },
];
