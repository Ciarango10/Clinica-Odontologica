const tableBody = document.querySelector("#odontologosTable tbody");
const form = document.getElementById("editarForm");
let idOdontologo = null;

function fetchOdontologos() {
    fetch(`/odontologos`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Limpiar el contenido actual de la tabla
            tableBody.innerHTML = "";

            // Insertar los datos en la tabla
            data.forEach((odontologo) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${odontologo.id}</td>
                    <td>${odontologo.nombre}</td>
                    <td>${odontologo.apellido}</td>
                    <td>${odontologo.nroMatricula}</td>
                    <td>
                        <button class="btn btn-sm" style="background-color: #a6dcef;" data-bs-toggle="modal" data-bs-target="#editarOdontologo" onclick="editOdontologo(${odontologo.id}, '${odontologo.nombre}', '${odontologo.apellido}', '${odontologo.nroMatricula}')"><i class="fas fa-edit px-2"></i>Modificar</button>
                        <button class="mx-4 btn btn-sm" style="background-color: #ef9a9a;" onclick="deleteOdontologo(${odontologo.id})"><i class="fas fa-trash-alt px-2"></i>Eliminar</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Modificar un odontologo
// Modificar un odontologo
function editOdontologo(id, nombre, apellido, nroMatricula) {
    // Cargar los valores en la ventana modal
    idOdontologo = id;
    document.querySelector("#nombreEdit").value = nombre;
    document.querySelector("#apellidoEdit").value = apellido;
    document.querySelector("#matriculaEdit").value = nroMatricula;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreEdit").value;
    const apellido = document.getElementById("apellidoEdit").value;
    const matricula = document.getElementById("matriculaEdit").value;

    // Llamando al endpoint de editar
    fetch(`/odontologos`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: idOdontologo, nombre, apellido, nroMatricula: matricula })
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            fetchOdontologos();
            var modalElement = document.getElementById('editarOdontologo');
            var modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Odontólogo modificado con éxito',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
        })
        .catch((error) => {
            console.error("Error modificado odontólogo:", error);
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Hubo un problema al modificar el odontólogo',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
        });
});

// Eliminar un odontologo
function deleteOdontologo(id) {
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
        if (result.isConfirmed) {
            fetch(`/odontologos/${id}`, {
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    fetchOdontologos();
                    Swal.fire(
                        'Eliminado',
                        'El odontólogo ha sido eliminado.',
                        'success'
                    );
                } else {
                    throw new Error('Error al eliminar el odontólogo.');
                }
            })
            .catch((error) => {
                console.error("Error eliminando odontólogo:", error);
                Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar el odontólogo.',
                    'error'
                );
            });
        }
    });
}

fetchOdontologos();
