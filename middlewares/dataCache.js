const AdminArtistController = require('../controllers/admin/artist.controller');
const AdminSongController = require('../controllers/admin/song.controller');
const AdminAlbumController = require('../controllers/admin/album.controller');
const AdminGenreController = require('../controllers/admin/genre.controller');

const UserSongController = require('../controllers/user/song.controller');

const {
  getMemoryCache,
  setMemoryCache
} = require('../utils/memoryCache');

const cacheMap = {
  artists: AdminArtistController.getAll,
  songs: AdminSongController.getAll,
  getSongsForHome: UserSongController.getSongsForHome,
  albums: AdminAlbumController.getAll,
  genres: AdminGenreController.getAll,
};

const DEFAULT_TTL = 3600 * 1000;

function dataCache(requiredKeys = []) {
  return async function (req, res, next) {
    try {
      for (const key of requiredKeys) {
        let data = getMemoryCache(key, DEFAULT_TTL);
        if (!data) {
          const fetchFn = cacheMap[key];
          if (typeof fetchFn === 'function') {
            data = await fetchFn();
            setMemoryCache(key, data);
          }
        }
        res.locals[key] = data;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = dataCache;
