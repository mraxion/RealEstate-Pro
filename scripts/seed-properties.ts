import { db } from "../server/db";
import { properties } from "../shared/schema";

async function seedProperties() {
  try {
    // Obtenemos propiedades reales de Madrid Centro (basadas en idealista.com)
    const madridCentroProperties = [
      {
        title: "Ático con terraza en la Plaza Mayor",
        description: "Espectacular ático reformado con terraza de 20m² con vistas a la Plaza Mayor. Interior completamente reformado con materiales de alta calidad. Edificio histórico con ascensor. Oportunidad única en el centro de Madrid.",
        type: "penthouse",
        price: 895000,
        location: "Madrid, Centro",
        address: "Plaza Mayor, 28012 Madrid",
        bedrooms: 2,
        bathrooms: 2,
        area: 95,
        features: JSON.stringify(["Terraza", "Ascensor", "Aire acondicionado", "Calefacción", "Reformado", "Vistas panorámicas"]),
        images: JSON.stringify([
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/e8/9a/5f/893469425.jpg",
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/64/ca/8f/893469426.jpg",
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/5e/2f/b5/893469427.jpg"
        ]),
        status: "available"
      },
      {
        title: "Piso reformado en Calle del Pez",
        description: "Precioso piso reformado en pleno barrio de Malasaña. Orientación este-oeste. Consta de salón, cocina independiente equipada, dos dormitorios y un baño completo. Edificio con ascensor y portero físico.",
        type: "apartment",
        price: 465000,
        location: "Madrid, Centro",
        address: "Calle del Pez, 28004 Madrid",
        bedrooms: 2,
        bathrooms: 1,
        area: 85,
        features: JSON.stringify(["Ascensor", "Portero", "Cocina equipada", "Aire acondicionado", "Calefacción", "Exterior"]),
        images: JSON.stringify([
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/db/a2/e5/946152357.jpg",
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/24/79/0e/946152358.jpg",
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/dc/0e/02/946152361.jpg"
        ]),
        status: "available"
      },
      {
        title: "Loft en Lavapiés - Edificio con encanto",
        description: "Magnífico loft en el corazón de Lavapiés. Espacio diáfano con techos altos, vigas vistas y amplios ventanales. Cocina abierta completamente equipada. Dormitorio en altillo con vestidor. Baño completo con ducha de obra.",
        type: "loft",
        price: 320000,
        location: "Madrid, Centro",
        address: "Calle Argumosa, 28012 Madrid",
        bedrooms: 1,
        bathrooms: 1,
        area: 65,
        features: JSON.stringify(["Techos altos", "Vigas vistas", "Cocina equipada", "Altillo", "Aire acondicionado", "Ventanales"]),
        images: JSON.stringify([
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/fd/a0/7f/931650984.jpg",
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/12/10/89/931650987.jpg",
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/5b/10/bd/931650988.jpg"
        ]),
        status: "available"
      },
      {
        title: "Apartamento exclusivo en Chueca",
        description: "Apartamento de lujo en pleno barrio de Chueca. Completamente reformado con materiales de primera calidad. Cocina moderna equipada con electrodomésticos de gama alta. Baño con ducha efecto lluvia. Luminoso y tranquilo.",
        type: "apartment",
        price: 375000,
        location: "Madrid, Centro",
        address: "Calle Hortaleza, 28004 Madrid",
        bedrooms: 1,
        bathrooms: 1,
        area: 60,
        features: JSON.stringify(["Reformado", "Cocina equipada", "Aire acondicionado", "Calefacción", "Luminoso", "Armarios empotrados"]),
        images: JSON.stringify([
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/74/30/de/942453698.jpg",
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/23/ec/56/942453702.jpg",
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/84/c6/90/942453701.jpg"
        ]),
        status: "available"
      },
      {
        title: "Piso señorial en Palacio - Finca rehabilitada",
        description: "Magnífico piso en edificio completamente rehabilitado del siglo XIX. Techos altos con molduras, suelos de madera, chimenea. Tres amplios dormitorios, dos baños completos, amplio salón-comedor y cocina equipada. Plaza de garaje incluida.",
        type: "apartment",
        price: 785000,
        location: "Madrid, Centro",
        address: "Calle Bailén, 28013 Madrid",
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        features: JSON.stringify(["Finca rehabilitada", "Techos altos", "Molduras", "Chimenea", "Garaje", "Trastero", "Ascensor"]),
        images: JSON.stringify([
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/4c/bc/2a/952453688.jpg",
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/e9/8d/de/952453692.jpg",
          "https://img3.idealista.com/blur/WEB_DETAIL-M-L/0/id.pro.es.image.master/28/b8/4a/952453691.jpg"
        ]),
        status: "available"
      }
    ];

    console.log("Insertando propiedades de Madrid Centro...");
    
    // Inserta las propiedades en la base de datos
    for (const property of madridCentroProperties) {
      await db.insert(properties).values(property);
    }

    console.log("Propiedades insertadas correctamente.");
  } catch (error) {
    console.error("Error al insertar propiedades:", error);
  } finally {
    process.exit(0);
  }
}

seedProperties();