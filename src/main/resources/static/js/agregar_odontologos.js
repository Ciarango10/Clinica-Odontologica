const form = document.getElementById("agregarForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const matricula = document.getElementById("matricula").value;

  fetch(`/odontologos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre, apellido, nroMatricula: matricula }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      Swal.fire({
        icon: 'success',
        title: 'Odontólogo agregado con éxito',
        showConfirmButton: false,
        timer: 2500
      });
      form.reset(); // Resetear el formulario
    })
    .catch((error) => {
      console.error("Error agregando odontólogo:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al agregar el odontólogo',
      });
    });
});
