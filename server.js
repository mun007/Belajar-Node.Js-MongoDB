var http = require('http');      // Import internal module http
var qs = require('querystring'); // Import internal module queryParser
var pug = require('pug');        // Import ekternal pug engine template
var url = require('url');        // Import internal module url
let myCollect = 'buku';        // Nama koleksi / tabel
var mongoClient = require('mongodb').MongoClient;

//Alamat directory template pug
var listPug = './template/list.pug'; 
var addFormPug = './template/addForm.pug';
var editFormPug = './template/editForm.pug';

// Variable yang menyimpan url login akun mongoDB beserta nama Database 
var connectionString = 'mongodb://munir:1234@127.0.0.1/nodedb',collect ='buku';
var connectionOption = {useNewUrlParser: true};

// Create connection dengan memanggil metode connect()
mongoClient.connect(connectionString, connectionOption,function (dbConnectError, client) {
   if(dbConnectError) throw dbConnectError;
   var db = client.db(client.s.options.dbName);

   // Create server yang menlayani request client
   var server = http.createServer(function (req,res){
      res.writeHead(200,{'Content-Type': 'text/html'});

      // Jika request (alamat /) 
      if(req.url === '/'){
         // Maka merespon/menampilkan data (collection) buku dalam bentuk array (.toArray)
         db.collection(myCollect).find().toArray(function (error, result) {
            if (error) throw error;
            // Variable yang menampung hasil render pug dan data query buku (.find())
            var template = pug.renderFile(listPug, {books: result});
            res.end(template);
         });
      }else if(req.url === '/add'){
         // Switch request jenis method
         switch (req.method){
            case 'GET':
               var template = pug.renderFile(addFormPug)
               res.end(template);
            break;
            case 'POST':
               var body = '';

               // Menangkap data yang di post form
               req.on('data', function(data) {
                  // Menampung data yang ditangkap ke dalam variable body
                  body += data;
               });
               // Penangan event End
               req.on('end', function () {
                  var form = qs.parse(body);
                  var newDocument = {
                     kode: form['buku_id'],
                     judul: form['judul_buku'],
                     penulis: form['penulis_buku'],
                     penerbit: form['penerbit_buku']
                  };
                  db.collection('buku').insertOne(newDocument, function(err, result) {
                     if(err) throw err;
                      // "location" berguna untuk me-redirect ke root halaman
                     res.writeHead(302,{'Location': '/'});
                     res.end();
                  });
               });
            break;
         }// Switch Method
         // "url.parse()" untuk memisah(parse) 
      }else if(url.parse(req.url).pathname === '/edit'){
         switch (req.method) {
            case 'GET':
               // "qs.parse()" untuk memisah url dengan parameter "id"
               var id = qs.parse(url.parse(req.url).query).id;
               // "filter" untuk menampung var id kedalam array asc (kode)
               var filter = { kode: id };

               // Mencari data berdasarkan kode buku dengan parameter filter
               db.collection(myCollect).find(filter).toArray( function(error, result) {
                  if (error) throw error;
                  var template = pug.renderFile(editFormPug, { book:result[0]});

                  res.end(template);
               });
            break;
            case 'POST':
               var body = '';

               req.on('data', function(data){
                  body += data;
               });

               req.on('end',function(){
                  var form = qs.parse(body);
                  var filter = { kode: form['buku_id']};
                  var newValue = {
                     $set: {
                        judul:form['judul_buku'],
                        penulis: form['penulis_buku'],
                        penerbit: form['penerbit_buku']
                     }
                  };

                  db.collection(myCollect).updateOne(filter, newValue, function(err, result) {
                     if (err) throw err;
                     res.writeHead(302,{'Location': '/'});
                     res.end();
                  });
               });
            break;
         }
      }else if(url.parse(req.url).pathname === '/hapus') {
         var id = qs.parse(url.parse(req.url).query).id;
         var filter = { kode: id };
         db.collection(myCollect).deleteOne(filter, function(error, result) {
            if (error) throw error;           
            res.writeHead(302, {'Location': '/'});
            res.end();
         });
      }
   });

   // Port Server 
   server.listen(3000);
   console.log('Server aktif di http://localhost:3000');
});

// var server = http.createServer(function (request, response) {
//    var data = {nama: 'Krisna wisnu',daftar:['satu','dua','tiga']};
//    var template = pug.renderFile('./template/belajar.pug',data) 

//    response.end(template);
// });