const fs = require('fs');
const path = require('path');
const os = require('os');

const Song = require('../models/song.model');
const Album = require('../models/album.model');
const Playlist = require('../models/playlist.model');
const Artist = require('../models/artist.model');

const ROOT_CACHE_DIR = path.join(os.tmpdir(), 'cache');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getCachePath(folder, id) {
  const dir = path.join(ROOT_CACHE_DIR, folder);
  ensureDir(dir);
  return path.join(dir, `${id}.json`);
}

function writeObject(folder, id, data) {
  const filePath = getCachePath(folder, id);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readObject(folder, id) {
  const filePath = getCachePath(folder, id);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    console.error(`❌ Lỗi đọc cache ${folder}/${id}:`, err);
    return null;
  }
}

async function readOrFetchObject(folder, id) {
  const cached = readObject(folder, id);
  if (cached) return cached;

  let Model = null;
  switch (folder) {
    case 'songs':
      Model = Song; break;
    case 'albums':
      Model = Album; break;
    case 'playlists':
      Model = Playlist; break;
    case 'artists':
      Model = Artist; break;
    default:
      return null;
  }

  try {
    const data = await Model.findById(id).lean();
    if (data) {
      writeObject(folder, id, data);
      return data;
    }
  } catch (err) {
    console.error(`❌ Lỗi truy vấn ${folder}/${id}:`, err);
  }

  return null;
}

function deleteFileIfExists(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log('🗑️ Đã xoá file:', filePath);
    } catch (err) {
      console.error('❌ Lỗi khi xoá file:', filePath, err);
    }
  }
}

function deleteObject(folder, id) {
  const filePath = getCachePath(folder, id);
  deleteFileIfExists(filePath);
}


module.exports = {
  writeObject,
  readObject,
  readOrFetchObject,
  deleteObject,
  deleteFileIfExists,
  ROOT_CACHE_DIR
};
