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
    { path: '/funcionesTecnico/', url: 'funcionesTecnico.html', options: { transition: 'f7-cover' } },
    { path: '/ordenesActivas/', url: 'ordenesActivas.html', options: { transition: 'f7-cover' } },
    { path: '/detalleOrden/', url: 'detalleOrden.html', options: { transition: 'f7-cover' } },
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
  //$$("#prueba").on('click', algo)
})

$$(document).on('page:init', '.page[data-name="funcionesAdmin"]', function (e) {
})
$$(document).on('page:init', '.page[data-name="funcinesTecnico"]', function (e) {
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
  traerDefectos()
  $$("#serialNuevaOrden").on('change', traerDatosDispositivo)
  $$("#btnCargarOrden").on('click', cargarNuevaOrden)
  
})
$$(document).on('page:init', '.page[data-name="ordenesActivas"]', function (e) {
  listarOrdenes()
})
$$(document).on('page:init', '.page[data-name="detalleOrden"]', function (e) {
  verDatosOrden()
})

/* function algo() {
  defectos = []
  colDefectos.get()
  .then(function(res) {
    res.forEach(function(doc){
      datos = doc.id
      defectos.push(datos)
      console.log(datos);
    })
    console.log(defectos);
    for (i = 0; i < defectos.length; i++) {
      $$("#defectoNuevaOrden").append(`<option value="${defectos[i]}">${defectos[i]}</option>`)      
    }
  
  })
  .catch(function(err){console.log(err);})
} */

/* -------------------------------- Variables db ------------------------------- */

db = firebase.firestore()
var colClientes = db.collection('Clientes')
var colOrdenesServicio = db.collection('OrdenesServicio')
var colPersonal = db.collection('Personal')
var colDefectos = db.collection('Defectos')

/* --------------------------- Variables globales --------------------------- */
//Variable Fecha
var fecha
//Variables alta nuevo cliente
var nombreNuevoCliente, apellidoNuevoCliente, emailNuevoCliente, tel1NuevoCliente, tel2NuevoCliente, tel3NuevoCliente, dniCuitNuevoCliente, razSocNuevoCliente, direccionNuevoCliente , contactoNuevoCliente, nuevoCliente, nuevoCliente, notasNuevoCliente, appleIDNuevoCliente
//Variables cliente registrado
var idCliente
//Variables nuevo dispositivo
var serialNumberNuevoEquipo, modeloNuevoEquipo, passwordNuevoEquipo, motivoIngresoNuevoEquipo, imeiNuevoDispositivo
//Variables Orden de servicio
var infoDeLaOrden, verDatosOrden

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
                setTimeout(() => {
                  mainView.router.navigate("/funcionesTecnico/")
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
    mainView.router.navigate("/funcionesAdmin/")
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
              <td><a href="/ordenesActivas/"><input id="ordenesActivas" type="button" value="Ordenes Activas" class="button button-small button-round button-fill color-black"></a></td>
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
//Función para traer defectos desde db
function traerDefectos() {
  defectos = []
  colDefectos.get()
  .then(function(res) {
    res.forEach(function(doc){
      datos = doc.id
      defectos.push(datos)
      console.log(datos);
    })
    console.log(defectos);
    for (i = 0; i < defectos.length; i++) {
      $$("#defectoNuevaOrden").append(`<option value="${defectos[i]}">${defectos[i]}</option>`)      
    }
  
  })
  .catch(function(err){console.log(err);})
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

    colClientes.doc(idCliente).collection("OrdenesDeServicio").doc(fecha).set({OrdenDeServicio: fecha, Estado: "activa"})
    .then(function(response) {
      console.log("Se cargo la nueva orden de servicio en el cliente correctamente");

      mainView.router.navigate("/funcionesAdmin/")

  })
    .catch(function(err){console.log(err);})
  })
  .catch(function(err){console.log(err);})
}else{

  app.dialog.alert("¡Complete todos los campos del formulario!")
}
}

//Función para mostrar lista de ordenes activas
function listarOrdenes (){

  ordenes = []

    colClientes.doc(idCliente).collection("OrdenesDeServicio").where("Estado","==","activa").get()
    .then(function(response) {
      response.forEach(doc => {

        console.log(doc.id);
        console.log(doc.data());

        ordenes.push(doc.id);

      })

      for (i = 0; i < ordenes.length; i++) {
        btnOrdenesActivas = $$(`
            <a id="${ordenes[i]}" class="item-content tarjetaItemOA popup-open" data-popup=".popup-orden">
                <div class="item-media"><img src="./img/clientes.png" width="44" />
                </div>
                <div class="item-inner">
                  <div class="item-title-row">
                    <div class="item-title">Orden N° - ${ordenes[i]}</div>
                  </div>
                  <div class="item-subtitle">Ver Orden</div>
                </div>
            </a>`)

            {/* <a class="button button-fill popup-open" data-popup=".popup-orden">ABRIR ORDEN
              <a id="${ordenes[i]}" class="item-content tarjetaItemOA">
                <div class="item-media"><img src="./img/clientes.png" width="44" />
                </div>
                <div class="item-inner">
                  <div class="item-title-row">
                    <div class="item-title">Orden N° - ${ordenes[i]}</div>
                  </div>
                  <div class="item-subtitle">Ver Orden</div>
                </div>
              </a>
            </a> */}

          btnOrdenesActivas.data("valorId", `${ordenes[i]}`)
          
          $$("#listaOrdenes").append(btnOrdenesActivas)
            
            btnOrdenesActivas.data("valorId", `${ordenes[i]}`)
      
            btnOrdenesActivas.on("click", function () {
              var dataId = $$(this).data("valorId")
              
              colOrdenesServicio.doc(dataId).get()
              .then(function(res){
                
                infoDeLaOrden = res._delegate._document.data.value.mapValue.fields
                
                problemaOrden = infoDeLaOrden.Defecto.stringValue

               function datosOrden() {
                 $$("#tituloOrden").text(`${dataId}`)
                  $$("#infoOrden").html(`
                    <h4>Modelo: ${infoDeLaOrden.Modelo.stringValue}</h4>
                    <h4>Numero de serie: ${infoDeLaOrden.NroSerie.stringValue}</h4>
                    <h4>Apple ID: ${infoDeLaOrden.AppleID.stringValue}</h4>
                    <h4>Password Apple ID: ${infoDeLaOrden.ContrasenaAppleID.stringValue}</h4>
                    <h4>PIN Dispositivo: ${infoDeLaOrden.ContrasenaTel.stringValue}</h4>
                    <h4>IMEI: ${infoDeLaOrden.IMEI.stringValue}</h4>
                    <h4>Entrega estimada: ${infoDeLaOrden.EntregaEstimada.stringValue}</h4>
                    <h4>Defecto: ${infoDeLaOrden.Defecto.stringValue}</h4>
                    <h4>Condiciones iniciales: ${infoDeLaOrden.EstadoDispositivo.stringValue}</h4>
                    <h4>Detalle del cliente: ${infoDeLaOrden.InfoCliente.stringValue}</h4>
                    <h4>Trabajo asigando a: ${infoDeLaOrden.TrabajoAsignadoA.stringValue}</h4>
                    <h4>Detalles orden: ${infoDeLaOrden.Notas.stringValue}</h4>
                    <h4 class="estadoOrden">Ultimo estado: ${infoDeLaOrden.Estado.stringValue}</h4>
                    `)
                }

                datosOrden()
              })
              .catch(function(err){console.log(err);})
            }) 
          }
    })
    .catch(function(err){console.log(err);})
}

