

class GastosCombustible {

    // constructor
    constructor (tipo, fecha, km, precio)  {
        this.vehicleType = tipo;
        this.date = fecha;
        this.kilometers = km;
        this.precioViaje = precio;
    }

    // métodos
    convertToJSON() {
        var gastosJSON = JSON.stringify(this); 
        return gastosJSON;
    }
}



