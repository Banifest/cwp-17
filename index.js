const express = require('express');
const multer  = require('multer');
const uuid = require('uuid-v4');


const storage = multer.diskStorage({
                                       destination: './uploads/',
                                       filename: function (req, file, cb) {
                                           cb(null, file.originalname);
                                       }
                                   });

const pdfStorage = multer.diskStorage({
                                       destination: './uploads/pdf',
                                       filename: function (req, file, cb) {
                                           cb(null, uuid());
                                       }
                                   });


const upload = multer({ storage: storage });
const pdfUpload = multer({ storage: pdfStorage, /*fileFilter: 'pdf'*/});

const app = express();
app.use(express.static('static'));

app.post('/upload', upload.single('file'), (req, res, next) => {
    res.json({ succeed: true });
});

app.post('/pdf', pdfUpload.array({name:'file', maxCount: 3}), (req, res, next) => {
    res.json({ succeed: true });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));