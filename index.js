const express = require('express');
const multer  = require('multer');
const uuid = require('uuid-v4');
const sharp = require('sharp');

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
                                              req.uidName = `${req.uid}-master.${file.mimetype.toString().substr(5)}`;
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

    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
    {
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

app.post('/upload', upload.single('file'), (req, res, next) => {
    res.json({ succeed: true });
});

app.post('/pdf', pdfUpload.array('files', 3), (req, res, next) =>
{
    res.json({ succeed: req.uids });
    uids = [];
});

app.post('/images', imgUpload.single('imgs'), (req, res, next) =>
{
    sharp(req)
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));