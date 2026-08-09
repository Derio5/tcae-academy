const boton = document.getElementById("btnComenzar");
const contenedor = document.getElementById("app");
const selectorTema = document.getElementById("tema");

let preguntas = [];
let indice = 0;
let aciertos = 0;
let respuestasUsuario = [];


// ========================================
// INICIAR EXAMEN
// ========================================

boton.addEventListener("click", cargarTema);


async function cargarTema() {

    const temaSeleccionado = selectorTema.value;

    try {

        const respuesta = await fetch(
            `data/${temaSeleccionado}.json`
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo cargar el archivo JSON"
            );
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

                <p>
                    No se pudo cargar el test.
                </p>

                <p>
                    Comprueba que el archivo
                    <strong>${temaSeleccionado}.json</strong>
                    exista dentro de la carpeta
                    <strong>data</strong>.
                </p>

            </div>
        `;
    }
}


// ========================================
// MOSTRAR PREGUNTA
// ========================================

function mostrarPregunta() {

    if (indice >= preguntas.length) {

        mostrarResultado();

        return;
    }

    const pregunta = preguntas[indice];

    const opciones = Object.entries(
        pregunta.opciones
    );

    contenedor.innerHTML = `

        <div class="card">

            <h2>
                Pregunta ${indice + 1}
                de ${preguntas.length}
            </h2>

            <p class="pregunta">
                ${pregunta.pregunta}
            </p>

            <div class="opciones">

                ${opciones.map(([letra, texto]) => `

                    <button
                        class="opcion"
                        onclick="responder('${letra}')">

                        ${letra}) ${texto}

                    </button>

                `).join("")}

            </div>

        </div>
    `;
}


// ========================================
// REGISTRAR RESPUESTA
// ========================================

function responder(opcionSeleccionada) {

    const pregunta = preguntas[indice];

    const respuestaCorrecta =
        pregunta.correcta;

    const correcta =
        opcionSeleccionada === respuestaCorrecta;

    if (correcta) {
        aciertos++;
    }

    respuestasUsuario.push({

        pregunta: pregunta,

        respuestaUsuario:
            opcionSeleccionada,

        respuestaCorrecta:
            respuestaCorrecta,

        correcta:
            correcta
    });

    indice++;

    mostrarPregunta();
}


// ========================================
// MOSTRAR RESULTADO
// ========================================

function mostrarResultado() {

    const porcentaje =
        Math.round(
            (aciertos / preguntas.length) * 100
        );

    contenedor.innerHTML = `

        <div class="card resultado">

            <h2>
                Resultado del test
            </h2>

            <div class="puntuacion">

                ${aciertos} / ${preguntas.length}

            </div>

            <p>

                Has obtenido un
                <strong>${porcentaje}%</strong>
                de aciertos.

            </p>

            <div id="revisionErrores"></div>

            <br>

            <button onclick="reiniciarTest()">

                Volver a realizar el test

            </button>

        </div>
    `;

    mostrarErrores();
}


// ========================================
// MOSTRAR PREGUNTAS FALLADAS
// ========================================

function mostrarErrores() {

    const contenedorErrores =
        document.getElementById(
            "revisionErrores"
        );

    if (!contenedorErrores) {
        return;
    }

    const errores =
        respuestasUsuario.filter(
            respuesta => !respuesta.correcta
        );


    // ====================================
    // TODAS CORRECTAS
    // ====================================

    if (errores.length === 0) {

        contenedorErrores.innerHTML = `

            <div class="todo-correcto">

                🎉 ¡Excelente!

                <p>
                    Has respondido correctamente
                    todas las preguntas.
                </p>

            </div>

        `;

        return;
    }


    // ====================================
    // TÍTULO DE ERRORES
    // ====================================

    let html = `

        <hr>

        <h2>
            Preguntas que has fallado
        </h2>

    `;


    // ====================================
    // RECORRER ERRORES
    // ====================================

    errores.forEach(error => {

        const pregunta =
            error.pregunta;

        const numeroPregunta =
            pregunta.id;

        const letraUsuario =
            error.respuestaUsuario;

        const letraCorrecta =
            error.respuestaCorrecta;


        const textoUsuario =
            pregunta.opciones[
                letraUsuario
            ];


        const textoCorrecto =
            pregunta.opciones[
                letraCorrecta
            ];


        /*
         * Estas dos propiedades todavía
         * no existen en tu JSON.
         *
         * Por ahora mostramos un mensaje
         * provisional.
         */

        const explicacion =
            pregunta.explicacion ||
            "La explicación de esta pregunta todavía no ha sido añadida.";


        const referencia =
            pregunta.referencia ||
            "";


        html += `

            <div class="error-pregunta">

                <h3>
                    Pregunta ${numeroPregunta}
                </h3>


                <p>

                    <strong>
                        ${pregunta.pregunta}
                    </strong>

                </p>


                <p>

                    ❌
                    <strong>
                        Tu respuesta:
                    </strong>

                    <br>

                    ${letraUsuario})
                    ${textoUsuario}

                </p>


                <p>

                    ✅
                    <strong>
                        Respuesta correcta:
                    </strong>

                    <br>

                    ${letraCorrecta})
                    ${textoCorrecto}

                </p>


                <div class="explicacion">

                    <strong>
                        📖 Explicación:
                    </strong>

                    <p>
                        ${explicacion}
                    </p>

                </div>


                ${
                    referencia
                    ?
                    `
                        <p>

                            <strong>
                                📚 Referencia legal:
                            </strong>

                            ${referencia}

                        </p>
                    `
                    :
                    ""
                }


            </div>

            <hr>

        `;
    });


    contenedorErrores.innerHTML =
        html;
}


// ========================================
// REINICIAR TEST
// ========================================

function reiniciarTest() {

    indice = 0;

    aciertos = 0;

    respuestasUsuario = [];

    mostrarPregunta();
}
