
const formulario = document.getElementById("formularioCreado") as HTMLFormElement;
const numeroPersonas = document.getElementById("numeroPersonas") as HTMLSelectElement;
const tipoActividad = document.getElementById("tipoActividad") as HTMLSelectElement;
const resultadosDiv = document.getElementById("resultados") as HTMLDivElement;

formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  const participantes = numeroPersonas.value;
  const tipo = tipoActividad.value;

  const apiUrl = `/api/filter?type=${tipo}&participants=${participantes}`;

  const obtenerActividad = new Promise((resolve, reject) => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error en la API de actividades: ${response.statusText}`);
        }
        return response.json();
      })
      .then((actividades) => {
        if (actividades.length === 0) {
          reject("No se encontraron actividades con esos parámetros.");
        } else {
          const actividad = actividades[Math.floor(Math.random() * actividades.length)];
          resolve(actividad);
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });

  obtenerActividad
    .then((actividad: any) => {
      const apiPixabayUrl = `https://pixabay.com/api/?key=47242931-1f78372e8a46d4b8129a1913a&category=${tipo}&image_type=photo`;

      return fetch(apiPixabayUrl)
        .then((response) => {
         
          return response.json();
        })
        .then((data) => {
         
          const randomIndex = Math.floor(Math.random() * data.hits.length); 
          return { actividad, imagen: data.hits[randomIndex].webformatURL };
        });
    })
    .then(({ actividad, imagen }) => {
      resultadosDiv.innerHTML = "";

      const actividadElemento = document.createElement("div");
      actividadElemento.classList.add("card", "mb-3");
      actividadElemento.innerHTML = `
        <img src="${imagen}" class="card-img-top" alt="Imagen de actividad">
        <div class="card-body">
          <p class="text-primary fw-bold">Nombre Actividad: ${actividad.activity}</p>
          <p class="text-secondary">Tipo Actividad: ${actividad.type}</p>
          <p class="text-muted">Participantes: ${actividad.participants}</p>
          <p class="text-info">Precio: $${actividad.price}</p>
          <p class="text-warning">Dificultad: ${actividad.accessibility}</p>
        </div>
      `;

      resultadosDiv.appendChild(actividadElemento);
    })
    .catch((error) => {
      resultadosDiv.innerHTML = `<p class="text-danger">${error}</p>`;
    });
});

