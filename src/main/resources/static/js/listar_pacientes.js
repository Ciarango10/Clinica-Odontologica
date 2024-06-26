const tableBody = document.querySelector("#pacientesTable tbody");
const form = document.getElementById("editarForm");
let idPaciente = null;
let idDomicilio = null;

function fetchPacientes() {
    fetch(`/pacientes`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Limpiar el contenido actual de la tabla
            tableBody.innerHTML = "";

            // Insertar los datos en la tabla
            data.forEach((paciente) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                        <td>${paciente.id}</td>
                        <td>${paciente.nombre}</td>
                        <td>${paciente.apellido}</td>
                        <td>${paciente.dni}</td>
                        <td>${paciente.fechaIngreso}</td>
                        <td>${paciente.domicilio.calle} ${paciente.domicilio.numero} (${paciente.domicilio.localidad} - ${paciente.domicilio.provincia})</td>

                        <td>
                            <button class="btn btn-sm" style="background-color: #a6dcef;" data-bs-toggle="modal" data-bs-target="#editarPaciente" onclick="editPaciente(${paciente.id},
                                '${paciente.nombre}', '${paciente.apellido}', '${paciente.dni}', '${paciente.fechaIngreso}', '${paciente.domicilio.id}',
                                '${paciente.domicilio.calle}', '${paciente.domicilio.numero}', '${paciente.domicilio.localidad}', 
                                '${paciente.domicilio.provincia}')"><i class="fas fa-edit mx-2"></i>Modificar</button>
                            <button class=" mx-4 btn btn-sm" style="background-color: #ef9a9a;" onclick="deletePaciente(${paciente.id})"><i class="fas fa-trash-alt mx-2"></i>Eliminar</button>
                        </td>
                    `;

                tableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Modificar un Paciente
function editPaciente(id, nombre, apellido, dni, fechaIngreso, domicilioId, calle, numero, localidad, provincia) {
    //Cargamos el valor del id en la variable global
    idPaciente = id;
    idDomicilio = domicilioId
    //Cargamos los valores a la ventana modal

    // Datos del paciente
    document.querySelector("#nombreEdit").value = nombre;
    document.querySelector("#apellidoEdit").value = apellido;
    document.querySelector("#dniEdit").value = dni;
    document.querySelector("#fechaIngresoEdit").value = fechaIngreso;
    // Datos del domicilio
    document.getElementById("calleEdit").value = calle;
    document.getElementById("numeroEdit").value = numero;
    document.getElementById("localidadEdit").value = localidad;
    document.getElementById("provinciaEdit").value = provincia;

}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Datos del paciente
    const nombre = document.getElementById("nombreEdit").value;
    const apellido = document.getElementById("apellidoEdit").value;
    const dni = document.getElementById("dniEdit").value;
    const fechaIngreso = document.getElementById("fechaIngresoEdit").value;
    // Datos del domicilio
    const calle = document.getElementById("calleEdit").value;
    const numero = document.getElementById("numeroEdit").value;
    const localidad = document.getElementById("localidadEdit").value;
    const provincia = document.getElementById("provinciaEdit").value;

    // llamando al endpoint de editar
    fetch(`/pacientes`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: idPaciente, nombre, apellido, dni, fechaIngreso,
            domicilio: {
                id: idDomicilio, calle, numero, provincia, localidad, provincia
            }
        })
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            fetchPacientes();
            var modalElement = document.getElementById('editarPaciente');
            var modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Paciente modificado con éxito',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
        })
        .catch((error) => {
            console.error("Error modificando Paciente:", error);
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Hubo un problema al modificar el paciente',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
        });
});

// Eliminar un paciente
function deletePaciente(id) {
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
            fetch(`/pacientes/${id}`, {
                method: "DELETE"
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                fetchPacientes();
                Swal.fire(
                    'Eliminado',
                    'El Paciente ha sido eliminado.',
                    'success'
                );
            })
            .catch((error) => {
                console.error("Error eliminando Paciente:", error);
                Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar el paciente.',
                    'error'
                );
            });
        }
    });
}

fetchPacientes();