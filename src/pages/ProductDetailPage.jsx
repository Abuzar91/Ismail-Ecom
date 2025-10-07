import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowLeft,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
    checkWishlistStatus();
  }, [id]);

  const checkWishlistStatus = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.includes(id));
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data.product);

      // Fetch related products
      if (response.data.product?.category) {
        const relatedResponse = await axios.get(
          `/api/products?category=${response.data.product.category}&limit=4`
        );
        setRelatedProducts(
          relatedResponse.data.products.filter((p) => p._id !== id) || []
        );
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} ${product.name}(s) added to cart!`);
  };

  const handleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isWishlisted) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(productId => productId !== id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
      toast.success('Removed from wishlist');
    } else {
      // Add to wishlist
      wishlist.push(id);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
      toast.success('Added to wishlist ❤️');
    }
  };

  const handleShare = async () => {
    const productUrl = window.location.href;
    const shareData = {
      title: product.name,
      text: `Check out this luxury fragrance: ${product.name}`,
      url: productUrl
    };

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Product shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Fallback to copy link
          copyToClipboard(productUrl);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      copyToClipboard(productUrl);
    }
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          toast.success('Product link copied to clipboard!');
        })
        .catch(() => {
          // Fallback method
          fallbackCopyToClipboard(text);
        });
    } else {
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      toast.success('Product link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
    
    document.body.removeChild(textArea);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleImageChange = (index) => {
    setImageLoading(true);
    setSelectedImage(index);
    setTimeout(() => setImageLoading(false), 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading product..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-luxury-pearl mb-4">
            Product not found
          </h2>
          <Link to="/products" className="text-luxury-gold hover:text-yellow-400">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const defaultImages = [
    "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800",
  ];

  const productImages =
    product.images?.length > 0
      ? product.images.map((img) => img.url || img)
      : defaultImages;

  return (
    <>
      <Helmet>
        <title>{product?.name ? `${product.name} | Noir Essence Luxury Perfume` : 'Product Details | Noir Essence'}</title>
        <meta name="description" content={product?.description || 'Luxury perfume from Noir Essence. Exquisite fragrances crafted for sophistication.'} />
        <meta name="keywords" content={`${product?.name || 'luxury perfume'}, ${product?.category || 'fragrance'}, designer perfume, exclusive scents, luxury fragrance`} />
        <meta property="og:title" content={product?.name || 'Premium Skincare Product'} />
        <meta property="og:description" content={product?.description || 'Premium skincare product from Sitara'} />
        <meta property="og:image" content={product?.images?.[0]?.url || ''} />
        <meta property="og:type" content="product" />
        {product?.price && <meta property="product:price:amount" content={product.price} />}
        {product?.price && <meta property="product:price:currency" content="PKR" />}
      </Helmet>
      <div className="min-h-screen bg-luxury-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-luxury-gold">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-luxury-gold">
            Products
          </Link>
          <span>/</span>
          <span className="text-luxury-pearl">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 text-luxury-gold hover:text-yellow-400 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="aspect-square rounded-sm overflow-hidden shadow-2xl relative bg-luxury-charcoal border border-luxury-gold/20"
            >
              {imageLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <LoadingSpinner minimal />
                </div>
              )}
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-200"
                onLoad={() => setImageLoading(false)}
              />
              
              {/* Image Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageChange(selectedImage > 0 ? selectedImage - 1 : productImages.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-luxury-gold/20 backdrop-blur-sm hover:bg-luxury-gold/40 rounded-sm p-2 shadow-lg transition-all duration-200"
                  >
                    <ArrowLeft size={20} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleImageChange(selectedImage < productImages.length - 1 ? selectedImage + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-luxury-gold/20 backdrop-blur-sm hover:bg-luxury-gold/40 rounded-sm p-2 shadow-lg transition-all duration-200"
                  >
                    <ArrowRight size={20} className="text-gray-700" />
                  </button>
                </>
              )}
              
              {/* Image Indicators */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        selectedImage === index ? 'bg-luxury-gold' : 'bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {productImages.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-luxury-gold shadow-lg"
                        : "border-luxury-gold/20 hover:border-luxury-gold/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-serif font-bold text-luxury-pearl mb-4">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-serif font-bold text-luxury-gold">
                  Rs. {product.price?.toLocaleString()}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      Rs. {product.originalPrice?.toLocaleString()}
                    </span>
                  )}
                {product.discount > 0 && (
                  <span className="bg-luxury-gold/20 text-luxury-gold px-3 py-1 rounded-sm text-sm font-medium">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-luxury-pearl mb-2">
                  Description
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Fragrance Notes */}
              {product.fragranceNotes && (
                <div className="mb-6 bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-6">
                  <h3 className="text-lg font-semibold text-luxury-pearl mb-4">
                    Fragrance Notes
                  </h3>
                  <div className="space-y-4">
                    {product.fragranceNotes.top?.length > 0 && (
                      <div>
                        <h4 className="text-luxury-gold text-sm font-medium mb-2">Top Notes</h4>
                        <p className="text-gray-400 text-sm">{product.fragranceNotes.top.join(', ')}</p>
                      </div>
                    )}
                    {product.fragranceNotes.middle?.length > 0 && (
                      <div>
                        <h4 className="text-luxury-gold text-sm font-medium mb-2">Middle Notes</h4>
                        <p className="text-gray-400 text-sm">{product.fragranceNotes.middle.join(', ')}</p>
                      </div>
                    )}
                    {product.fragranceNotes.base?.length > 0 && (
                      <div>
                        <h4 className="text-luxury-gold text-sm font-medium mb-2">Base Notes</h4>
                        <p className="text-gray-400 text-sm">{product.fragranceNotes.base.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Perfume Details */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                {product.volume && (
                  <div className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-4">
                    <h4 className="text-luxury-gold text-sm font-medium mb-1">Volume</h4>
                    <p className="text-gray-400">{product.volume}</p>
                  </div>
                )}
                {product.longevity && (
                  <div className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-4">
                    <h4 className="text-luxury-gold text-sm font-medium mb-1">Longevity</h4>
                    <p className="text-gray-400 capitalize">{product.longevity}</p>
                  </div>
                )}
                {product.sillage && (
                  <div className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-4">
                    <h4 className="text-luxury-gold text-sm font-medium mb-1">Sillage</h4>
                    <p className="text-gray-400 capitalize">{product.sillage}</p>
                  </div>
                )}
                {product.brand && (
                  <div className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-4">
                    <h4 className="text-luxury-gold text-sm font-medium mb-1">Brand</h4>
                    <p className="text-gray-400">{product.brand}</p>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-luxury-pearl mb-2">
                  Quantity
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-luxury-gold/30 rounded-sm bg-luxury-charcoal">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 text-luxury-pearl hover:bg-luxury-gold/10 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 font-medium text-luxury-pearl">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 text-luxury-pearl hover:bg-luxury-gold/10 transition-colors"
                      disabled={quantity >= (product.stock || 10)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {product.stock && (
                    <span className="text-gray-400">
                      {product.stock} available
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center space-x-2 bg-luxury-gold text-black px-8 py-4 rounded-sm hover:bg-yellow-400 transition-all font-semibold shadow-lg hover:shadow-luxury-gold/50"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
                <button 
                  onClick={handleWishlist}
                  className={`p-4 border rounded-sm transition-all ${
                    isWishlisted 
                      ? 'bg-luxury-gold/10 border-luxury-gold' 
                      : 'border-luxury-gold/30 hover:bg-luxury-gold/10'
                  }`}
                >
                  <Heart 
                    size={20} 
                    className={`${isWishlisted ? 'fill-luxury-gold text-luxury-gold' : 'text-luxury-gold'}`}
                  />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-4 border border-luxury-gold/30 rounded-sm hover:bg-luxury-gold/10 transition-colors"
                >
                  <Share2 size={20} className="text-luxury-gold" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-luxury-charcoal border border-luxury-gold/20 rounded-sm">
                  <Truck className="text-luxury-gold" size={24} />
                  <div>
                    <p className="font-semibold text-luxury-pearl">Free Delivery</p>
                    <p className="text-sm text-gray-400">All over Pakistan</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-luxury-charcoal border border-luxury-gold/20 rounded-sm">
                  <Shield className="text-luxury-gold" size={24} />
                  <div>
                    <p className="font-semibold text-luxury-pearl">
                      100% Authentic
                    </p>
                    <p className="text-sm text-gray-400">Quality guarantee</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-serif font-bold text-luxury-pearl mb-8 text-center">
              Related Fragrances
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm shadow-lg overflow-hidden hover:border-luxury-gold/50 hover:shadow-2xl transition-all duration-300"
                >
                  <Link to={`/product/${relatedProduct._id}`}>
                    <div className="aspect-square overflow-hidden bg-luxury-black">
                      <img
                        src={relatedProduct.images?.[0] || defaultImages[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-serif font-semibold text-luxury-pearl mb-2 line-clamp-1">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {relatedProduct.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-serif font-bold text-luxury-gold">
                          Rs. {relatedProduct.price?.toLocaleString()}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (relatedProduct.rating || 4)
                                  ? "fill-luxury-gold text-luxury-gold"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ProductDetailPage;