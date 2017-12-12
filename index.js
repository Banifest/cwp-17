const express = require('express');
const multer  = require('multer');
const uuid = require('uuid-v4');


let uids = [];
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
                                           uids.push(id);
                                           cb(null, id);
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

const upload = multer({ storage: storage });
const pdfUpload = multer({ storage: pdfStorage, fileFilter: pdfFilter});

const app = express();
app.use(express.static('static'));

app.post('/upload', upload.single('file'), (req, res, next) => {
    res.json({ succeed: true });
});

app.post('/pdf', pdfUpload.array('files', 3), (req, res, next) =>
{
    res.json({ succeed: uids });
    uids = [];
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));