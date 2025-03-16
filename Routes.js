// ======== RUTAS ========
// Archivo: Routes.gs

/**
 * Función doGet para manejar solicitudes GET y renderizar la interfaz
 */
function doGet(e) {

    const action = e.parameter.action || 'login';

    if(action === 'noLogueado' || action === 'login' || action === 'logout'){
      const template = HtmlService.createTemplateFromFile('login');
      return template.evaluate()
       .setTitle('Sistema de Ventas e Inventario - Login - doGet')
       .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }else if(action === 'logueado'){
      const template = HtmlService.createTemplateFromFile('Index');
      return template.evaluate()
      .setTitle('Sistema de Ventas e Inventario - Ferretería')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
  }
  
function doPost(e) {
    const action = e.parameter.action;

    switch (action) {

      case 'validarLogin':
        let usuario = e.parameter.username; 
        let pass = e.parameter.password; 
        //return ContentService.createTextOutput(JSON.stringify(validarLoginWeb(usuario,pass)));
        let response = validarLoginWeb(usuario,pass);
        if (response.success) {
          const template = HtmlService.createTemplateFromFile('Index');
          return template.evaluate()
            .setTitle('Sistema de Ventas e Inventario - Ferretería')
            .addMetaTag('viewport', 'width=device-width, initial-scale=1')
            .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);



        } else {
          //return ContentService.createTextOutput(JSON.stringify({ error: 'Credenciales incorrectas' }));

          const template = HtmlService.createTemplateFromFile('login');
          return template.evaluate()
          .setTitle('Sistema de Ventas e Inventario - Login - doPost')
          .addMetaTag('viewport', 'width=device-width, initial-scale=1')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

        }
      case 'getUrlApp':
        return ContentService.createTextOutput(JSON.stringify(getUrlAppWeb()));
      default:
        return ContentService.createTextOutput(JSON.stringify({ error: 'Acción no válida' }));
    }
  }


  /**
   * Incluye archivos HTML
   */
  function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  }
  
  /**
   * Obtiene productos
   */
  function getProductosWeb() {
    const controller = new InventarioController();
    return controller.getProductos();
  }
  
  /**
   * Busca productos
   */
  function buscarProductosWeb(query) {
    const controller = new InventarioController();
    return controller.buscarProductos(query);
  }
  
  /**
   * Agrega un producto
   */
  function agregarProductoWeb(producto) {
    const controller = new InventarioController();
    return controller.agregarProducto(producto);
  }
  
  /**
   * Actualiza un producto
   */
  function actualizarProductoWeb(codigo, datos) {
    const controller = new InventarioController();
    return controller.actualizarProducto(codigo, datos);
  }
  
  /**
   * Elimina un producto
   */
  function eliminarProductoWeb(codigo) {
    const controller = new InventarioController();
    return controller.eliminarProducto(codigo);
  }
  
  /**
   * Registra una venta
   */
  function registrarVentaWeb(venta) {
    const controller = new InventarioController();
    return controller.registrarVenta(venta);
  }
  
  /**
   * Obtiene ventas
   */
  function getVentasWeb() {
    const controller = new InventarioController();
    return controller.getVentas();
  }
  
  /**
   * Obtiene datos del dashboard
   */
  function getDashboardDataWeb() {
    const controller = new InventarioController();
    return controller.getDashboardData();
  }

  /**
   * Valida el login
   */
  function validarLoginWeb(username, password) {
    const controller = new InventarioController();
    return controller.validarLogin(username, password);
  }
  
  /**
   * Obtiene la URL del script
   */
  function getUrlAppWeb(){
    return ScriptApp.getService().getUrl();
  }