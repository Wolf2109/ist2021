const express = require("express");
const fs=require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const { response } = require("express");
const port = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let procitajPogledZaNaziv=(naziv)=>{
    return fs.readFileSync(path.join(__dirname+"/view/"+naziv+".html"),"utf-8")
}

app.get("/",(req,res)=>{
    res.send(procitajPogledZaNaziv("index"));
});

app.get("/sviProizvodi",(req,res)=>{
    
    axios.get('http://localhost:3000/sviProizvodi')
    .then(response => {
        let prikaz="";
        response.data.forEach(element => {
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.naziv}</td>
            <td>${element.cena} RSD</td>
            <td><a href="/izmeni/${element.id}" id="izmeni">Izmeni</a></td>
            <td><a href="/detaljnije/${element.id}" id="detaljnije">Detaljnije</a></td>
            <td><a href="/obrisi/${element.id}" id="obrisi">Obrisi</a></td>
        </tr>`;
        });
        res.send(procitajPogledZaNaziv("sviproizvodi").replace("#{data}",prikaz));
    })
    .catch(error => {
        console.log(error);
    });
    
    
});

app.get("/detaljnije/:id",(req,res)=>{
    axios.get(`http://localhost:3000/getProizvodById/${req.params["id"]}`)
    .then(response=>{
        let prikaz="";
            prikaz+=`
            <td>Oznake</td>
            <td>Opis</td>
            </tr>
            <tr>
            <td>${response.data.id}</td>
            <td>${response.data.naziv}</td>
            <td>${response.data.cena} RSD</td>
            <td>${response.data.oznake}</td>
            <td>${response.data.opis}</td>
            <td><a href="/izmeni/${response.data.id}" id="izmeni">Izmeni</a></td>
            <td><a href="/obrisi/${response.data.id}" id="obrisi">Obrisi</a></td>
        </tr>`;
        res.send(procitajPogledZaNaziv("sviproizvodi").replace("#{data}",prikaz));
    })
    .catch(error => {
        console.log(error);
    });
});


app.get("/obrisi/:id",(req,res)=>{
    axios.delete(`http://localhost:3000/obrisiProizvod/${req.params["id"]}`)
    res.redirect("/sviProizvodi");
});

app.get("/dodajProizvod",(req,res)=>{
    res.send(procitajPogledZaNaziv("formazadodavanje"));
});

app.post("/snimiProizvod",(req,res)=>{
    axios.post("http://localhost:3000/dodajProizvod",{
        naziv:req.body.naziv,
        kategorija:req.body.kategorija,
        cena:req.body.cena,
        oznake:req.body.oznake,
        opis:req.body.opis
    })
    res.redirect("/sviProizvodi");
})

app.post("/pretraziProizvodPoKategoriji",(req,res)=>{
    axios.get(`http://localhost:3000/pretraziProizvodPoKategoriji?kategorija=${req.body.kategorija}`)
    .then(response=>{
        let prikaz="";
        response.data.forEach(element => {
            prikaz+=`
            <tr>
            <td>${element.id}</td>
            <td>${element.naziv}</td>
            <td>${element.cena}</td>
            <td><a href="/izmeni/${element.id}" id="izmeni">Izmeni</a></td>
            <td><a href="/detaljnije/${element.id}" id="detaljnije">Detaljnije</a></td>
            <td><a href="/obrisi/${element.id}" id="obrisi">Obrisi</a></td>
        </tr>`;
        });
        res.send(procitajPogledZaNaziv("sviproizvodi").replace("#{data}",prikaz));
    })
});

app.get("/izmeni/:id",(req,res)=>{
    axios.get(`http://localhost:3000/getProizvodById/${req.params["id"]}`)
    .then(response=>{
        let prikaz="";
            prikaz+=`
            <br>
            Izabrani proizvod: ${response.data.naziv}
            <br>
            <br>
            <form action="/snimiIzmenjenProizvod" method="post">
        ID proizvoda: <input type="text" name="id" value="${response.data.id}" readonly>
        <br>
        <br>
        Naziv proizvoda: <input type="text" name="naziv" value="${response.data.naziv}">
        <br>
        <br>
        Kategorija: <input type="text" name="kategorija" value="${response.data.kategorija}">
        <br>
        <br>
        Cena <input type="number" name="cena" min="0" value="${response.data.cena}">
        <br>
        <br>
        Oznake: <input type="text" name="oznake" value="${response.data.oznake}">
        <br>
        <br>
        Opis: 
        <br>
        <textarea name="opis" minlength="10" maxlength="180"
        rows="6" cols="33" placeholder="Unesite opis proizvoda">${response.data.opis}</textarea>
        <br>
        <p>Minimalan broj karaktera 10, maksimalan broj karaktera 180.</p>
        <br>
        <button type="submit">Izmeni proizvod</button>
    </form>`;
        res.send(procitajPogledZaNaziv("sviproizvodi").replace("#{data}",prikaz));
    })
    .catch(error => {
        console.log(error);
    });
});

app.post("/snimiIzmenjenProizvod",(req,res)=>{
    axios.post(`http://localhost:3000/izmeniProizvod/${req.body["id"]}/${req.body["naziv"]}/${req.body["kategorija"]}/${req.body["cena"]}/${req.body["oznake"]}/${req.body["opis"]}`)
    res.redirect("/sviProizvodi");
})

app.listen(port,()=>{console.log(`klijent na portu ${port}`)});