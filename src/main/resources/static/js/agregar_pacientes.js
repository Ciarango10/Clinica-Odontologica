const form = document.getElementById("agregarForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Datos del paciente
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const dni = document.getElementById("dni").value;
  const fechaIngreso = document.getElementById("fechaIngreso").value
  // Datos del domicilio
  const calle = document.getElementById("calle").value;
  const numero = document.getElementById("numero").value;
  const localidad = document.getElementById("localidad").value;
  const provincia = document.getElementById("provincia").value;

  // llamando al endpoint de agregar

  fetch(`/pacientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre, apellido, dni, fechaIngreso, domicilio: { calle, numero, localidad, provincia }}),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      Swal.fire({
        icon: 'success',
        title: 'Paciente agregado con éxito',
        showConfirmButton: false,
        timer: 2500
      });
      form.reset(); // Resetear el formulario
    })
    .catch((error) => {
      console.error("Error agregando al paciente:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al agregar el paciente',
      });
    });
});