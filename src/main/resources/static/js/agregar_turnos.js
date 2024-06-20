const form = document.getElementById("agregarForm");
const comboOdontologo = document.getElementById("cboOdontologo");
const comboPaciente = document.getElementById("cboPaciente");

function fetchPacientes() {
    fetch(`/pacientes`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Insertar los datos en el select
            data.forEach((paciente) => {
                comboPaciente.innerHTML += `<option value="${paciente.id}">${paciente.nombre} ${paciente.apellido}</option>`
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function fetchOdontologos() {
    fetch(`/odontologos`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Insertar los datos en el select
            data.forEach((odontologo) => {
                comboOdontologo.innerHTML += `<option value="${odontologo.id}">${odontologo.nombre} ${odontologo.apellido}</option>`
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Datos del turno
  const odontologo_id = document.getElementById("cboOdontologo").value;
  const paciente_id = document.getElementById("cboPaciente").value;
  const fecha = document.getElementById("fecha").value

  // Validamos que se elija un odontólogo existente
  if(odontologo_id == 0) {
    Swal.fire({
      icon: 'warning',
      title: 'El odontólogo es requerido',
      showConfirmButton: false,
      timer: 2500
    });
    return;
  }

  // Validamos que se elija un paciente existente
  if(paciente_id == 0) {
    Swal.fire({
      icon: 'warning',
      title: 'El paciente es requerido',
      showConfirmButton: false,
      timer: 2500
    });
    return;
  }

  // llamando al endpoint de agregar

  fetch(`/turnos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paciente_id, odontologo_id, fecha }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      Swal.fire({
        icon: 'success',
        title: 'Turno agregado con éxito',
        showConfirmButton: false,
        timer: 2500
      });
      form.reset(); // Resetear el formulario
    })
    .catch((error) => {
      console.error("Error agregando al turno:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al agregar el turno',
      });
    });
});

fetchOdontologos();
fetchPacientes();