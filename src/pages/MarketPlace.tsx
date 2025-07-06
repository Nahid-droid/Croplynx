import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, Sprout, Mountain, PackageSearch, Heart } from 'lucide-react'; // Import Heart icon
import { ShoppingCart } from 'lucide-react';
import { motion } from "framer-motion";

// DataInsights komponenti
const DataInsights = () => {
  const averagePH = 6.5;
  const bestFertilizer = "Organic Compost";

  return (
    <Card className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border-white/20 mt-10">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Data Insights</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300 space-y-3">
        <p>Average pH for clay soil: <strong>{averagePH}</strong></p>
        <p>Best performing fertilizer last season: <strong>{bestFertilizer}</strong></p>
      </CardContent>
    </Card>
  );
};

const MarketPlace = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedSoil, setSelectedSoil] = useState('');
  const [developmentStage, setDevelopmentStage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const categories = [
    { name: "Fertilizers", value: "fertilizers" },
    { name: "Seeds", value: "seeds" }
  ];

  const plants = [
    { name: 'Tomato', value: 'tomato', icon: '🍅' },
    { name: 'Wheat', value: 'wheat', icon: '🌾' },
    { name: 'Corn', value: 'corn', icon: '🌽' },
    { name: 'Rice', value: 'rice', icon: '🌾' },
    { name: 'Potato', value: 'potato', icon: '🥔' },
    { name: 'Carrot', value: 'carrot', icon: '🥕' },
    { name: 'Lettuce', value: 'lettuce', icon: '🥬' },
    { name: 'Apple', value: 'apple', icon: '🍎' },
    { name: 'Orange', value: 'orange', icon: '🍊' },
    { name: 'Strawberry', value: 'strawberry', icon: '🍓' },
    { name: 'Cotton', value: 'cotton', icon: '☁️' },
    { name: 'Soybean', value: 'soybean', icon: '🌱' }
  ];

  const soilTypes = [
    { name: 'Clay Soil', value: 'clay', ph: '6.0-7.0', description: 'Heavy, nutrient-rich soil', color: 'bg-amber-100 text-amber-800' },
    { name: 'Sandy Soil', value: 'sandy', ph: '6.0-7.5', description: 'Light, well-draining soil', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Loamy Soil', value: 'loamy', ph: '6.0-7.0', description: 'Ideal balanced soil', color: 'bg-green-100 text-green-800' },
    { name: 'Silty Soil', value: 'silty', ph: '6.0-7.0', description: 'Fine particles with high fertility', color: 'bg-blue-100 text-blue-800' },
    { name: 'Peaty Soil', value: 'peaty', ph: '4.0-6.0', description: 'Rich, acidic soil', color: 'bg-purple-100 text-purple-800' },
    { name: 'Chalky Soil', value: 'chalky', ph: '7.0-8.5', description: 'Alkaline soil', color: 'bg-gray-100 text-gray-800' }
  ];

  const plantDevelopmentStages = [
    { name: 'Seedling', value: 'seedling' },
    { name: 'Vegetative', value: 'vegetative' },
    { name: 'Flowering', value: 'flowering' },
    { name: 'Fruiting', value: 'fruiting' },
    { name: 'Harvest', value: 'harvest' },
    { name: 'Dormant', value: 'dormant' }
  ];

  const getSelectedPlant = () => plants.find(p => p.value === selectedPlant);
  const getSelectedSoil = () => soilTypes.find(s => s.value === selectedSoil);

  // fetchRecommendations funksiyası:
  const fetchRecommendations = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('http://localhost:3001/api/products/search?plant=' + selectedPlant + '&soil=' + selectedSoil + '&stage=' + developmentStage);
      const data = await res.json();
      setProducts(data.results || []);
    } catch (error) {
      console.error("❌ Error fetching recommendations", error);
      toast.error("Failed to fetch recommendations from backend");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToFavorites = async (product) => {
    try {
      const res = await fetch('http://localhost:3001/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: product.title,
          link: product.link,
          image: product.image || '',
          price: product.price || '',
          rating: product.rating || null,
        }),
      });

      if (res.ok) {
        toast.success('Added to Favorites!');
      } else {
        toast.error('Failed to add to Favorites');
      }
    } catch (error) {
      toast.error('Error adding to Favorites');
    }
  };

  const handleAnalysis = async () => {
    if (!selectedCategory) return toast.error("Please select a product category");

    if (selectedCategory === 'fertilizers' && (!selectedPlant || !selectedSoil)) {
      return toast.error("Please select both plant and soil for fertilizers");
    }

    if (selectedCategory === 'seeds' && !selectedPlant) {
      return toast.error("Please select a plant type for seeds");
    }

    setIsAnalyzing(true);
    setShowRecommendations(false);

    // GET request üçün query param-lar belə göndərilir:
    const url = new URL('http://localhost:3001/api/products/search');
    url.searchParams.append('category', selectedCategory);
    url.searchParams.append('plant', selectedPlant);
    if(selectedSoil) url.searchParams.append('soil', selectedSoil);
    if(developmentStage) url.searchParams.append('stage', developmentStage);

    try {
      const res = await fetch(url.toString(), { method: 'GET' });
      const data = await res.json();
      setProducts(data.results || []);
      setShowRecommendations(true);
      toast.success("Analysis complete! Here are your recommendations.");
    } catch (error) {
      toast.error("Failed to fetch recommendations from backend");
      setProducts([]);
    } finally {
      setIsAnalyzing(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-green-800">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* Sol tərəfdə Home link */}
        <Link to="/" className="flex items-center space-x-2 text-white hover:text-teal-300 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        {/* Sağ tərəfdə Favorites link */}
        <Link
          to="/favorites"
          className="flex items-center space-x-2 text-white hover:text-teal-400 transition font-semibold"
        >
          <Heart className="w-5 h-5" /> {/* Heart icon added here */}
          <span>Favorites</span>
        </Link>
      </header>

      <section className="container mx-auto px-4 py-12 text-center">
        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }}>
          <ShoppingCart className="w-16 h-16 text-teal-400 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-4">
          MARKETPLACE
        </h1>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <Card className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white mb-2">Select Product Information</CardTitle>
            <p className="text-gray-300">Fill out fields to get product recommendations</p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Category */}
            <div className="space-y-3 max-w-xs mx-auto">
              <Label className="text-white font-medium">Product Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Plant */}
            {(selectedCategory === 'fertilizers' || selectedCategory === 'seeds') && (
              <div className="space-y-3 max-w-xs mx-auto">
                <Label className="text-white font-medium flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-teal-400" />
                  <span>Plant Type</span>
                </Label>
                <Select value={selectedPlant} onValueChange={setSelectedPlant}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select plant type" />
                  </SelectTrigger>
                  <SelectContent>
                    {plants.map(plant => (
                      <SelectItem key={plant.value} value={plant.value}>
                        <div className="flex items-center space-x-2">
                          <span>{plant.icon}</span>
                          <span>{plant.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Soil */}
            {selectedCategory === 'fertilizers' && (
              <div className="space-y-3 max-w-xs mx-auto">
                <Label className="text-white font-medium flex items-center space-x-2">
                  <Mountain className="w-5 h-5 text-blue-400" />
                  <span>Soil Type</span>
                </Label>
                <Select value={selectedSoil} onValueChange={setSelectedSoil}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map(soil => (
                      <SelectItem key={soil.value} value={soil.value}>
                        <div>
                          <div className="font-medium text">{soil.name}</div>
                          <div className="text-sm text-gray-700">{soil.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Development Stage */}
            {(selectedCategory === 'fertilizers' || selectedCategory === 'seeds') && (
              <div className="space-y-3 max-w-xs mx-auto">
                <Label className="text-white font-medium flex items-center space-x-2">
                  <Sprout className="w-5 h-5 text-green-400" />
                  <span>Development Stage</span>
                </Label>
                <Select value={developmentStage} onValueChange={setDevelopmentStage}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select development stage (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {plantDevelopmentStages.map(stage => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Analyze Button */}
            <Button
              onClick={handleAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white py-6 text-lg font-medium"
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2 justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <>
                  <PackageSearch className="w-5 h-5 mr-2" />
                  Discover Matched Products
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Show Data Insights always */}
        <DataInsights />

        {/* Recommendations Section */}
        {showRecommendations && (
          <div className="max-w-4xl mx-auto mt-12 space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <PackageSearch className="w-6 h-6 text-teal-400" />
                  <span>Analysis Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-white font-semibold">Category</p>
                    <p>{categories.find(c => c.value === selectedCategory)?.name}</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Plant Type</p>
                    <p>{getSelectedPlant()?.name}</p>
                  </div>
                  {selectedCategory === 'fertilizers' && (
                    <div>
                      <p className="text-white font-semibold">Soil Type</p>
                      <p>{getSelectedSoil()?.name}</p>
                    </div>
                  )}
                </div>

                {(developmentStage) && (
                  <div className="mt-4">
                    <p className="text-white font-semibold">Development Stage</p>
                    <p>{plantDevelopmentStages.find(s => s.value === developmentStage)?.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Cards */}
            <div>
              <h2 className="text-3xl font-semibold text-white mb-6">Recommended Products</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {loadingProducts && <p className="text-white col-span-full">Loading...</p>}
                {!loadingProducts && products.length === 0 && (
                  <p className="text-white col-span-full">No products match your criteria.</p>
                )}
                {products.map((product, i) => {
                  const emojis = ['🍅', '🧱', '🌿', '🧪'];
                  const emoji = emojis[i % emojis.length];

                  // Şəkil üçün random 1-dən 5-ə qədər index seçirik
                  const randomImageIndex = Math.floor(Math.random() * 5) + 1;

                  // Məsələn: /images/plants/tomato-3.jpg
                  const imageUrl = selectedPlant
                    ? `/images/plants/${selectedPlant}-${randomImageIndex}.jpg`
                    : `/images/plants/default.jpg`;

                  const store = product.link?.includes("arbico") ? "Arbico Organics" :
                    product.link?.includes("wakefield") ? "Wakefield" :
                      product.link?.includes("facebook") ? "Facebook" :
                        "External";

                  return (
                    <Card key={i} className="bg-white/20 border-white/30 backdrop-blur-md overflow-hidden hover:scale-[1.02] transition-transform">
                      <img src={imageUrl} alt={product.title} className="w-full h-48 object-cover" />
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          {emoji} {product.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-gray-300 space-y-2">
                        <p className="text-sm">{product.snippet || 'No description available'}</p>
                        <div className="flex flex-wrap items-center justify-between text-sm pt-2">
                          <span className="bg-emerald-700 text-white px-2 py-1 rounded-full">
                            Store: {store}
                          </span>
                          <span className="text-yellow-400">⭐ {Math.floor(Math.random() * 2 + 4)}.{Math.floor(Math.random() * 10)}</span>
                        </div>
                        <div className="pt-3 flex flex-col gap-2">
                          <a
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition"
                          >
                            Visit Product →
                          </a>
                          <button
                            onClick={() => handleAddToFavorites({ ...product, image: imageUrl })}
                            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
                          >
                            🛒 Add to Favorites
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MarketPlace;