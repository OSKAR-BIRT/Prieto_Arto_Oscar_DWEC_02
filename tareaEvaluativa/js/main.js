//import {GastosCombustible} from "./objetoGasto";
'use strict'


// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = 'js/tarifasCombustible.json';
let gastosJSONpath = 'js/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log(typeof tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }

    for (let i=0; i<gastosJSON.length; i++) {
        let tupla = gastosJSON[i];
        let fecha = new Date(tupla["date"]);
        let year = fecha.getFullYear();
        let precioViaje = tupla["precioViaje"];
        let acumuladoAnterior = aniosArray[year]
        aniosArray[year] = acumuladoAnterior + precioViaje;
        let etiquetaID = 'gasto' + year;
        document.getElementById(etiquetaID).innerText = aniosArray[year].toFixed(2);
    }
}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    let tipoVehiculo = document.getElementById('vehicle-type').value;
    let fecha = new Date(document.getElementById('date').value);
    let kilometros = parseFloat(document.getElementById('kilometers').value);
    let precioViaje = 0;

    // Buscamos en tarifasJSON el importe del km para la fecha y vehiculo referenciado
    // y calculamos el precio del viaje
    let tarifas = tarifasJSON.tarifas;
    for (let i = 0; i<tarifas.length; i++) {
        let elemento = tarifas[i];
        let year = elemento["anio"];
        if (fecha.getFullYear() == year) {
            let vehiculos = elemento["vehiculos"];
            let tarifa = vehiculos[tipoVehiculo];
            precioViaje = tarifa * kilometros;
        }
    }
    
    // Creamos el objeto a partir de la clase GastosCombustible y le asignamos los datos.
    let gasto = new GastosCombustible(tipoVehiculo, fecha, kilometros, precioViaje);

    // Añadimos el gasto a Gastos Recientes
    var li = document.createElement("li");
    var contenido = gasto.convertToJSON();
    li.appendChild(document.createTextNode(contenido));
    document.querySelector("#expense-list").appendChild(li);

    // Actualizamos el importe correspondiente al año del gasto añadido
    let etiqueta = "gasto" + fecha.getFullYear();
    let gastoActualizado = parseFloat(document.getElementById(etiqueta).innerText) + precioViaje;
    document.getElementById(etiqueta).innerText = gastoActualizado;
    
    // Limpiamos el formulario
    document.getElementById('fuel-form').reset();
}

