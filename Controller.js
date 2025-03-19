// ======== CONTROLADOR ========
// Archivo: Controller.gs

/**
 * Controlador para manejar las acciones del usuario
 */
class InventarioController {
    constructor() {
      this.model = new InventarioModel();
    }
    
    /**
     * Obtiene todos los productos
     */
    getProductos() {
      return this.model.getProductos();
    }
    
    /**
     * Busca productos por término
     */
    buscarProductos(query) {
      return this.model.buscarProductos(query);
    }
    
    /**
     * Agrega un nuevo producto
     */
    agregarProducto(productoData) {
      return this.model.agregarProducto(productoData);
    }
    
    /**
     * Actualiza un producto existente
     */
    actualizarProducto(codigo, datosActualizados) {
      return this.model.actualizarProducto(codigo, datosActualizados);
    }
    
    /**
     * Elimina un producto
     */
    eliminarProducto(codigo) {
      return this.model.eliminarProducto(codigo);
    }
    
    /**
     * Registra una venta
     */
    registrarVenta(ventaData) {
      // Generar número de venta único
      ventaData.numeroVenta = "V" + new Date().getTime();
      ventaData.fecha = new Date();
      
      return this.model.registrarVenta(ventaData);
    }
    
    /**
     * Obtiene todas las ventas
     */
    getVentas() {
      return this.model.getVentas();
    }
    
    /**
     * Obtiene datos para el dashboard
     */
    getDashboardData() {
      return this.model.getDashboardData();
    }

    /**
     * Valida el inicio de sesión
     */
    validarLogin(username, password) {
      return this.model.validarLogin(username, password);
    }

    logout() {
      return this.model.logout();
    }
}
  