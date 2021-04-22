var express = require('express');
var proizvodiServis=require('proizvodi');
var app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/',(request, response)=>{
    response.send("Server radi");
});

app.get('/sviProizvodi',(request, response)=>{
    response.send(proizvodiServis.sviProizvodi())
});

app.post('/dodajProizvod',(request, response)=>{
    proizvodiServis.dodajProizvod(request.body);
    response.end("OK");
})

app.post('/izmeniProizvod/:id/:naziv/:kategorija/:cena/:oznake/:opis',(request, response)=>{
    proizvodiServis.izmeniProizvod(request.params["id"],request.params["naziv"],request.params["kategorija"],request.params["cena"],request.params["oznake"],request.params["opis"]);
    response.end("OK");
});

app.delete('/obrisiProizvod/:id',(request, response)=>{
    proizvodiServis.izbrisiProizvod(request.params["id"]);
    response.end("OK");
});

app.get('/pretraziProizvodPoKategoriji',(request, response)=>{
    response.send(proizvodiServis.pretraziProizvodPoKategoriji(request.query["kategorija"]));
});

app.get('/getProizvodById/:id',(request, response)=>{
    response.send(proizvodiServis.getProizvod(request.params["id"]));
})


app.listen(port,()=>{console.log(`startovan server na portu ${port}`)});