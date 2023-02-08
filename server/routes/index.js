const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();

const M_File = require('../middleware/file');

const MSG = require('../controller/msg');
const msgFile = require('../controller/msgFile.js');
const msgFace = require('../controller/msgFace.js');
const COMMENT = require('../controller/comment');
const ASSETS = require('../controller/assets.js');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Content-Length, Authorization, Accept, X-Requested-With ',
    );
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

router.get('/test', async (req, res) => {
    throw new Error('dd');
});

router.post('/msg/modify', MSG.modify);

// file
router.post('/msg/modify/file/add', multer({ storage }).single('file'), M_File.sourceFileMap, msgFile.modifyByFile);

// file-face
router.post('/msg/modify/file/face/md5', multer({ storage }).single('file'), M_File.sourceFileMap, msgFace.faceMd5);
router.post('/msg/modify/file/face/has', multer({ storage }).single('file'), M_File.sourceFileMap, msgFace.faceHas);
router.post('/msg/modify/file/face/add', multer({ storage }).single('file'), M_File.sourceFileMap, msgFace.faceAdd);
router.post(
    '/msg/modify/file/face/alias/add',
    multer({ storage }).array('files', 10),
    M_File.sourceFileMap,
    msgFace.faceAliasAdd,
);
router.get('/msg/modify/file/face/faceArr', M_File.sourceFileMap, msgFace.getFaceArr);
router.get('/msg/modify/file/face/merger', M_File.sourceFileMap, msgFace.mergerFace);
router.get('/msg/modify/file/face/openFolder', M_File.sourceFileMap, msgFace.openFace);
router.get('/msg/modify/file/face/:faceType/json', M_File.sourceFileMap, msgFace.getFaceTypeArr);

router.post('/comment/add', COMMENT.add);
router.post('/comment/modify', COMMENT.modify);
router.post('/comment/delete', COMMENT.delete);
router.get('/comment/createFolder', COMMENT.createFolder);
router.get('/comment/getFolderFiles', COMMENT.getFolderFiles);

router.post('/assets/copy', ASSETS.copy);
router.get('/assets/flies/:fileName', M_File.sourceFileMap, ASSETS.getFolderFiles);

module.exports = router;
