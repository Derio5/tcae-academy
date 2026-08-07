let preguntas=[],i=0,a=0;async function iniciar(){preguntas=await fetch(document.getElementById('tema').value).then(r=>r.json());i=0;a=0;mostrar()}function mostrar(){let p=preguntas[i],h=`<h2>${i+1}/${preguntas.length}</h2><p>${p.pregunta}</p>`;for(let k of ['A','B','C','D'])h+=`<button onclick="resp('${k}')">${k}. ${p.opciones[k]}</button><br>`;app.innerHTML=h}function resp(r){if(r===preguntas[i].correcta)a++;i++;if(i>=preguntas.length)app.innerHTML=`<h2>Nota ${(a/preguntas.length*10).toFixed(1)}</h2>`;else mostrar()}const boton = document.getElementById("btnComenzar");
const contenedor = document.getElementById("app");

let preguntas = [];
let indice = 0;
let aciertos = 0;

boton.addEventListener("click", cargarTema);

async function cargarTema() {

    const respuesta = await fetch("data/tema01.json");
    preguntas = await respuesta.json();

    indice = 0;
    aciertos = 0;

    mostrarPregunta();

}

function mostrarPregunta() {

    const pregunta = preguntas[indice];

    contenedor.innerHTML = `
        <div class="card">
            <h2>Pregunta ${indice + 1} de ${preguntas.length}</h2>

            <p style="margin:20px 0;font-size:20px;">
                ${pregunta.pregunta}
            </p>

            ${crearBoton("A", pregunta.opciones.A)}
            ${crearBoton("B", pregunta.opciones.B)}
            ${crearBoton("C", pregunta.opciones.C)}
            ${crearBoton("D", pregunta.opciones.D)}
        </div>
    `;

}

function crearBoton(letra, texto){

    return `
        <button onclick="responder('${letra}')">
            ${letra}. ${texto}
        </button><br><br>
    `;

}

function responder(respuesta){

    if(respuesta === preguntas[indice].correcta){
        aciertos++;
    }

    indice++;

    if(indice >= preguntas.length){

        const nota = ((aciertos / preguntas.length) * 10).toFixed(1);

        contenedor.innerHTML = `
            <div class="card">

                <h2>Examen terminado</h2>

                <h1>${nota}/10</h1>

                <p>Aciertos: ${aciertos}</p>

                <p>Errores: ${preguntas.length-aciertos}</p>

            </div>
        `;

        return;

    }

    mostrarPregunta();

}
