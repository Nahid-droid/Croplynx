import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const profilePath = path.join(process.cwd(), 'data', 'user-profile.json');

// Profil yükləmə funksiyası
function loadProfile() {
  if (!fs.existsSync(profilePath)) {
    const dataDir = path.dirname(profilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(profilePath, JSON.stringify({ favorites: [] }, null, 2));
    return { favorites: [] };
  }
  return JSON.parse(fs.readFileSync(profilePath, 'utf8'));
}

// Profil yadda saxlanması
function saveProfile(data) {
  fs.writeFileSync(profilePath, JSON.stringify(data, null, 2));
}

// Favorit əlavə etmək üçün POST endpoint
router.post('/favorites', (req, res) => {
  try {
    const { title, link, image, price, rating } = req.body;

    if (!title || !link) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const profile = loadProfile();

    // Əgər artıq varsa, əlavə etmə
    if (profile.favorites.find(item => item.link === link)) {
      return res.status(200).json({ message: 'Already in favorites' });
    }

    profile.favorites.push({
      title,
      link,
      image,
      rating,
      addedAt: new Date().toISOString(),
    });

    saveProfile(profile);

    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('POST /favorites error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Favoritləri almaq üçün GET endpoint
router.get('/favorites', (req, res) => {
  try {
    const profile = loadProfile();
    res.json({ favorites: profile.favorites });
  } catch (error) {
    console.error('GET /favorites error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Favoritdən silmək üçün DELETE endpoint
router.delete('/favorites', (req, res) => {
  try {
    const { link } = req.body;
    if (!link) return res.status(400).json({ error: 'Missing product link' });

    const profile = loadProfile();
    const initialCount = profile.favorites.length;
    profile.favorites = profile.favorites.filter(item => item.link !== link);

    if (profile.favorites.length === initialCount) {
      return res.status(404).json({ error: 'Product not found in favorites' });
    }

    saveProfile(profile);
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('DELETE /favorites error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
