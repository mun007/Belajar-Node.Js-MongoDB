var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://munir:1234@127.0.0.1:27017/nodedb',
Collect = 'buku';

MongoClient.connect(url, {useNewUrlParser : true}, function(error, client){
    if(error){
        console.log('Koneksi ke server MongoDb Gagal');
        throw error;
    } 
    //Membuat Objek dari kelas Db
    var db = client.db(client.s.options.dbName);

    //Membuat koleksi dengan nama "buku"
    // db.createCollection('buku', function(err){
    //     if(err){
    //         console.log('Koleksi buku gagal dibuat');
    //         throw err;
    //     }
    //     console.log('Koleksi buku berhasil dibuat');
        
    // });

    var document = [
        {
            kode: 'B001',
            judul: 'Practical Node Js',
            penulis: 'Azat Mardat',
            penerbit: 'Apress'
        },
        {
            kode: 'B002',
            judul: 'Profelsional Node.Js',
            penulis: 'Pedro Teixeira',
            penerbit: 'wrox'
        },
        {
            kode: 'B003',
            judul: 'Mastering MariDB',
            penulis: 'Federico Razzoli',
            penerbit: 'PACK Publishing'
        },
        {
            kode: 'B004',
            judul: 'NodeJs Design Patterns',
            penerbit: 'PACK Publishing'
        }
    ];  
    
    var filter = { penerbit: 'PACK'};
    var newValue = {
        // $set: {
        //     judul: 'Mastering MongoDB',
        //     penulis: 'Alex Giamas'
        // }
        $set: {
            penerbit: 'PACK'
        }
    };

    // Menambah dokumen
    // db.collection('buku').insertOne(document, function(err,result){
    //     if(err)throw err;
    //     console.log('1 dokumen telah  ditambahkan ke dalam koleksi');
        
    // }); 
    
    // Menambah dokumen dengan banyak data
    // db.collection(Collect).insertMany(document,function (err,result) {
    //     if (err) throw err;
    //     console.log('%d Dokumen telah ditambahkan kedalam koleksi',result.insertedCount);
    //     console.log('\nIsi objek result :');
    //     console.log(result);
    //     client.close();
    // });
    
    // Mengubah satu dokumen
    // db.collection(Collect).updateOne(filter, newValue, function(err, result) {
    //     if(err) throw err;
    //     console.log('1 Dokumen didalam koleksi telah diubah');
    //     client.close();
    // });

    // Mengubah lebih dari sat dokumen
    // db.collection(Collect).updateMany(filter, newValue, function(err, result) {
    //     if(err) throw err;
    //     console.log(result.modifiedCount + ' Dokumen di dalam koleksi telah diubah');
    // client.close();
    // });
    
    // Menhapus banyak data
    // db.collection(Collect).deleteMany(filter, function(err, result) {
    //     if(err) throw err;
    //     console.log(' Dokumen telah dihapus')
    //     client.close();
    // });

    // Seleksi dokumen
    // db.collection(Collect).find().toArray(function (err, result) {
    //     if(err) throw err;
    //     console.log(result);
    //     client.close();
    // });

    // Seleksi dokumen berdasarkan kriteria
    db.collection(Collect).find(filter).toArray(function (err, result) {
        if(err) throw err;
        console.log(result);
    client.close();
    });
});