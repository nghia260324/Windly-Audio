const { verifyMediaToken } = require('../utils/utils');
const { readOrFetchObject } = require('../utils/objectCache');

const fs = require('fs');
const path = require('path');
const os = require('os');

const imageFieldByType = {
    song: 'thumbnail',
    artist: 'avatar',
    album: 'coverImage',
    playlist: 'thumbnail',
};

class ApiController {
    async streamImage(req, res) {
        const token = req.query.t;
        const ip = req.ip;
        const ua = req.get('User-Agent');
//        const payload = verifyMediaToken(token, ip, ua);
        const payload = verifyMediaToken(token);

        
        if (!payload) return res.status(403).send('Token không hợp lệ hoặc đã hết hạn');

        const { type, id } = payload;
        const imageField = imageFieldByType[type];
        if (!imageField) return res.status(400).send('Loại dữ liệu không hợp lệ');

        let item = await readOrFetchObject(type + 's', id);

        const url = item[imageField];
        if (!url) return res.status(404).send('Không có ảnh');

        const cacheDir = path.join(os.tmpdir(), 'cache', 'images');
        const fileExt = path.extname(new URL(url).pathname).split('?')[0] || '.jpg';
        const filePath = path.join(cacheDir, `${id}${fileExt}`);

        try {
            if (fs.existsSync(filePath)) {
                return res.sendFile(filePath);
            }

            const response = await fetch(url);
            if (!response.ok) return res.status(500).send('Không thể tải ảnh từ Cloudinary');

            const contentType = response.headers.get('content-type');
            const buffer = Buffer.from(await response.arrayBuffer());

            fs.mkdirSync(cacheDir, { recursive: true });
            fs.writeFileSync(filePath, buffer);

            res.set('Content-Type', contentType);
            res.set('Cache-Control', 'public, max-age=21600');
            res.send(buffer);
        } catch (err) {
            console.error('Lỗi khi tải/ghi ảnh:', err.message);
            res.status(500).send('Lỗi xử lý ảnh');
        }
    }

    async streamAudio(req, res) {
        const token = req.query.t;
        const ip = req.ip;
        const ua = req.get('User-Agent');
        const payload = verifyMediaToken(token, ip, ua);

        if (!payload) return res.status(403).send('Token không hợp lệ hoặc đã hết hạn');

        const { type, id } = payload;
        if (type !== 'song') return res.status(400).send('Loại dữ liệu không hợp lệ');

        const song = await readOrFetchObject('songs', id);
        if (!song) return res.status(404).send('Không tìm thấy bài hát');

        const url = song.audioUrl;
        if (!url) return res.status(404).send('Không có audio');

        const cacheDir = path.join(os.tmpdir(), 'cache', 'audios');
        const fileExt = path.extname(new URL(url).pathname).split('?')[0] || '.mp3';
        const filePath = path.join(cacheDir, `${id}${fileExt}`);

        try {
            if (fs.existsSync(filePath)) {
                return res.sendFile(filePath);
            }

            const response = await fetch(url);
            if (!response.ok) return res.status(500).send('Không thể tải audio');

            const contentType = response.headers.get('content-type');
            const buffer = Buffer.from(await response.arrayBuffer());

            fs.mkdirSync(cacheDir, { recursive: true });
            fs.writeFileSync(filePath, buffer);

            res.set('Content-Type', contentType);
            res.set('Content-Disposition', 'inline');
            res.send(buffer);
        } catch (err) {
            console.error('Lỗi khi tải/ghi audio:', err.message);
            res.status(500).send('Lỗi xử lý audio');
        }
    }
}

module.exports = new ApiController();