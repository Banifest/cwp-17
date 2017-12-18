const express = require('express');
const multer  = require('multer');
const uuid = require('uuid-v4');
const sharp = require('sharp');

console.log();
const storage = multer.diskStorage({
                                       destination: './uploads/',
                                       filename: function (req, file, cb)
                                       {
                                           cb(null, file.originalname);
                                       }
                                   });

const pdfStorage = multer.diskStorage({
                                       destination: './uploads/pdf',
                                       filename: function (req, file, cb)
                                       {
                                           let id = uuid();
                                           req.uids? req.uids.push(id) : req.uids = [id];
                                           uids.push(id);
                                           cb(null, id);
                                       }
                                   });

const imgStorage = multer.diskStorage({
                                          destination: './uploads/images',
                                          filename: function (req, file, cb)
                                          {
                                              req.uid = uuid();
                                              req.uidName = `${req.uid}-master.${req.uidEnd}`;
                                              cb(null, req.uidName);
                                          }
                                      });

function pdfFilter (req, file, cb)
{

    if(file.mimetype === 'application/pdf')
    {
        cb(null, true);
    }
    else
    {
        cb(new Error('Это не pdf'))
    }
}

function imgFilter (req, file, cb)
{

    if(file.mimetype === 'image/png')
    {
        req.uidEnd = 'png';
        cb(null, true);
    }
    else if(file.mimetype === 'image/jpg')
    {
        req.uidEnd = 'jpg';
        cb(null, true);
    }
    else
    {
        cb(new Error('Это не картинка'))
    }
}

const upload = multer({ storage: storage });
const pdfUpload = multer({ storage: pdfStorage, fileFilter: pdfFilter});
const imgUpload = multer({ storage: imgStorage, fileFilter: imgFilter});

const app = express();
app.use(express.static('static'));
app.use(express.static('uploads/images'));

app.post('/upload', upload.single('file'), (req, res, next) => {
    res.json({ succeed: true });
});

app.post('/pdf', pdfUpload.array('files', 3), (req, res, next) =>
{
    res.json({ succeed: req.uids });
});

app.post('/images', imgUpload.single('imgs'), (req, res, next) =>
{
    let thumbnail = `${req.uid}-thumbnail.${req.uidEnd}`;
    let preview = `${req.uid}-preview.${req.uidEnd}`;
    let dir = `./uploads/images/`;
    sharp(`${dir}${req.uidName}`).resize(300,180).toFile(`${dir}${thumbnail}`);
    sharp(`${dir}${req.uidName}`).resize(800,600).toFile(`${dir}${preview}`);
    res.json({ succeed: [req.uidName, thumbnail, preview] });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));