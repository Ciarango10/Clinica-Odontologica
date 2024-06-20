const tableBody = document.querySelector("#turnosTable tbody");
const form = document.getElementById("editarForm");
const comboOdontologo = document.getElementById("cboOdontologoEdit");
const comboPaciente = document.getElementById("cboPacienteEdit");
let idTurno = null;

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

function fetchTurnos() {
    fetch(`/turnos`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Limpiar el contenido actual de la tabla
            tableBody.innerHTML = "";

            // Insertar los datos en la tabla
            data.forEach((turno) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                        <td>${turno.id}</td>
                        <td>${turno.odontologo.nombre} ${turno.odontologo.apellido}</td>
                        <td>${turno.paciente.nombre} ${turno.paciente.apellido}</td>
                        <td>${turno.fecha}</td>

                        <td>
                            <button class="btn btn-sm"style="background-color: #a6dcef;" data-bs-toggle="modal" data-bs-target="#editarTurno" onclick="editTurno(${turno.id},
                                '${turno.paciente.id}', '${turno.odontologo.id}', '${turno.fecha}')"><i class="fas fa-edit mx-2"></i>Modificar</button>
                            <button class="mx-4 btn btn-sm"style="background-color: #ef9a9a;" onclick="deleteTurno(${turno.id})"><i class="fas fa-trash-alt mx-2"></i>Eliminar</button>
                        </td>
                    `;

                tableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Modificar un Turno
function editTurno(id, paciente_id, odontologo_id, fecha) {
    //Cargamos el valor del id en la variable global
    idTurno = id;
    //Cargamos los valores a la ventana modal

    // Datos del turno
    comboPaciente.value = paciente_id;
    comboOdontologo.value = odontologo_id;
    document.querySelector("#fechaEdit").value = fecha;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Datos del turno
    const paciente_id = comboPaciente.value;
    const odontologo_id = comboOdontologo.value;
    const fecha = document.getElementById("fechaEdit").value;

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

    // llamando al endpoint de editar
    fetch(`/turnos/${idTurno}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ paciente_id, odontologo_id, fecha })
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        fetchTurnos();
        var modalElement = document.getElementById('editarTurno');
        var modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Turno modificado con éxito',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
        });
    })
    .catch((error) => {
        console.error("Error modificando Turno:", error);
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Hubo un problema al modificar el turno',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
        });
    });
});

// Eliminar un Turno
function deleteTurno(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: "No podrá revertir esto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if(result.isConfirmed) {
            fetch(`/turnos/${id}`, {
                method: "DELETE"
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                fetchTurnos();
                Swal.fire(
                    'Eliminado',
                    'El Turno ha sido eliminado.',
                    'success'
                );
            })
            .catch((error) => {
                console.error("Error eliminando Turno:", error);
                Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar el turno.',
                    'error'
                );
            });
        }
    });
}

fetchPacientes();
fetchOdontologos();
fetchTurnos();