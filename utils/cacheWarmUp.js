const { writeObject, ROOT_CACHE_DIR } = require('./objectCache');
const fs = require('fs');
const path = require('path');

const Song = require('../models/song.model');
const SERVER_INDEX = parseInt(process.env.SERVER_INDEX || '0');
const TOTAL_SERVERS = parseInt(process.env.TOTAL_SERVERS || '1');

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function hasCacheData() {
  const songsDir = path.join(ROOT_CACHE_DIR, 'songs');
  console.log(songsDir);
  return fs.existsSync(songsDir) && fs.readdirSync(songsDir).length > 0;
}

async function warmUp() {
  if (hasCacheData()) {
    console.log('🧊 Đã có cache sẵn, bỏ qua preload.');
    return;
  }

  console.log('🔄 Đang preload cache vào /tmp/cache...');

  const songs = await Song.find().lean();
  let count = 0;

  for (const song of songs) {
    const index = hashString(String(song._id)) % TOTAL_SERVERS;
    if (index === SERVER_INDEX) {
      writeObject('songs', song._id, song);
      count++;
    }
  }

  console.log(`✅ Server ${SERVER_INDEX} đã cache ${count} bài hát.`);
}

module.exports = warmUp;
