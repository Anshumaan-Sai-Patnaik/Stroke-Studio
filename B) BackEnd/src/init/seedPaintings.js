const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Painting = require("../models/list");

const axios = require("axios");
const {v4: uuidv4} = require('uuid');

function simplifyDimensions(raw) {
    const match = raw.match(/(\d+(\.\d+)?)\s*×\s*(\d+(\.\d+)?)\s*cm/);
    if (match) {
        const width = parseFloat(match[1]);
        const height = parseFloat(match[3]);
        return `${width} × ${height} cm`;
    }
    return "Unknown";
}
function getRandomNumber() {
    return Math.floor(Math.random() * (45000 - 30000 + 1)) + 30000;
}

const TOTAL_PAINTINGS = 99;
let savedCount = 0;
const famousArtists = [
    "Pablo Picasso",
    "Andy Warhol",
    "Claude Monet",
    "Vincent van Gogh",
    "Jackson Pollock",
    "Damien Hirst"
];

function transformArtwork(artwork, rawDims) {
  return {
        image:`A) FrontEnd/Images/Paintings/painting_${savedCount+1}`,
        imageURL: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
        imageID: uuidv4(),
        title: artwork.title || "Untitled",
        artist: artwork.artist_title || "Unknown",
        year: artwork.date_start || null,
        style: artwork.style_title || "Unknown",
        medium: artwork.medium_display || "Unknown",
        dimensions: simplifyDimensions(rawDims),
        price: `₹ ${getRandomNumber().toLocaleString("en-IN")}`
    };
}

async function seedPaintings() {
    await connectDB();
    console.log("Seeding paintings...");
    const response = await axios.get(
        "https://api.artic.edu/api/v1/artworks/search",
        {
            params: {
                q: "painting",
                fields: "id,image_id,title,artist_title,date_start,style_title,medium_display,dimensions_display,dimensions,dimension",
                query: JSON.stringify({
                    term: { is_public_domain: true },
                    range: { date_start: { gte: 1950 } }
                }),
                limit: 100
            }
        }
    );
    const artworks = response.data.data;
    for (const artwork of artworks) {
        if (!artwork.image_id) continue;
        const rawDims = artwork.dimensions_display || artwork.dimensions || artwork.dimension;
        if (!rawDims) continue;
        if (famousArtists.includes(artwork.artist_title)) continue;

        const paintingData = transformArtwork(artwork, rawDims);
        await new Painting(paintingData).save();
        savedCount++;
        if (savedCount == TOTAL_PAINTINGS) break;
    }
    console.log(`Saved ${savedCount} paintings`);
    console.log("Seeding complete");
    await mongoose.disconnect();
}
seedPaintings();
