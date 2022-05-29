
class Licuadora {
    constructor (yo, id, nombre, marca, modelo, estado, mensaje){
        this.yo = yo;
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.modelo = modelo;
        this.estado = estado;
        this.mensaje = mensaje;
    }

    mostrarInfo(){
        let imgLicuadora = "";
        if (this.estado == "Encendida") {
            imgLicuadora = `<div id="Lic-${this.id}" class="licuadora activa"><div id="${this.id}" class="licuadora-boton"></div></div>`;
        } else {
            imgLicuadora = `<div id="Lic-${this.id}" class="licuadora"><div id="${this.id}" class="licuadora-boton"></div></div>`;
        }
        let licuadoras = `<div class = "licCSS">${imgLicuadora}<h3 class="titulo">${this.nombre}</h3><h3 class="titulo">${this.marca} - ${this.modelo}</h3><h3 class="titulo">${this.mensaje}</h3></div>`;
        document.getElementById("contenedor").innerHTML+=licuadoras;
    }

    apagarEncender(){

        let sonidoLicuadora = document.querySelector("#licuadora-sonido");
        let sonidoBoton = document.querySelector ("#licuadora-boton-sonido");
        let imagenLicuadora = document.querySelector(`#Lic-${this.id}`);

        if (this.estado == "Encendida") {
            imagenLicuadora.classList.remove("activa");
            sonidoBoton.play();
            sonidoLicuadora.pause();
            sonidoLicuadora.currentTime = 0;
            this.estado = "Apagada";
            if (this.yo == this.id) {sonidoLicuadora.pause(); document.querySelector(".mensaje").innerHTML=`Apagaste tu Licuadora`;} 
            else {document.querySelector(".mensaje").innerHTML=`Le apagaste la Licuadora a ${this.nombre}`;}
        } else {
            imagenLicuadora.classList.add("activa");
            sonidoBoton.play();
            this.estado = "Encendida";
            if (this.yo == this.id) {sonidoLicuadora.play(); document.querySelector(".mensaje").innerHTML=`Encendiste tu Licuadora`;} 
            else {document.querySelector(".mensaje").innerHTML=`Le encendiste la Licuadora a ${this.nombre}`;}
        }

    }
}




const cargaInicialdeLicuadoras = async (sesionNombre='invitado', sesionMarca='Philco', sesionModelo='nn') => {   
    try { 
        const consulta = await fetch(`https://mikao.ar/api/Licuadoras/?no=${sesionNombre}&ma=${sesionMarca}&mo=${sesionModelo}`);
        if(consulta.status ===200){ console.log("Sesion iniciada"); console.log(`https://mikao.ar/api/Licuadoras/?no=${sesionNombre}&ma=${sesionMarca}&mo=${sesionModelo}`); 
        } else {console.log("BatiError desconocido");}
    } catch (error) {
    console.log(error.message)
    }
}

let licuadorasInstanciadas = [];
const cargarLicuadoras = async () => { 
    document.querySelector(".contenedor").innerHTML='';  
    try { 
        const consulta = await fetch(`https://mikao.ar/api/Licuadoras/`);
        if(consulta.status ===200){
            const datos = await consulta.json();
               datos.respuesta.forEach(licuadora =>{
                    licuadorasInstanciadas[licuadora.id] = 
                    new Licuadora (datos.yo, licuadora.id, licuadora.nombre, licuadora.marca, licuadora.modelo, licuadora.estado, licuadora.mensaje); 
                    licuadorasInstanciadas[licuadora.id].mostrarInfo()
                });
                document.querySelector(".mensaje").innerHTML=datos.mensaje;
        } else {console.log("BatiError desconocido");}
    } catch (error) {
    console.log(error.message)
    }
}


// INICIO DESCARGA DE LICUADORAS

window.addEventListener("load", () => { 


    // TOMO LOS DATOS DEL USUARIO
    var sesionNombre; while(true) { var valor = prompt('Ingresá tu NOMBRE:'); if (valor === '' || valor === null){ alert("No puede quedar vacío"); } else { sesionNombre = valor; break; } }
    let sesionMarca =  prompt("Ingresá la MARCA de tu Licuadora:");
    let sesionModelo =  prompt("Ingresá el MODELO:");
    
    // CREO LA SESION
    cargaInicialdeLicuadoras(sesionNombre, sesionMarca, sesionModelo);

    // BAJO LA INFO
    cargarLicuadoras();

    // SETEO LA PRUEBA DE CAMBIOS
    //IntervId = setInterval(cargarLicuadoras, 1000);

});

window.addEventListener("click", (e) => { 
    if (e.target.className == 'licuadora-boton') {
       licuadorasInstanciadas[e.target.id].apagarEncender();
    }
});







