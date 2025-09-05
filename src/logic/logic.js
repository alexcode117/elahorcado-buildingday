//aqui va la logica

export const actualizarPalabra = (posiciones=[], letra="") => {
    semaforo=false;
    actualizar=localStorage.getItem("").split("");
    i=0;
    while(i<posiciones.length){
        if(posiciones[i]===letra){

            semaforo=true;
        }
        i++;
    }

    return semaforo
}