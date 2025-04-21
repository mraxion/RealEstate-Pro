import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, BarChart2, MapPin, AlertCircle, Search } from "lucide-react";

export default function MarketAnalysis() {
  const [selectedCity, setSelectedCity] = useState<string>("madrid");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Datos de ejemplo para el análisis de mercado
  const marketData = {
    madrid: {
      averagePrice: 3250,
      changeRate: 4.2,
      trend: "up",
      zones: [
        { name: "Salamanca", averagePrice: 4850, changeRate: 5.1, trend: "up" },
        { name: "Chamberí", averagePrice: 4500, changeRate: 4.7, trend: "up" },
        { name: "Centro", averagePrice: 4200, changeRate: 3.9, trend: "up" },
        { name: "Retiro", averagePrice: 4600, changeRate: 4.5, trend: "up" },
        { name: "Chamartín", averagePrice: 4350, changeRate: 3.6, trend: "up" },
        { name: "Tetuán", averagePrice: 3100, changeRate: 5.2, trend: "up" },
        { name: "Arganzuela", averagePrice: 3450, changeRate: 3.8, trend: "up" },
      ],
    },
    barcelona: {
      averagePrice: 3550,
      changeRate: 3.8,
      trend: "up",
      zones: [
        { name: "Eixample", averagePrice: 4950, changeRate: 4.2, trend: "up" },
        { name: "Sarrià-Sant Gervasi", averagePrice: 5100, changeRate: 3.5, trend: "up" },
        { name: "Gràcia", averagePrice: 3950, changeRate: 4.7, trend: "up" },
        { name: "Ciutat Vella", averagePrice: 4100, changeRate: 2.9, trend: "up" },
        { name: "Les Corts", averagePrice: 4350, changeRate: 3.2, trend: "up" },
        { name: "Sant Martí", averagePrice: 3400, changeRate: 4.1, trend: "up" },
      ],
    },
    valencia: {
      averagePrice: 1950,
      changeRate: 6.2,
      trend: "up",
      zones: [
        { name: "L'Eixample", averagePrice: 2450, changeRate: 7.1, trend: "up" },
        { name: "Ciutat Vella", averagePrice: 2350, changeRate: 6.8, trend: "up" },
        { name: "El Pla del Real", averagePrice: 2650, changeRate: 5.9, trend: "up" },
        { name: "Extramurs", averagePrice: 2200, changeRate: 6.3, trend: "up" },
        { name: "El Cabanyal", averagePrice: 1750, changeRate: 8.2, trend: "up" },
      ],
    },
    malaga: {
      averagePrice: 2350,
      changeRate: 7.5,
      trend: "up",
      zones: [
        { name: "Centro", averagePrice: 3150, changeRate: 8.1, trend: "up" },
        { name: "Malagueta", averagePrice: 3650, changeRate: 7.6, trend: "up" },
        { name: "Pedregalejo", averagePrice: 3250, changeRate: 6.9, trend: "up" },
        { name: "Teatinos", averagePrice: 2450, changeRate: 7.2, trend: "up" },
        { name: "El Limonar", averagePrice: 3950, changeRate: 6.4, trend: "up" },
      ],
    },
    sevilla: {
      averagePrice: 1850,
      changeRate: 5.8,
      trend: "up",
      zones: [
        { name: "Santa Cruz", averagePrice: 2950, changeRate: 6.1, trend: "up" },
        { name: "Triana", averagePrice: 2350, changeRate: 5.7, trend: "up" },
        { name: "Los Remedios", averagePrice: 2550, changeRate: 4.9, trend: "up" },
        { name: "Nervión", averagePrice: 2150, changeRate: 5.3, trend: "up" },
        { name: "Alameda", averagePrice: 2050, changeRate: 6.2, trend: "up" },
      ],
    },
  };
  
  // Obtenemos los datos de la ciudad seleccionada
  const cityData = marketData[selectedCity as keyof typeof marketData];
  
  // Filtramos las zonas por la búsqueda si es necesario
  const filteredZones = cityData.zones.filter(zone => 
    searchQuery === "" || zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Preparamos los datos para el gráfico
  const chartData = filteredZones.map(zone => ({
    name: zone.name,
    precio: zone.averagePrice,
  }));
  
  return (
    <DashboardLayout title="Análisis de Mercado">
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-100">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-full">
                <BarChart2 className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-primary-900 mb-1">
                  Análisis de Precios del Mercado Inmobiliario
                </h2>
                <p className="text-primary-800">
                  Explora los precios medios por metro cuadrado en diferentes ciudades y zonas. Estos datos 
                  se actualizan mensualmente basándose en información de los principales portales inmobiliarios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="madrid">Madrid</SelectItem>
                <SelectItem value="barcelona">Barcelona</SelectItem>
                <SelectItem value="valencia">Valencia</SelectItem>
                <SelectItem value="malaga">Málaga</SelectItem>
                <SelectItem value="sevilla">Sevilla</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de propiedad</label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de propiedad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="apartment">Pisos</SelectItem>
                <SelectItem value="house">Casas</SelectItem>
                <SelectItem value="penthouse">Áticos</SelectItem>
                <SelectItem value="studio">Estudios</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por zona</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Nombre de la zona..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="w-full border-b mb-0 rounded-b-none">
            <TabsTrigger value="overview" className="flex-1">Resumen</TabsTrigger>
            <TabsTrigger value="zones" className="flex-1">Zonas</TabsTrigger>
            <TabsTrigger value="chart" className="flex-1">Gráfico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="border rounded-t-none p-6 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Precio medio</CardTitle>
                  <CardDescription>por m² en {selectedCity === "madrid" ? "Madrid" : selectedCity === "barcelona" ? "Barcelona" : selectedCity === "valencia" ? "Valencia" : selectedCity === "malaga" ? "Málaga" : "Sevilla"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold text-primary-700">
                      {formatCurrency(cityData.averagePrice)}
                    </div>
                    <div className={`flex items-center font-medium ${cityData.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {cityData.trend === "up" ? 
                        <TrendingUp className="h-4 w-4 mr-1" /> : 
                        <TrendingDown className="h-4 w-4 mr-1" />
                      }
                      {cityData.changeRate}%
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Zona más cara</CardTitle>
                  <CardDescription>precio máximo por m²</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xl font-semibold text-gray-800">
                        {cityData.zones.sort((a, b) => b.averagePrice - a.averagePrice)[0].name}
                      </div>
                      <div className="text-lg font-bold text-primary-700 mt-1">
                        {formatCurrency(cityData.zones.sort((a, b) => b.averagePrice - a.averagePrice)[0].averagePrice)}
                      </div>
                    </div>
                    <div className="text-gray-500">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Mayor incremento</CardTitle>
                  <CardDescription>zona con mayor crecimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xl font-semibold text-gray-800">
                        {cityData.zones.sort((a, b) => b.changeRate - a.changeRate)[0].name}
                      </div>
                      <div className="flex items-center text-lg font-bold text-green-600 mt-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {cityData.zones.sort((a, b) => b.changeRate - a.changeRate)[0].changeRate}%
                      </div>
                    </div>
                    <div className="text-gray-500">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium text-lg mb-4">Comparativa con otras ciudades</h3>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ciudad</TableHead>
                      <TableHead>Precio medio (€/m²)</TableHead>
                      <TableHead>Variación anual</TableHead>
                      <TableHead>Tendencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(marketData).map(([city, data]) => (
                      <TableRow key={city} className={city === selectedCity ? "bg-primary-50" : ""}>
                        <TableCell className="font-medium">
                          {city === "madrid" ? "Madrid" : 
                           city === "barcelona" ? "Barcelona" : 
                           city === "valencia" ? "Valencia" : 
                           city === "malaga" ? "Málaga" : "Sevilla"}
                          {city === selectedCity && (
                            <Badge variant="outline" className="ml-2 bg-primary-100 text-primary-800 border-primary-200">
                              Seleccionada
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(data.averagePrice)}</TableCell>
                        <TableCell>{data.changeRate}%</TableCell>
                        <TableCell>
                          <span className={`flex items-center ${data.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                            {data.trend === "up" ? 
                              <TrendingUp className="h-4 w-4 mr-1" /> : 
                              <TrendingDown className="h-4 w-4 mr-1" />
                            }
                            {data.trend === "up" ? "Subiendo" : "Bajando"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="zones" className="border rounded-t-none p-6">
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zona</TableHead>
                    <TableHead>Precio medio (€/m²)</TableHead>
                    <TableHead>Variación anual</TableHead>
                    <TableHead>Tendencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredZones.length > 0 ? (
                    filteredZones.map((zone, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell>{formatCurrency(zone.averagePrice)}</TableCell>
                        <TableCell>{zone.changeRate}%</TableCell>
                        <TableCell>
                          <span className={`flex items-center ${zone.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                            {zone.trend === "up" ? 
                              <TrendingUp className="h-4 w-4 mr-1" /> : 
                              <TrendingDown className="h-4 w-4 mr-1" />
                            }
                            {zone.trend === "up" ? "Subiendo" : "Bajando"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No se encontraron zonas que coincidan con tu búsqueda.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="chart" className="border rounded-t-none p-6">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis 
                    label={{ value: 'Precio (€/m²)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip formatter={(value) => [`${value} €/m²`, 'Precio']} />
                  <Legend />
                  <Bar dataKey="precio" name="Precio por m²" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-600">
                <strong>Fuente de datos:</strong> Los precios mostrados corresponden al promedio de las ofertas 
                publicadas en los principales portales inmobiliarios (Fotocasa, Idealista) durante el último mes.
                Última actualización: 15 de abril de 2025.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}