const boton = document.getElementById("btnComenzar");
const contenedor = document.getElementById("app");
const selectorTema = document.getElementById("tema");

let preguntas = [];
let indice = 0;
let aciertos = 0;
let respuestasUsuario = [];

// Iniciar examen
boton.addEventListener("click", cargarTema);

async function cargarTema() {

    const temaSeleccionado = selectorTema.value;

    try {

        const respuesta = await fetch(`data/${temaSeleccionado}.json`);

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el archivo JSON");
        }

        preguntas = await respuesta.json();

        indice = 0;
        aciertos = 0;
        respuestasUsuario = [];

        mostrarPregunta();

    } catch (error) {

        console.error(error);

        contenedor.innerHTML = `
            <div class="card">
                <h2>Error</h2>
                <p>No se pudo cargar el test.</p>
                <p>Comprueba que el archivo JSON exista dentro de la carpeta <strong>data</strong>.</p>
            </div>
        `;
    }
}


// Mostrar pregunta
function mostrarPregunta() {

    if (indice >= preguntas.length) {
        mostrarResultado();
        return;
    }

    const pregunta = preguntas[indice];

    contenedor.innerHTML = `

        <div class="card">

            <h2>Pregunta ${indice + 1} de ${preguntas.length}</h2>

            <p class="pregunta">
                ${pregunta.pregunta}
            </p>

            <div class="opciones">

                ${pregunta.opciones.map((opcion, i) => `
                    
                    <button 
                        class="opcion"
                        onclick="responder(${i})">
                        ${String.fromCharCode(65 + i)}) ${opcion}
                    </button>

                `).join("")}

            </div>

        </div>
    `;
}


// Registrar respuesta
function responder(opcionSeleccionada) {

    const pregunta = preguntas[indice];

    const respuestaCorrecta = obtenerRespuestaCorrecta(pregunta);

    const correcta = opcionSeleccionada === respuestaCorrecta;

    if (correcta) {
        aciertos++;
    }

    respuestasUsuario.push({
        pregunta: pregunta,
        respuestaUsuario: opcionSeleccionada,
        respuestaCorrecta: respuestaCorrecta,
        correcta: correcta
    });

    indice++;

    mostrarPregunta();
}


// Obtener respuesta correcta
function obtenerRespuestaCorrecta(pregunta) {

    let respuesta = pregunta.respuesta;

    // Si el JSON utiliza respuestaCorrecta
    if (respuesta === undefined) {
        respuesta = pregunta.respuestaCorrecta;
    }

    // Si viene como letra: A, B, C, D
    if (typeof respuesta === "string") {

        const letra = respuesta.trim().toUpperCase();

        if (["A", "B", "C", "D"].includes(letra)) {
            return letra.charCodeAt(0) - 65;
        }

        // Si viene como número escrito
        if (!isNaN(respuesta)) {
            respuesta = Number(respuesta);
        }
    }

    return Number(respuesta);
}


// Mostrar resultado final
function mostrarResultado() {

    const porcentaje = Math.round((aciertos / preguntas.length) * 100);

    contenedor.innerHTML = `

        <div class="card resultado">

            <h2>Resultado del test</h2>

            <div class="puntuacion">
                ${aciertos} / ${preguntas.length}
            </div>

            <p>
                Has obtenido un <strong>${porcentaje}%</strong> de aciertos.
            </p>

            ${
                aciertos === preguntas.length
                ? `
                    <div class="todo-correcto">
                        🎉 ¡Excelente! Has respondido correctamente
                        todas las preguntas.
                    </div>
                `
                : `
                    <h2 class="titulo-errores">
                        Preguntas que has fallado
                    </h2>

                    <div id="errores"></div>
                `
            }

            <button onclick="reiniciarTest()">
                Volver a realizar el test
            </button>

        </div>
    `;

    mostrarErrores();
}


// Mostrar preguntas incorrectas
function mostrarErrores() {

    const contenedorErrores = document.getElementById("errores");

    if (!contenedorErrores) {
        return;
    }

    const errores = respuestasUsuario.filter(
        respuesta => !respuesta.correcta
    );

    if (errores.length === 0) {
        return;
    }

    contenedorErrores.innerHTML = errores.map((error, posicion) => {

        const pregunta = error.pregunta;

        const letraUsuario =
            String.fromCharCode(65 + error.respuestaUsuario);

        const letraCorrecta =
            String.fromCharCode(65 + error.respuestaCorrecta);

        const explicacion =
            pregunta.explicacion ||
            "No se ha añadido una explicación para esta pregunta.";

        const referencia =
            pregunta.referencia ||
            "";

        return `

            <div class="error-pregunta">

                <h3>
                    Pregunta ${respuestasUsuario.indexOf(error) + 1}
                </h3>

                <p class="texto-pregunta">
                    <strong>${pregunta.pregunta}</strong>
                </p>

                <div class="respuesta-incorrecta">

                    ❌ <strong>Tu respuesta:</strong>

                    <br>

                    ${letraUsuario}) 
                    ${pregunta.opciones[error.respuestaUsuario]}

                </div>

                <div class="respuesta-correcta">

                    ✅ <strong>Respuesta correcta:</strong>

                    <br>

                    ${letraCorrecta}) 
                    ${pregunta.opciones[error.respuestaCorrecta]}

                </div>

                <div class="explicacion">

                    <strong>📖 Explicación:</strong>

                    <p>
                        ${explicacion}
                    </p>

                    ${
                        referencia
                        ? `
                            <p class="referencia">
                                <strong>Referencia:</strong>
                                ${referencia}
                            </p>
                        `
                        : ""
                    }

                </div>

            </div>

        `;

    }).join("");
}


// Reiniciar test
function reiniciarTest() {

    indice = 0;
    aciertos = 0;
    respuestasUsuario = [];

    mostrarPregunta();
}
