const CacheKeys = {
  GLOBAL: {
    SONGS: 'songs',
    ALBUMS: 'albums',
    PLAYLISTS: 'playlists',
    ARTISTS: 'artists'
  },
  USER: {
    HOME: 'HOME',
    FAVORITES: 'FAVORITES',
    PLAYLISTS: 'PLAYLISTS',
    HISTORY: 'HISTORY'
  },
  DETAIL: {
    SONG: id => `SONG:${id}`,
    ALBUM: id => `ALBUM:${id}`,
    PLAYLIST: id => `PLAYLIST:${id}`,
    ARTIST: id => `ARTIST:${id}`,
  }
};

module.exports = CacheKeys;
