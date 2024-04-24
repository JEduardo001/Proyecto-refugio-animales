import express from 'express';
//con esta libreria podras trabajar con archivos que esten en este proyecto
import fs, { read } from "fs";
import bodyParser from "body-parser";


const app = express();

app.use(bodyParser.json());

//leemos los datos del archivo db.json con ./ indicamos que esta en la raiz del proyecto
const readData = () =>{
    try{
        const data  = fs.readFileSync("./db.json");
        return JSON.parse(data);
    }catch (error){
        console.log("error"); 
    }  
}
//console.log(readData());



const writeData = (dato) =>{
    try{
       fs.writeFileSync("./db.json",JSON.stringify(dato))
    }catch (error){
        console.log("error"); 
    }  
}

//una peticion http o un metodo get. esto es un endpoint. req es una requisicion y res la respuesta
/*app.get("/",(req,res)=>{
    //usamos res para responder con .send
    res.send("holaa mundo");
})*/



app.get("/gatos",(req,res)=>{
    const data = readData();
    //respondemos con una estructura .json... respondemos con la estrucutra gatos 
    //osea en la pagina se vera la estrucutra gatos de nuestro archivo db.json
    //lo mismo que hicimos en consola pero ahora lo mostramos en la pagina
    res.json(data.gatos);
})
//atravez de la url pasamos un parametro que es el id osea buscamos un gato por su id
app.get("/gatos/:id",(req,res)=>{
    const data = readData();
    const id =parseInt(req.params.id); //obtenemos el id
    const gato = data.gatos.find((gato) => gato.IdMascota === id); //regresa el libro buscado
    res.json(gato);
})



//agregamos un nuevo gato
app.post("/gatos", (req,res) => {
    const data = readData();
    const body = req.body; // extraemos el cuerpo 
    const newGato = {
        id: data.gatos.length +1, //generamos un nuevo id para ponerselo al nuevo gato
        ...body,// con esto decimos que todo lo que venga en body lo agrege al nuevo gato para 
        //no ponerle un nuevo nombre y sus demas datos
    }
    data.gatos.push(newGato)//agregamos el nuevo gato
    writeData(data)
    res.json(newGato)
})
//actualizar un gato
app.put("/gatos/:id",(req,res) =>{
    const data = readData()
    const body = req.body;
    const id = parseInt(req.params.id);
    const gatoIndex = data.gatos.findIndex((gato) => gato.IdMascota === id); // buscamos el libro el index del array y preguntamos
    // si ese esa posicion del libro tiene el id ue estamos buscando
    data.gatos[gatoIndex]= { //para ese libro que acabo de encontrar lo modifico
        ...data.gatos[gatoIndex], // todos los datos del libro voy a modificar
        ...body // los voy a cambiar por estos nuevos 
    };
    writeData(data);
    res.json({message: "todo bien"});

})

//borrar un perro
app.delete("/perros/:id",(req,res) =>{
    const data = readData()
    const id = parseInt(req.params.id);
    const perroIndex = data.perros.findIndex((perro) => perro.id === id); 
    data.perros.splice(perroIndex,2) //borramos el libro con el index 2 va a borrar a partir del 
    //id 2 en adelante

    writeData(data); //volvemos a poner le mismo arreglo pero sin el libro borrado
    //osea borramos el libro y lo que quedo lo volvemos a poner en el archivo
    res.json({message: "perro borrado"});

})


app.listen(3000, () =>{
    console.log("el servidor esta activo en el puerto 3000");
});  //con estas 4 lineas ya tendriamos vivo el servidor








//ejemplo de las bases de datos 

/*-- Tabla MASCOTAS_GATOS
CREATE TABLE MASCOTAS_GATOS (
    IdMascota INT PRIMARY KEY,
    nombreMascota VARCHAR(100),
    edad INT,
    raza VARCHAR(100),
    fotoMascota VARCHAR(255)
);

-- Tabla MASCOTAS_PERROS
CREATE TABLE MASCOTAS_PERROS (
    IdMascota INT PRIMARY KEY,
    nombreMascota VARCHAR(100),
    edad INT,
    raza VARCHAR(100),
    fotoMascota VARCHAR(255)
);

-- Tabla MASCOTAS_EN_ADOPCION
CREATE TABLE MASCOTAS_EN_ADOPCION (
    idMascota INT PRIMARY KEY,
    categoria VARCHAR(100)
);

-- Tabla CONTROL_DE_VACUNAS
CREATE TABLE CONTROL_DE_VACUNAS (
    IdMascota INT,
    categoria VARCHAR(100),
    vacuna_rabia BOOLEAN,
    vacuna_parvovirosis BOOLEAN,
    PRIMARY KEY (IdMascota, categoria),
    FOREIGN KEY (IdMascota) REFERENCES MASCOTAS_EN_ADOPCION(idMascota)
);

-- Tabla REPORTE_DE_MASCOTAS
CREATE TABLE REPORTE_DE_MASCOTAS (
    idMascota INT,
    categoria VARCHAR(100),
    maltrato BOOLEAN,
    perdido BOOLEAN,
    PRIMARY KEY (idMascota, categoria),
    FOREIGN KEY (idMascota) REFERENCES MASCOTAS_EN_ADOPCION(idMascota)
);

-- Tabla SEGUIMIENTO_DE_REPORTE
CREATE TABLE SEGUIMIENTO_DE_REPORTE (
    idMascota INT,
    categoria VARCHAR(100),
    adoptado BOOLEAN,
    fechaIngreso DATE,
    PRIMARY KEY (idMascota, categoria),
    FOREIGN KEY (idMascota) REFERENCES MASCOTAS_EN_ADOPCION(idMascota)
);

-- Tabla MASCOTAS_ADOPTADAS
CREATE TABLE MASCOTAS_ADOPTADAS (
    idMascota INT PRIMARY KEY,
    categoria VARCHAR(100),
    fechaAdopcion DATE,
    nombreTutor VARCHAR(100),
    telefonoTutor VARCHAR(20),
    emailTutor VARCHAR(100)
);

-- Tabla USUARIOS_ADMINISTRADORES
CREATE TABLE USUARIOS_ADMINISTRADORES (
    idUsuario INT PRIMARY KEY,
    telefono VARCHAR(20),
    email VARCHAR(100),
    nombre VARCHAR(100),
    apellidoPaterno VARCHAR(100),
    apellidoMaterno VARCHAR(100)
);*/
