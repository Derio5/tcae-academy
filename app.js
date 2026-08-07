const boton = document.getElementById("btnComenzar");
const contenedor = document.getElementById("app");

let preguntas = [];
let indice = 0;
let aciertos = 0;

boton.addEventListener("click", cargarTema);

async function cargarTema() {

    const tema = document.getElementById("tema").value;

    try {

        const respuesta = await fetch(`data/${tema}.json`);

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el tema.");
        }

        preguntas = await respuesta.json();

        indice = 0;
        aciertos = 0;

        mostrarPregunta();

    } catch (error) {

        contenedor.innerHTML = `
            <div class="card">
                <h2>Error</h2>
                <p>No se pudo cargar el examen.</p>
                <p>${error.message}</p>
            </div>
        `;
    }

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

    // Comparación sin importar mayúsculas/minúsculas
    if (
        respuesta.toUpperCase() ===
        preguntas[indice].correcta.toUpperCase()
    ) {
        aciertos++;
    }

    indice++;

    if(indice >= preguntas.length){

        const nota = ((aciertos / preguntas.length) * 10).toFixed(1);

        contenedor.innerHTML = `
            <div class="card">

                <h2>Examen terminado</h2>

                <h1>${nota}/10</h1>

                <p><strong>Aciertos:</strong> ${aciertos}</p>

                <p><strong>Errores:</strong> ${preguntas.length - aciertos}</p>

                <button onclick="location.reload()">
                    Volver al inicio
                </button>

            </div>
        `;

        return;

    }

    mostrarPregunta();

}
