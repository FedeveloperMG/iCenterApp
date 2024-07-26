// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'iCenter',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    { path: '/index/', url: 'index.html', options: { transition: 'f7-cover' } },
    { path: '/funcionesAdmin/', url: 'funcionesAdmin.html', options: { transition: 'f7-cover' } },
    { path: '/altaCliente/', url: 'altaCliente.html', options: { transition: 'f7-cover' } },
    { path: '/altaDispositivo/', url: 'altaDispositivo.html', options: { transition: 'f7-cover' } },
    { path: '/altaOrdenesDeServicio/', url: 'altaOrdenesDeServicio.html', options: { transition: 'f7-cover' } },
    { path: '/nuevaOrden/', url: 'nuevaOrden.html', options: { transition: 'f7-cover' } },
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
})


$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  $$("#btnInicioSesion").on('click', inicioSesion)
})

$$(document).on('page:init', '.page[data-name="funcionesAdmin"]', function (e) {
})

$$(document).on('page:init', '.page[data-name="altaCliente"]', function (e) {
  $$("#btnAddCliente").on('click', añadirCliente)
})
$$(document).on('page:init', '.page[data-name="altaDispositivo"]', function (e) {
  $$("#btnAddDispositivo").on('click', añadirNuevoDispositivo)
})
$$(document).on('page:init', '.page[data-name="altaOrdenesDeServicio"]', function (e) {
  $$("#btnBuscarCliente").on("click", buscarCliente);
})
$$(document).on('page:init', '.page[data-name="nuevaOrden"]', function (e) {
  traerSerialsDispositivos();
  $$("#serialNuevaOrden").on('change', traerDatosDispositivo)
  $$("#btnCargarOrden").on('click', cargarNuevaOrden)
  $$("#prueba").on('click', algo)
})

function algo() {
  //if ($$(`input[type='radio']:checked`).length == 11 && $$(`input[type='select']`).val() !== "---" && $$(`input[type='text']`).val() !== ""){
    console.log("campos incompletos");
    console.log($$(`input[type='select']`).val());
    console.log( $$(`input[type='text']`).val());
  //}
}

/* -------------------------------- Variables db ------------------------------- */

db = firebase.firestore()
var colClientes = db.collection('Clientes')
var colOrdenesServicio = db.collection('OrdenesServicio')
var colPersonal = db.collection('Personal')

/* --------------------------- Variables globales --------------------------- */
//Variable Fecha
var fecha
//Variables alta nuevo cliente
var nombreNuevoCliente, apellidoNuevoCliente, emailNuevoCliente, tel1NuevoCliente, tel2NuevoCliente, tel3NuevoCliente, dniCuitNuevoCliente, razSocNuevoCliente, direccionNuevoCliente , contactoNuevoCliente, nuevoCliente, nuevoCliente, notasNuevoCliente, appleIDNuevoCliente
//Variables cliente registrado
var idCliente
//Variables nuevo dispositivo
var serialNumberNuevoEquipo, modeloNuevoEquipo, passwordNuevoEquipo, motivoIngresoNuevoEquipo, imeiNuevoDispositivo

/* -------------------------------- Funciones ------------------------------- */
//Función para iniciar sesión
function inicioSesion() {
  emailSession = $$("#indexInputUser").val()
  passwordSession = $$("#indexInputPass").val()

  if (emailSession != "" && passwordSession != "") {


    firebase.auth().signInWithEmailAndPassword(emailSession, passwordSession)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;

        //Validando Role
        var sessionId = emailSession
        colPersonal.where("user", "==", sessionId).get()
          .then(function (res) {
            res.forEach(function (doc) {
              roleSession = doc.data().rol

              //Ingreso dependiendo del role de usuario
              if (roleSession == "admin") {
                setTimeout(() => {
                  mainView.router.navigate("/funcionesAdmin/")
                }, 3000)
              } else if (roleSession == "tecnico") {
                mainView.router.navigate('/loggedIn/');
                setTimeout(() => {
                  mainView.router.navigate("/modoComplejo/")
                }, 3000)
              } else if (roleSession == "dev") {
                setTimeout(() => {
                  mainView.router.navigate('/funcionesAdmin/')
                }, 3000)
              }
            })
          })
          .catch(function (error) {
            console.log("Error: " + error)
          }) 
      })
      .catch((error) => {

        if (error.message == "The email address is badly formatted.") {
          $$("#cajaValidacion").html(`<h3>El email ingresado posee un formato incorrecto</h3>`)
        } else {
          errorJson = JSON.parse(error.message);
          var errorCode = errorJson.error.code;
          var errorMessage = errorJson.error.message;

          if (errorMessage == `INVALID_LOGIN_CREDENTIALS`) {
            $$("#cajaValidacion").html("<h3>El email o la contraseña son incorrectos</h3>")
          } else {
            console.log(errorCode);
          }
        }
      })
      ;
  }
}


//Función para obtener fecha (ID ORDEN DE SERVICIO)
function tomarFecha() {
  var fechaActual = new Date();

       // Obtener el año, mes y día
      var año = fechaActual.getFullYear();
       // Se suma 1 al mes, ya que los meses comienzan desde 0
      var mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
      var dia = ('0' + fechaActual.getDate()).slice(-2);
      var hora = ('0' + fechaActual.getHours()).slice(1);
      var minutos = ('0' + fechaActual.getMinutes()).slice(1);
      var segundos = ('0' + fechaActual.getSeconds()).slice(1);

      fecha = dia +"-"+ mes +"-"+ año +"-"+ hora +":"+ minutos +":"+ segundos;
}

//Funcion para resetear variables
function resetForm() {
  //Resetear campos del formulario
  $$("input#nombreNuevoCliente").val("");
  $$("input#apellidoNuevoCliente").val("");
  $$("input#emailNuevoCliente").val("");
  $$("input#appleIDNuevoCliente").val("");
  $$("input#tel1NuevoCliente").val("");
  $$("input#tel2NuevoCliente").val("");
  $$("input#tel3NuevoCliente").val("");
  $$("input#dniCuitNuevoCliente").val("");
  $$("input#razSocNuevoCliente").val("");
  $$("input#direccionNuevoCliente").val("");
  $$("input#contactoNuevoCliente").val("");

  //Conservar la variable del telefono del cliente que será su ID
  idCliente = tel1NuevoCliente
}

//Funcion para añadir un nuevo cliente
function añadirCliente() {
  mainView.router.navigate("/altaDispositivo/")
  idCliente = $$("#tel1NuevoCliente").val();
  

  //Campos formulario
  nombreNuevoCliente = $$("#nombreNuevoCliente").val();
  apellidoNuevoCliente = $$("#apellidoNuevoCliente").val();
  emailNuevoCliente = $$("#emailNuevoCliente").val();
  tel1NuevoCliente = $$("#tel1NuevoCliente").val();
  tel2NuevoCliente = $$("#tel2NuevoCliente").val();
  tel3NuevoCliente = $$("#tel3NuevoCliente").val();
  dniCuitNuevoCliente = $$("#dniCuitNuevoCliente").val();
  razSocNuevoCliente = $$("#razSocNuevoCliente").val();
  direccionNuevoCliente = $$("#direccionNuevoCliente").val();
  contactoNuevoCliente = $$("#contactoNuevoCliente").val();
  appleIDNuevoCliente = $$("#appleIDNuevoCliente").val();
  passwordNuevoCliente = $$("#passwordNuevoCliente").val();
  notasNuevoCliente = $$("#notasNuevoCliente").val();
  idCliente = $$("#tel1NuevoCliente").val();

  //Fecha de alta de cliente
  tomarFecha()
  

  //Objeto nuevo cliente
  nuevoCliente = {
    Nombre: nombreNuevoCliente,
    Apellido: apellidoNuevoCliente,
    Email: emailNuevoCliente,
    AppleID: appleIDNuevoCliente,
    PasswordApple: passwordNuevoCliente,
    Tel1: tel1NuevoCliente,
    Tel2: tel2NuevoCliente,
    Tel3: tel3NuevoCliente,
    DniCuit: dniCuitNuevoCliente,
    RazonSocial: razSocNuevoCliente,
    Direccion: direccionNuevoCliente,
    Conocimiento: contactoNuevoCliente,
    IDCliente: tel1NuevoCliente,
    Notas: notasNuevoCliente,
    FechaAlta: fecha
  }

  //Añadiendo a DB nuevo cliente
  colClientes.doc(idCliente).set(nuevoCliente)
  .then(function(response) {
    console.log("Se añadió el nuevo cliente correctamente");
    mainView.router.navigate("/altaDispositivo/")
    resetForm()
  })
  .catch(function(err){console.log(err);})
}

//Funcion para agregar nuevos dispositivos al cliente
function añadirNuevoDispositivo() {

  modeloNuevoEquipo = $$("#modeloNuevoDispositivo").val()
  serialNumberNuevoEquipo = $$("#serialNumberNuevoDispositivo").val()
  imeiNuevoDispositivo = $$("#imeiNuevoDispositivo").val()
  passwordNuevoEquipo = $$("#passNuevoDispositivo").val()
  motivoIngresoNuevoEquipo = $$("#motivoNuevoDispositivo").val()

  //Objeto nuevo dispositivo
  dispositivo = {
    SerialNumber: serialNumberNuevoEquipo,
    IMEI: imeiNuevoDispositivo,
    Modelo: modeloNuevoEquipo,
    PasswordTelefono: passwordNuevoEquipo,
    MotivoIngreso: motivoIngresoNuevoEquipo,
    AppleID: appleIDNuevoCliente,
    PasswordApple: passwordNuevoCliente,
  }

  //Añadiendo a DB nuevo dispositivo
  colClientes.doc(idCliente).collection("Dispositivos").doc(serialNumberNuevoEquipo).set(dispositivo)
  .then(function(response) {
    console.log("Se añadió el nuevo dispositivo correctamente");
    mainView.router.navigate("/index/")
  })
  .catch(function(err){console.log(err);})
}

//Función para buscar cliente
function buscarCliente () {
  idCliente = $$("#filtroTel").val()
  
  colClientes.where("IDCliente","==",idCliente).get()
  .then(function(res) {
    if(res.docs.length == 0){
      $$("#cajaTabla").html(`<h2>No se encontró cliente</h2>`)
    }else{
    res.forEach(function (doc){
      data = doc.data()
      id = doc.id
      
      $$("#cajaTabla").html(`
      
        <div id="cajaTablaDatos" class="data-table elementoOculto">
          <table>
            <thead>
              <tr>
                <th class="label-cell">Nombre</th>
                <th class="label-cell">Apellido</th>
                <th class="label-cell">Email</th>
                <th class="label-cell">Teléfono</th>
                <th class="label-cell">Dirección</th>
              </tr>
            </thead>
            <tbody id="tableDatos">
              <td>${data.Nombre}</td>
              <td>${data.Apellido}</td>
              <td>${data.Email}</td>
              <td>${data.Tel1}</td>
              <td>${data.Direccion}</td>
              <td><a href="/nuevaOrden/"><input id="nuevaOrden" type="button" value="Nueva Orden" class="button button-small button-round button-fill color-green"></a></td>
            </tbody>
          </table>
        </div>
      `)

      $$("#btnBuscarCliente").removeClass("btnVisible").addClass("btnOculto")

      })}
  })
  .catch(function(err){console.log(err);})
}

//Función para capturar serials de los dispositivos disponibles en nueva orden
function traerSerialsDispositivos() {
  
  serials = []

  colClientes.doc(idCliente).collection("Dispositivos").where("SerialNumber","!=","").get()
  .then(function(res){
    res.forEach(function(doc){
      dataDispositivo = doc.data()
      serials.push(dataDispositivo.SerialNumber)
    })
    
    for(i = 0; i < serials.length; i++){
      $$("#serialNuevaOrden").append(`<option value="${serials[i]}">${serials[i]}</option>`)
    }
  })
  .catch(function(err){console.log(err);})
}

//Función para capturar datos del dispositivo elegido
function traerDatosDispositivo() {

  serialElegido = $$("#serialNuevaOrden").val()

  if(serialElegido == "---"){
    $$("#modeloNuevaOrden").html(`<option selected value="---">---</option>`)
    $$("#imeiNuevaOrden").html(`<option selected value="---">---</option>`)
    $$("#appleIDNuevaOrden").html(`<option selected value="---">---</option>`)
    $$("#contrasenaAppleIDNuevaOrden").val(`---`)
    $$("#contrasenaTelNuevaOrden").val(`---`)
  }else{
  colClientes.doc(idCliente).collection("Dispositivos").where("SerialNumber","==",serialElegido).get()
  .then(function(res) {
    res.forEach(function(doc){
      dataDispositivo = doc.data()
    })
    $$("#modeloNuevaOrden").html(`<option selected value="${dataDispositivo.Modelo}">${dataDispositivo.Modelo}</option>`)
    $$("#imeiNuevaOrden").html(`<option selected value="${dataDispositivo.IMEI}">${dataDispositivo.IMEI}</option>`)
    $$("#appleIDNuevaOrden").html(`<option selected value="${dataDispositivo.AppleID}">${dataDispositivo.AppleID}</option>`)
    $$("#contrasenaAppleIDNuevaOrden").val(`${dataDispositivo.PasswordApple}`)
    $$("#contrasenaTelNuevaOrden").val(`${dataDispositivo.PasswordTelefono}`)
  
  })
  .catch(function(err){console.log(err);})
}
}

//Función para cargar orden de servicio
function cargarNuevaOrden() {
  serialNuevaOrden = $$("#serialNuevaOrden").val()
  modeloNuevaOrden = $$("#modeloNuevaOrden").val()
  imeiNuevaOrden = $$("#imeiNuevaOrden").val()
  appleIDNuevaOrden = $$("#appleIDNuevaOrden").val()
  contrasenaAppleIDNuevaOrden = $$("#contrasenaAppleIDNuevaOrden").val()
  contrasenaTelNuevaOrden = $$("#contrasenaTelNuevaOrden").val()
  defectoNuevaOrden = $$("#defectoNuevaOrden").val()
  notasNuevaOrden = $$("#notasNuevaOrden").val()
  infoClienteNuevaOrden = $$("#infoClienteNuevaOrden").val()
  urgenciaNuevaOrden = $$("#urgenciaNuevaOrden").val()

  checklist = []

  for (i = 1; i < 23; i++) {
    if ($$(`#radio${i}`)[0].checked){
    valor = $$(`#radio${i}`).val()
    checklist.push(valor)
  }}
    
  estadoDispositivo = checklist.join("; ")


  tomarFecha()

  nuevaOrden = {
    NroSerie: serialNuevaOrden,
    Modelo: modeloNuevaOrden,
    IMEI: imeiNuevaOrden,
    AppleID: appleIDNuevaOrden,
    ContrasenaAppleID: contrasenaAppleIDNuevaOrden,
    ContrasenaTel: contrasenaTelNuevaOrden,
    Defecto: defectoNuevaOrden,
    Notas: notasNuevaOrden,
    InfoCliente: infoClienteNuevaOrden,
    //Recibio: userLogged,
    //Urgencia: urgenciaNuevaOrden,
    FechaIngreso: fecha,
    TrabajoAsignadoA: "",
    Estado: "Ingresado",
    EntregaEstimada: "",
    EstadoDispositivo: estadoDispositivo

  }

  if ($$(`input[type='radio']:checked`).length == 11) {
  colOrdenesServicio.doc(fecha).set(nuevaOrden)
  .then(function(response) {
    console.log("Se cargo la nueva orden de servicio correctamente")

    colClientes.doc(idCliente).collection("OrdenesDeServicio").doc(fecha).set({OrdenDeServicio: fecha})
    .then(function(response) {
      console.log("Se cargo la nueva orden de servicio en el cliente correctamente");
  })
    .catch(function(err){console.log(err);})
  })
  .catch(function(err){console.log(err);})
}else{

  app.dialog.alert("¡Complete todos los campos del formulario!")
}
}
