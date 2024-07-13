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
    { path: '/altaCliente/', url: 'altaCliente.html', options: { transition: 'f7-cover' } },
    { path: '/altaDispositivo/', url: 'altaDispositivo.html', options: { transition: 'f7-cover' } },
    { path: '/altaOrdenesDeServicio/', url: 'altaOrdenesDeServicio.html', options: { transition: 'f7-cover' } },
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
})

$$(document).on('page:init', '.page[data-name="altaCliente"]', function (e) {
  $$("#btnAddCliente").on('click', añadirCliente)
   
})
$$(document).on('page:init', '.page[data-name="altaDispositivo"]', function (e) {
  $$("#btnAddDispositivo").on('click', añadirNuevoDispositivo)
    
})


/* -------------------------------- Variables db ------------------------------- */

db = firebase.firestore()
var colClientes = db.collection('Clientes')
var colOrdenesServicio = db.collection('OrdenesServicio')

/* --------------------------- Variables globales --------------------------- */
//Variable Fecha
var fecha
//Variables alta nuevo cliente
var nombreNuevoCliente, emailNuevoCliente, tel1NuevoCliente, tel2NuevoCliente, tel3NuevoCliente, dniCuitNuevoCliente, razSocNuevoCliente, direccionNuevoCliente , contactoNuevoCliente, nuevoCliente, nuevoCliente, notasNuevoCliente, appleIDNuevoCliente
//Variables cliente registrado
var idCliente
//Variables nuevo dispositivo
var serialNumberNuevoEquipo, modeloNuevoEquipo, passwordNuevoEquipo, motivoIngresoNuevoEquipo, imeiNuevoDispositivo

/* -------------------------------- Funciones ------------------------------- */
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

      fecha = dia + mes + año + hora + minutos + segundos;
}

//Funcion para resetear variables
function resetForm() {
  //Resetear campos del formulario
  $$("input#nombreNuevoCliente").val("");
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
    Password: passwordNuevoEquipo,
    MotivoIngreso: motivoIngresoNuevoEquipo,
  }

  //Añadiendo a DB nuevo dispositivo
  colClientes.doc(idCliente).collection("Dispositivos").doc(serialNumberNuevoEquipo).set(dispositivo)
  .then(function(response) {
    console.log("Se añadió el nuevo dispositivo correctamente");
    mainView.router.navigate("/index/")
  })
  .catch(function(err){console.log(err);})
  
}





















































//Función para añadir productos a db
function añadirProducto() {

  var insumos = []

  colInsumos.orderBy("nombre").get()
    .then(function (res) {
      res.forEach(function (doc) {
        info = doc.data()
        insumos.push(info.precio)
      })

      //Precios de insumos
      precioUnCola = `${insumos[0]}`
      precioUnDiluyente = `${insumos[1]}`
      precioUnFlete = `${insumos[2]}`
      precioUnLijas = `${insumos[3]}`
      precioUnLuz = `${insumos[4]}`
      precioUnPinceles = `${insumos[5]}`
      precioUnPintura = `${insumos[6]}`
      precioUnRodillos = `${insumos[7]}`
      precioUnSilastic = `${insumos[8]}`
      precioUnVidrio = `${insumos[9]}`

      colManoDeObra.get()
        .then(function (res) {
          var valoresH = []

          res.forEach(function (doc) {
            datos = doc.data();
            id = doc.id
            valoresH.push(datos.valorH)

          })

          precioHora = parseInt(valoresH[0] + valoresH[1])

          //Inputs
          nombre = $$("#newPNombre").val()
          tipo = $$("#newPTipo").val()
          color = $$("#newPColor").val()
          ancho = $$("#newPAncho").val()
          alto = $$("#newPAlto").val()
          largo = $$("#newPLargo").val()
          stock = Number($$("#newPStock").val())
          vidrios = Number($$("#newPVidrios").val())
          hsTrabajo = Number($$("#newPHsTrabajo").val())
          lijas = Number($$("#newPLijas").val())
          pinceles = Number($$("#newPPinceles").val())
          rodillos = Number($$("#newPRodillos").val())
          luz = Number($$("#newPLuz").val())
          pintura = Number($$("#newPPintura").val())
          cola = Number($$("#newPCola").val())
          silastic = Number($$("#newPSilastic").val())
          diluyente = Number($$("#newPDiluyente").val())
          flete = Number($$("#newPFlete").val())
          precioMueble = Number($$("#newPMueble").val())
          proveedor = $$("#newPProveedor").val()

          //Calculo de costo total insumos
          costoTotal = parseInt((precioUnLijas * lijas) + (precioUnPinceles * pinceles) + (precioUnRodillos * rodillos) + (precioUnPintura * pintura) + (precioUnCola * cola) + (precioUnSilastic * silastic) + (precioUnVidrio * vidrios) + (precioUnDiluyente * diluyente) + (precioMueble) + (precioUnFlete * flete) + (precioUnLuz * luz))

          //Calculo de costo total MO
          costoTotalMO = parseInt(hsTrabajo * precioHora)

          precioTotalDelProducto = costoTotalMO + costoTotal

          producto =
          {
            Nombre: nombre,
            Tipo: tipo,
            Color: color,
            Ancho: ancho,
            Alto: alto,
            Largo: largo,
            Stock: stock,
            Vidrios: vidrios,
            Hstrabajo: hsTrabajo,
            Lijas: lijas,
            Pinceles: pinceles,
            Rodillos: rodillos,
            Luz: luz,
            Pintura: pintura,
            Cola: cola,
            Silastic: silastic,
            Diluyente: diluyente,
            Flete: flete,
            PrecioMueble: precioMueble,
            CostoMO: costoTotalMO,
            CostoIn: costoTotal,
            PrecioFinal: precioTotalDelProducto,
            Proveedor: proveedor
          }

          if (proveedor == "-") {
            app.dialog.alert("Ingrese el Proveedor!")
          } else {
            colProductos.add(producto)
              .then(function (doc) {
                console.log("Producto agregado");

                texto = `<h3>Cargando nuevo producto...</h3>`
                pantalla = '/products/'
                loader(texto, pantalla)

              })
              .catch(function (err) {
                console.log("Error al agregar producto")
              })
          }

        })

        .catch(function (err) {
          console.log("Error al cargar precios insumos y Mo")
        })

    })
    .catch(function (err) {
      console.log("Error al agregar producto")
    })

}

//Función reset filtros
function resetFiltros() {
  variableOrdenamiento = "Proveedor"
  valorOrdenamiento = "asc"
  variableQuery = "Proveedor"
  operadorQuery = "!="
  valorQuery = "-"
}

//Función para ver lista de productos
function verProductos() {
  products = []


  colProductos.orderBy(variableOrdenamiento, valorOrdenamiento).where(variableQuery, operadorQuery, valorQuery).get()
    .then(function (res) {

      res.forEach(function (doc) {

        info = doc.data()
        id = doc.id

        products.push({ informacion: info, id: id });
      });

      // Iterar sobre el array
      for (i = 0; i < products.length; i++) {

        // Crear nueva fila
        var nuevaFila = $$('<tr>');

        // Crear celda para el valor
        var celdaNombre = $$('<td>').text(`${products[i].informacion.Nombre}-${products[i].informacion.Tipo}`);
        var celdaColor = $$('<td>').text(products[i].informacion.Color);
        var celdaPrecio = $$('<td>').text(products[i].informacion.PrecioFinal);
        var celdaMedida = $$('<td>').text(`${products[i].informacion.Ancho}x${products[i].informacion.Largo}x${products[i].informacion.Ancho}`);
        var celdaStock = $$('<td>').text(products[i].informacion.Stock);
        var celdaProveedor = $$('<td>').text(products[i].informacion.Proveedor);

        btnDetalles = $$(`<input id="${i}" type="button" value="+" class="button button-small button-round button-fill color-green">`)
        btnDetalles.data("valorId", `${i}`)
        btnDetalles.on("click", function () {
          var dataId = $$(this).data("valorId")

          tituloProductoDetallado = `${products[dataId].informacion.Nombre}-${products[dataId].informacion.Tipo}`
          tituloInsumos = `${products[dataId].informacion.Nombre}-${products[dataId].informacion.Tipo}`
          mostrarMObra()


          //Variables del producto seleccionado
          precioUnMueble = products[dataId].informacion.PrecioMueble
          cantLijas = `${products[dataId].informacion.Lijas}`
          cantPinceles = `${products[dataId].informacion.Pinceles}`
          cantRodillos = `${products[dataId].informacion.Rodillos}`
          cantPintura = `${products[dataId].informacion.Pintura}`
          cantCola = `${products[dataId].informacion.Cola}`
          cantSilastic = `${products[dataId].informacion.Silastic}`
          cantVidrio = `${products[dataId].informacion.Vidrios}`
          cantDiluyente = `${products[dataId].informacion.Diluyente}`
          cantMueble = 1
          cantFlete = `${products[dataId].informacion.Flete}`
          cantLuz = `${products[dataId].informacion.Luz}`
          cantHsTrabajo = `${products[dataId].informacion.Hstrabajo}`


          //Función para mostrar precios
          mostrarInsumos()

          //Guardar Costos en la db
          setTimeout(function () {
            idProd = products[dataId].id
            colProductos.doc(idProd).update({ CostoIn: costoTotal, CostoMO: costoTotalMO })
              .then(function (resp) {
                console.log("Costos reflejados");
              })
              .catch(function (err) { console.log(err); })
          }, 3000)

          // Agregar celdas a la fila
          mainView.router.navigate("/detailsProduct/")

        })

        var celdaDetalles = $$('<td>').append(btnDetalles);

        // Agregar celdas a la fila
        nuevaFila.append(celdaNombre, celdaColor, celdaPrecio, celdaMedida, celdaStock, celdaProveedor, celdaDetalles);

        // Agregar fila al cuerpo de la tabla
        $$("#tableProducts").append(nuevaFila);

      }


      $$("#btnListProduct").removeClass("btnVisible").addClass("btnOculto")
      $$("#cajaFiltroNombre").removeClass("btnOculto").addClass("btnVisible")
      $$("#cajaOrdenar").removeClass("btnOculto").addClass("btnVisible")
      $$("#cajaTablaProductos").removeClass("elementoOculto").addClass("elementoVisible")
    })
    .catch(function (err) {
      console.log("Error al listar productos")
    })
}


function toListProducts() {
  products = []
}

//Función para filtrar lista por nombre
function filtrarNombre() {
  products = []
  $$("#tableProducts").html("")
  nombreElegido = $$("#filtroNombre").val().toLowerCase()

  nombreModificado = nombreElegido.charAt(0).toUpperCase() + nombreElegido.slice(1).toLowerCase()

  if (nombreModificado.length !== 0) {
    variableOrdenamiento = "Nombre"
    valorOrdenamiento = "asc"
    variableQuery = "Nombre"
    valorQuery = nombreModificado
    operadorQuery = "=="
    verProductos()
  } else if (nombreModificado.length == 0) {
    variableOrdenamiento = "Proveedor"
    valorOrdenamiento = "asc"
    variableQuery = "Proveedor"
    operadorQuery = "!="
    valorQuery = "-"
    verProductos()
  }
}

//Función para ordenar lista
function orderBy() {

  $$("#tableProducts").html("")
  products = []
  orderValue = $$("#ordenBy").val()

  if (orderValue == "PrecioMenMay") {
    variableOrdenamiento = "PrecioFinal"
    valorOrdenamiento = "asc"
    variableQuery = "PrecioFinal"
    operadorQuery = "!="
    valorQuery = "-"
  } else if (orderValue == "PrecioMayMen") {
    variableOrdenamiento = "PrecioFinal"
    valorOrdenamiento = "desc"
    variableQuery = "PrecioFinal"
    operadorQuery = "!="
    valorQuery = "-"
  } else if (orderValue == "Proveedor") {
    variableOrdenamiento = "Proveedor"
    valorOrdenamiento = "asc"
    variableQuery = "Proveedor"
    operadorQuery = "!="
    valorQuery = "-"
  }

  verProductos()
}

//Función para mostrar precios de insumos
function mostrarInsumos() {

  insumos = []

  colInsumos.orderBy("nombre").get()
    .then(function (res) {
      res.forEach(function (doc) {
        info = doc.data()
        insumos.push(info.precio)
      })

      //Precios de insumos
      precioUnCola = `${insumos[0]}`
      precioUnDiluyente = `${insumos[1]}`
      precioUnFlete = `${insumos[2]}`
      precioUnLijas = `${insumos[3]}`
      precioUnLuz = `${insumos[4]}`
      precioUnPinceles = `${insumos[5]}`
      precioUnPintura = `${insumos[6]}`
      precioUnRodillos = `${insumos[7]}`
      precioUnSilastic = `${insumos[8]}`
      precioUnVidrio = `${insumos[9]}`

      //Precios de insumos
      precioTotalCola = (precioUnCola * cantCola)
      precioTotalDiluyente = (precioUnDiluyente * cantDiluyente)
      precioTotalFlete = (precioUnFlete * cantFlete)
      precioTotalLijas = (precioUnLijas * cantLijas)
      precioTotalLuz = (precioUnLuz * cantLuz)
      precioTotalMueble = (precioUnMueble)
      precioTotalPinceles = (precioUnPinceles * cantPinceles)
      precioTotalPintura = (precioUnPintura * cantPintura)
      precioTotalRodillos = (precioUnRodillos * cantRodillos)
      precioTotalSilastic = (precioUnSilastic * cantSilastic)
      precioTotalVidrio = (precioUnVidrio * cantVidrio)

      //Calculo de costo total
      costoTotal = parseInt((precioUnLijas * cantLijas) + (precioUnPinceles * cantPinceles) + (precioUnRodillos * cantRodillos) + (precioUnPintura * cantPintura) + (precioUnCola * cantCola) + (precioUnSilastic * cantSilastic) + (precioUnVidrio * cantVidrio) + (precioUnDiluyente * cantDiluyente) + (precioUnMueble) + (precioUnFlete * cantFlete) + (precioUnLuz * cantLuz))

    })


    .catch(function (err) {
      console.log("Error")
    })

}

function mostrarMObra() {
  colManoDeObra.get()
    .then(function (res) {
      valoresH = []

      res.forEach(function (doc) {
        datos = doc.data();
        id = doc.id
        valoresH.push(datos.valorH)

        //precioHora = datos.valorHOF
      })

      precioHora = parseInt(valoresH[0] + valoresH[1])
      costoTotalMO = parseInt(precioHora * cantHsTrabajo)
    })
    .catch(function (err) {
      console.log(err)

    })
}

//Funcion para ver precios Mano de obra
function pricesMO() {
  colManoDeObra.get()
    .then(function (res) {
      valores = []
      res.forEach(function (doc) {
        info = doc.data()

        valores.push(info.valorH)

      }
      )

      precioHoraMOAyudante = valores[0]
      precioHoraMOOficial = valores[1]
    })
    .catch(function (err) { console.log(err) })
}

//Función para actulizar precios de MO
function actualizarPreciosMOOf(porcent) {
  porcentajeActualizacionOf = $$("#porcentActualOficial").val()
  porcent = porcentajeActualizacionOf

  precioActualizadoOf = parseInt(precioHoraMOOficial * (1 + (porcent / 100)))

  colManoDeObra.doc("valorHOF").set({ valorH: precioActualizadoOf })
    .then(function () {
      $$("#precioActualizadoOficial").text(precioActualizadoOf)
      console.log("Actualizado correctamente");
      refreshInsumosCostos()
      texto = `<h3>Actualizando precio...</h3> <h5>Nuevo valor: $${precioActualizadoOf}</h5>`
      pantalla = '/prices/'
      loader(texto, pantalla)
    })
    .catch(function (err) {
      console.log(err);
    });
}

//Función para actulizar precios de MO
function actualizarPreciosMOAy(porcent) {
  porcentajeActualizacionAy = $$("#porcentActualAyudante").val()
  porcent = porcentajeActualizacionAy

  precioActualizadoAy = parseInt(precioHoraMOAyudante * (1 + (porcent / 100)))

  colManoDeObra.doc("valorHAY").set({ valorH: precioActualizadoAy })
    .then(function () {
      $$("#precioActualizadoAyudante").text(precioActualizadoAy)
      console.log("Actualizado correctamente");
      refreshInsumosCostos()
      texto = `<h3>Actualizando precio...</h3> <h5>Nuevo valor: $${precioActualizadoAy}</h5>`
      pantalla = '/prices/'
      loader(texto, pantalla)
    })
    .catch(function (err) {
      console.log(err);
    });

}

//Función para actualizar todos los precios
function actualizarTodosPreciosMO() {
  porcentajeTodos = $$("#porcentActualTodosMO").val()

  precioActualizadoOf = parseInt(precioHoraMOOficial * (1 + (porcentajeTodos / 100)))
  precioActualizadoAy = parseInt(precioHoraMOAyudante * (1 + (porcentajeTodos / 100)))

  colManoDeObra.doc("valorHAY").update({ valorH: precioActualizadoAy })
    .then(function () {
      console.log("Precio Ayudante actualizado correctamente");
    })
    .catch(function (err) {
      console.log(err);
    });
  colManoDeObra.doc("valorHOF").update({ valorH: precioActualizadoOf })
    .then(function () {
      console.log("Precio Oficial actualizado correctamente");
      refreshInsumosCostos()
    })
    .catch(function (err) {
      console.log(err);
    });

  texto = `<h3>Actualizando precios...</h3>`
  pantalla = '/prices/'
  loader(texto, pantalla)

}

//Función para espera de carga de datos
function toListPreciosIn() {
  setTimeout(function () {
    mainView.router.navigate('/preciosInsumos/')
  }, 1000)
}

//Función loader para actualización
function loader(texto, pantalla) {

  app.dialog.preloader(texto);

  setTimeout(function () {
    app.dialog.close();
    //Se pasa a la pantalla de confirmación del turno
    mainView.router.navigate(pantalla)
  }, 4000);
}

//Funcion para ver precios de insumos
var preciosInsumos
function pricesInsumos() {

  colInsumos.orderBy("nombre").get()
    .then(function (res) {
      preciosInsumos = []

      res.forEach(function (doc) {

        info = doc.data()

        preciosInsumos.push(info.precio)

      })
      //Precios de insumos
      precioUnCola = `${preciosInsumos[0]}`
      precioUnDiluyente = `${preciosInsumos[1]}`
      precioUnFlete = `${preciosInsumos[2]}`
      precioUnLijas = `${preciosInsumos[3]}`
      precioUnLuz = `${preciosInsumos[4]}`
      precioUnPinceles = `${preciosInsumos[5]}`
      precioUnPintura = `${preciosInsumos[6]}`
      precioUnRodillos = `${preciosInsumos[7]}`
      precioUnSilastic = `${preciosInsumos[8]}`
      precioUnVidrio = `${preciosInsumos[9]}`

    })
    .catch(function (err) { console.log(err); })
}

//Función para actualizar precios de insumos
function actualizarPreciosInsumos() {

  botones = document.querySelectorAll('.boton');
  inputs = document.querySelectorAll('.porcentaje');
  precios = document.querySelectorAll('.precios');

  botones.forEach(function (boton, index) {
    boton.addEventListener('click', function () {
      valorPorcentaje = parseInt(inputs[index].value);

      resultado = parseInt(preciosInsumos[index] * (1 + (valorPorcentaje / 100)))

      colInsumos.orderBy("nombre").get()
        .then(function (res) {
          nombres = []
          ids = []
          res.forEach(function (doc) {
            info = doc.data()
            ids.push(doc.id);
            nombres.push(info.nombre)
          })

          console.log(nombres);
          console.log(ids);

          insumoActualizado = nombres[index]

          valorId = ids[index]

          colInsumos.doc(valorId).update({ precio: resultado })
            .then(function (res) {
              console.log(`Valor de ${insumoActualizado} actualizado correctamente`);
              refreshInsumosCostos()
              texto = `<h3>Actualizando precio...</h3> <h5>Nuevo valor: $${resultado}</h5>`
              pantalla = '/prices/'
              loader(texto, pantalla)
            })
            .catch(function (err) { console.log(err); })
        })
        .catch(function (err) { console.log(err); })

    });
  });
}

//Actualizar todos los precios de insumos
function actualizarTodosLosInsumos() {

  porcentaje = $$("#porcentActualTodosIn").val()

  colInsumos.orderBy("nombre").get()
    .then(function (res) {
      precios = []
      ids = []
      res.forEach(function (doc) {
        info = doc.data()
        id = doc.id
        precio = info.precio

        //Operación
        resultado = parseInt(precio * (1 + (porcentaje / 100)))

        ids.push(id)
        precios.push(resultado)

      })

      for (i = 0; i < ids.length; i++) {
        colInsumos.doc(ids[i]).update({ precio: precios[i] })
          .then(function (res) {
            console.log("Todos los precios actualizados correctamente");
            refreshInsumosCostos()
            texto = `<h3>Actualizando precios...</h3>`
            pantalla = '/prices/'
            loader(texto, pantalla)
          })
          .catch(function (err) { console.log(err); })
      }

    })
    .catch(function (err) { console.log(err); })
}

//Ver y actualizar proveedores individualmente
function actualizarProveedores() {

  botones = document.querySelectorAll('.botonActProv');
  inputs = document.querySelectorAll('.porcentajeProv');

  botones.forEach(function (boton, index) {
    boton.addEventListener('click', function () {

      console.log(boton.id, index, inputs[index].value);


      colProductos.where("Proveedor", "==", boton.id).get()
        .then(function (res) {
          preciosProveedores = []
          res.forEach(function (doc) {
            info = doc.data()
            id = doc.id
            console.log(info);
            preciosProveedores.push({ id: id, price: info.PrecioMueble, costIn: info.CostoIn, costMo: info.CostoMO })
          })

          console.log(preciosProveedores);
          for (i = 0; i < preciosProveedores.length; i++) {
            valor = preciosProveedores[i].price
            porcentajeDeActual = inputs[index].value

            precioActualizado = parseInt(valor * (1 + (porcentajeDeActual / 100)))

            precioFinalActualizado = parseInt(precioActualizado + preciosProveedores[i].costIn + preciosProveedores[i].costMo)

            console.log(precioActualizado, precioFinalActualizado);


            colProductos.doc(preciosProveedores[i].id).update({ PrecioMueble: precioActualizado, PrecioFinal: precioFinalActualizado })
              .then(function (res) {
                console.log("Precio actualizado correctamente")
                refreshInsumosCostos()
              })
              .catch(function (err) { console.log(err); })

          }
          texto = `<h3>Actualizando precios del proveedor seleccionado...</h3>`
          pantalla = '/index/'
          loader(texto, pantalla)
        })
        .catch(function (err) { console.log(err); })
    })
  })

}

//Ver y actualizar todos los proveedores
function actualizarTodosLosProveedores() {
  porcentajeTodos = $$("#porcentActualTodosProveedores").val()

  colProductos.orderBy("Proveedor").get()
    .then(function (res) {

      idsValores = []
      res.forEach(function (doc) {
        id = doc.id
        info = doc.data()
        valor = info.PrecioMueble

        precioActualizado = parseInt(valor * (1 + (porcentajeTodos / 100)))
        idsValores.push({ id: id, precio: precioActualizado, costIn: info.CostoIn, costMo: info.CostoMO })


      })
      console.log(idsValores);
      for (i = 0; i < idsValores.length; i++) {

        precioTotalActualizado = parseInt(idsValores[i].costIn + idsValores[i].costMo + idsValores[i].precio)

        colProductos.doc(idsValores[i].id).update({ PrecioMueble: idsValores[i].precio, PrecioFinal: precioTotalActualizado })
          .then(function (res) {
            console.log("Todos los precios actualizados");
            refreshInsumosCostos()
          })

          .catch(function (err) { console.log(err); })
      }
      texto = `<h3>Actualizando precios de todos proveedores...</h3>`
      pantalla = '/index/'
      loader(texto, pantalla)

    })
    .catch(function (err) { console.log(err); })

}

//Función para guardar el precio final en cada producto
function guardarPrecioFinal() {
  colProductos.doc("GrCa2cemdlHT46hsX6rm").get()
    .then(function (resp) {
      console.log(resp.data());

    })
    .catch(function (err) { console.log(err); })

}

//Función para actualizar precios y costos finales
function refreshInsumosCostos() {
  colProductos.orderBy("Nombre").get()
    .then(function (res) {

      cantidades = []

      res.forEach(function (doc) {
        info = doc.data()

        id = doc.id

        cantUnCola = info.Cola
        cantUnDiluyente = info.Diluyente
        cantUnFlete = info.Flete
        cantUnLijas = info.Lijas
        cantUnLuz = info.Luz
        cantUnPinceles = info.Pinceles
        cantUnPintura = info.Pintura
        cantUnRodillos = info.Rodillos
        cantUnSilastic = info.Silastic
        cantUnVidrio = info.Vidrios
        mueble = info.PrecioMueble
        hsTrabajo = info.Hstrabajo


        cantidades.push({ id: id, cola: cantUnCola, diluyente: cantUnDiluyente, flete: cantUnFlete, lijas: cantUnLijas, luz: cantUnLuz, pinceles: cantUnPinceles, pintura: cantUnPintura, rodillos: cantUnRodillos, silastic: cantUnSilastic, vidrio: cantUnVidrio, mueble: mueble, hsTrabajo: hsTrabajo })
      })

      colManoDeObra.get()
        .then(function (res) {
          var valoresH = []

          res.forEach(function (doc) {
            datos = doc.data();
            valoresH.push(datos.valorH)
          })

          precioHora = parseInt(valoresH[0] + valoresH[1])

          colInsumos.orderBy("nombre").get()
            .then(function (resp) {
              priceInsumo = []
              resp.forEach(function (docum) {
                prices = docum.data()
                pricesIn = prices.precio
                priceInsumo.push(pricesIn)
              })

              for (i = 0; i < cantidades.length; i++) {
                totalInsumos = parseInt((cantidades[i].cola * priceInsumo[0]) + (cantidades[i].diluyente * priceInsumo[1]) + (cantidades[i].flete * priceInsumo[2]) + (cantidades[i].lijas * priceInsumo[3]) + (cantidades[i].luz * priceInsumo[4]) + (cantidades[i].pinceles * priceInsumo[5]) + (cantidades[i].pintura * priceInsumo[6]) + (cantidades[i].rodillos * priceInsumo[7]) + (cantidades[i].silastic * priceInsumo[8]) + (cantidades[i].vidrio * priceInsumo[9]) + (cantidades[i].mueble))
                totalMO = parseInt((cantidades[i].hsTrabajo * precioHora))
                precioFinal = parseInt(totalInsumos + totalMO)

                console.log(totalInsumos, totalMO, cantidades[i].hsTrabajo);

                colProductos.doc(cantidades[i].id).update({ CostoIn: totalInsumos, CostoMO: totalMO, PrecioFinal: precioFinal })
                  .then(function (resp) {
                    console.log("Costos reflejados Ok");

                  })
                  .catch(function (err) { console.log(err); })
              }

            })
            .catch(function (err) { console.log(err) })

        })
        .catch(function (err) { console.log(err); })

    })
    .catch(function (err) { console.log(err) })
}


/* ----------------------------------- -- ----------------------------------- */
//Array productos

/* var productos = [
  [
      "VAJILLERO",
      {alto:"90CM", ancho:"100CM", prof:"40CM", precioCru:"50000", precioTon:"60000", precioPin:"70000", rutaImg:"./img/1.png"},
      {alto:"90CM", ancho:"120CM", prof:"40CM", precioCru:"52000", precioTon:"62000", precioPin:"72000", rutaImg:"./img/1.png"}
   ],
  [
      "CAMAS",
      {alto:"90CM", ancho:"100CM", prof:"40CM", precioCru:"50000", precioTon:"60000", precioPin:"70000", rutaImg:"./img/1.png"},
      {alto:"90CM", ancho:"120CM", prof:"40CM", precioCru:"52000", precioTon:"62000", precioPin:"72000", rutaImg:"./img/1.png"}
   ],
  [
      "MESADA",
      {alto:"90CM", ancho:"100CM", prof:"40CM", precioCru:"50000", precioTon:"60000", precioPin:"70000", rutaImg:"./img/1.png"},
      {alto:"90CM", ancho:"120CM", prof:"40CM", precioCru:"52000", precioTon:"62000", precioPin:"72000", rutaImg:"./img/1.png"}
   ],
  [
      "VIDRIERO",
      {alto:"90CM", ancho:"100CM", prof:"40CM", precioCru:"50000", precioTon:"60000", precioPin:"70000", rutaImg:"./img/1.png"},
      {alto:"90CM", ancho:"120CM", prof:"40CM", precioCru:"52000", precioTon:"62000", precioPin:"72000", rutaImg:"./img/1.png"}
   ]
]; */
/* ----------------------------------- -- ----------------------------------- */





//Función para descargar imagen con lista de precios
function bajarImg() {

  titulo = $$(".tituloProducto").text().toLowerCase();
  productos[0][1].precioCru = $$("#p1").text()
  console.log(productos[0][1].precioCru);
  console.log($$("#p1").text());
  console.log(productos);
  productos.push()

  html2canvas(document.querySelector(".contenedor")).then(canvas => {
    var myImage = canvas.toDataURL("/imgs/ListaDeProductos.jpg");
    var link = document.createElement("a");
    link.href = myImage
    link.download = "Lista de Precios " + titulo + ".jpg";
    link.click();

  })
}

//Función para mostrar productos a incluir en flier
function filtrar() {
  productosFiltrados = []
  insumos = []
  console.log($$("#OpProductos").val());

  product = $$("#OpProductos").val()

  colProductos.orderBy("Nombre").where("Nombre", "==", product).get()
    .then(function (res) {
      
      res.forEach(function (doc) {
        info = doc.data()
        productosFiltrados.push(info)

        colInsumos.get()
          .then(function (res) {
            res.forEach(function (doc) {
              infoInsumos = doc.data()
              insumos.push(infoInsumos)
            })

            console.log(productosFiltrados);
            $$(".listaFlier").html("")

            $$(`#tituloLista`).text(product + "s")

            for (i = 0; i < productosFiltrados.length; i++) {

              valoresSinPintura = parseInt(productosFiltrados[i].PrecioFinal - (insumos[6].precio * productosFiltrados[i].Pintura))
              


              $$(".listaFlier").prepend(`
        
            <li class="item-content">
              
              <div class="item-inner cajaProducto">
                <div class="item-title-row">
                  <div class="item-title"></div>
                </div>
                <div class="item-subtitle">
                  <div class="fMed">
                    <p class="tMed">ALTO:</p>
                    <p id="altoP${i}" class="vMed"></p>
                  </div>
                  <div class="fMed">
                    <p class="tMed">ANCHO: </p>
                    <p id="anchoP${i}" class="vMed"> </p>
                  </div>
                  <div class="fMed">
                    <p class="tMed">PROF.</p>
                    <p id="profP${i}" class="vMed"></p>
                  </div>
                </div>
                <div class="con-precios">
                  <div class="precio">
                    <h2>$${valoresSinPintura}</h2>
                    <h2 id="p1"></h2>
                </div>
                  <div class="precio">
                    <h2>$${valoresSinPintura}</h2>
                    <h2 id="p2"></h2>
                </div>
                  <div class="precio">
                    <h2>$${productosFiltrados[i].PrecioFinal}</h2>
                    <h2 id="p3"></h2>
                  </div>
                </div>
                <div class="item-media fotoProducto"><img src="./img/2.png"/></div>

              </div>
            </li>

                         `)


              $$(`#altoP${i}`).text(productosFiltrados[i].Alto + " CM")
              $$(`#anchoP${i}`).text(productosFiltrados[i].Ancho + " CM")
              $$(`#profP${i}`).text(productosFiltrados[i].Largo + " CM")

            }

            $$(".contOculto").removeClass("contOculto").addClass("contenedor")
            $$("#downloadImg").removeClass("btnOculto").addClass("btnVisible")

          })
          .catch(function (err) { console.log(err); })
      })
    })
    .catch(function (err) { console.log(err); })

}

//Función para descargar lista de precios

function downloadImg() {
  
  titulo = $$("#tituloLista").text().toLowerCase()
/*   productos[0][1].precioCru = p1.text()
  console.log(productos[0][1].precioCru);
  console.log(p1.text());
  console.log(productos);
  productos.push() */

  html2canvas(document.querySelector(".contenedor")).then(canvas => {
      var myImage = canvas.toDataURL("/imgs/ListaDeProductos.jpg");
      var link = document.createElement("a");
      link.href = myImage
      link.download = "Lista de Precios " + titulo + ".jpg";
      link.click();
      
  })
}

//Función para mostrar opciones
function mostrarOpProductos() {

  colProductos.orderBy("Nombre").get()
    .then(function (res) {

      opcionesProductosSinFiltrar = []
      res.forEach(function (doc) {
        info = doc.data()
        nombre = info.Nombre
        tipo = info.Tipo

        opProduct = `${nombre}`
        opcionesProductosSinFiltrar.push(opProduct)
      })

      opcionesProductosFiltrado = opcionesProductosSinFiltrar.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });


      $$("#OpProductos").append(`<option selected value="---">Seleccione un producto</option>`)

      for (i = 0; i < opcionesProductosFiltrado.length; i++) {
        console.log(opcionesProductosFiltrado[i]);
        $$("#OpProductos").append(`<option id="op${opcionesProductosFiltrado[i]}" value="${opcionesProductosFiltrado[i]}">${opcionesProductosFiltrado[i]}</option>`)
      }




    })
    .catch(function (err) { console.log(err); })

}
