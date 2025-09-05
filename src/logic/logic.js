//aqui va la logica

export const actualizarPalabra = (posiciones=[], letra="") => {
    semaforo=false;
    let actualizar=localStorage.getItem('adivinar');
    i=0;
    while(i<posiciones.length){
        actualizar[posiciones[i]]=letra;
        semaforo=true;
        i++;
    }
    localStorage.setItem('adivinar', actualizar);
    return semaforo
}
export const guardarPalabra = (posiciones=[], letra="") => {
    semaforo=false;
    palabra=getRandomNamePokemon({ minLength:5 })
    localStorage.setItem('palabra', palabra);
    let i=0;let characters="";
    while(i<palabra.length){
        characters+="_";
        i++;
    }
    localStorage.setItem('adivinar', characters);
    return true;
}
