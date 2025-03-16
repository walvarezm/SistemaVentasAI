// ======== MODELO ========
// Archivo: Model.gs

/**
 * Modelo para gestionar los datos
 */
class InventarioModel {
    constructor() {
      // ID de la hoja de cálculo (reemplazar con ID real)
      //https://docs.google.com/spreadsheets/d/1f__0XK3udr0J9ghLLSwaBtCAmcu5sZtBH5z2tmznWqw/edit?usp=sharing
      this.spreadsheetId = "1f__0XK3udr0J9ghLLSwaBtCAmcu5sZtBH5z2tmznWqw";
      this.ss = SpreadsheetApp.openById(this.spreadsheetId);
    }
    
    /**
     * Obtiene todos los productos del inventario
     */
    getProductos() {
      const sheet = this.ss.getSheetByName("Inventario");
      const data = sheet.getDataRange().getValues();
      const headers = data.shift();
      
      return data.map(row => {
        let producto = {};
        headers.forEach((header, index) => {
          producto[header] = row[index];
        });
        return producto;
      });
    }
    
    /**
     * Busca productos por nombre o código
     */
    buscarProductos(query) {
      const productos = this.getProductos();
      query = query.toLowerCase();
      
      return productos.filter(producto => 
        producto.codigo.toString().toLowerCase().includes(query) || 
        producto.nombre.toLowerCase().includes(query)
      );
    }
    
    /**
     * Agrega un nuevo producto al inventario
     */
    agregarProducto(producto) {
      const sheet = this.ss.getSheetByName("Inventario");
      sheet.appendRow([
        producto.codigo,
        producto.nombre,
        producto.descripcion,
        producto.categoria,
        producto.precio,
        producto.stock,
        producto.proveedor,
        new Date()
      ]);
      return true;
    }
    
    /**
     * Actualiza un producto existente
     */
    actualizarProducto(codigo, datosActualizados) {
      const sheet = this.ss.getSheetByName("Inventario");
      const data = sheet.getDataRange().getValues();
      const headers = data.shift();
      
      for (let i = 0; i < data.length; i++) {
        if (data[i][0] === codigo) {
          // Actualizar cada campo
          Object.keys(datosActualizados).forEach(campo => {
            const colIndex = headers.indexOf(campo);
            if (colIndex !== -1) {
              sheet.getRange(i + 2, colIndex + 1).setValue(datosActualizados[campo]);
            }
          });
          return true;
        }
      }
      return false;
    }
    
    /**
     * Elimina un producto
     */
    eliminarProducto(codigo) {
      const sheet = this.ss.getSheetByName("Inventario");
      const data = sheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === codigo) {
          sheet.deleteRow(i + 1);
          return true;
        }
      }
      return false;
    }
    
    /**
     * Registra una venta
     */
    registrarVenta(venta) {
      // Registrar en la hoja de ventas
      const sheetVentas = this.ss.getSheetByName("Ventas");
      sheetVentas.appendRow([
        venta.numeroVenta,
        venta.fecha,
        venta.cliente,
        venta.total,
        venta.metodoPago,
        JSON.stringify(venta.items)
      ]);
      
      // Actualizar inventario
      venta.items.forEach(item => {
        this.actualizarStock(item.codigo, -item.cantidad);
      });
      
      return venta.numeroVenta;
    }
    
    /**
     * Actualiza el stock de un producto
     */
    actualizarStock(codigo, cantidad) {
      const sheet = this.ss.getSheetByName("Inventario");
      const data = sheet.getDataRange().getValues();
      const headers = data.shift();
      const stockIndex = headers.indexOf("stock");
      
      for (let i = 0; i < data.length; i++) {
        if (data[i][0] === codigo) {
          const nuevaCantidad = data[i][stockIndex] + cantidad;
          sheet.getRange(i + 2, stockIndex + 1).setValue(nuevaCantidad);
          return nuevaCantidad;
        }
      }
      return false;
    }
    
    /**
     * Obtiene todas las ventas
     */
    getVentas() {
      const sheet = this.ss.getSheetByName("Ventas");
      const data = sheet.getDataRange().getValues();
      const headers = data.shift();
      console.log(data,headers);
      return data.map(row => {
        let venta = {};
        headers.forEach((header, index) => {
          if (header === "items") {
            venta[header] = JSON.parse(row[index]);
          }else if (header === "fecha") {
            venta[header] = this.formatDate(row[index]);
          } else {
            venta[header] = row[index];
          }
        });
        return venta;
      });
    }
    
    /**
     * Obtiene datos para el dashboard
     * 
     * @returns {Object} Datos del dashboard
     * @returns {number} return.totalProductos - Total de productos en el inventario
     * @returns {number} return.bajoStock - Número de productos con bajo stock (menos de 10 unidades)
     * @returns {number} return.totalVentasMes - Total de ventas del mes actual
     * @returns {Array} return.topProductos - Lista de los 5 productos más vendidos
     * @returns {string} return.ultimaVenta - Fecha de la última venta
     */
    getDashboardData() {
      const productos = this.getProductos();
      const ventas = this.getVentas();
      console.log(ventas[0].fecha);
      // Total de productos
      const totalProductos = productos.length;
      
      // Productos con bajo stock (menos de 10 unidades)
      const bajoStock = productos.filter(p => p.stock < 10).length;
      
      // Total de ventas del mes actual
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const ventasMes = ventas.filter(v => new Date(v.fecha) >= inicioMes);
      const totalVentasMes = ventasMes.reduce((suma, v) => suma + v.total, 0);
      const ultimaVenta = this.formatDate(ventas[0].fecha);
      
      // Productos más vendidos
      const productosVendidos = {};
      ventas.forEach(venta => {
        venta.items.forEach(item => {
          if (!productosVendidos[item.codigo]) {
            productosVendidos[item.codigo] = 0;
          }
          productosVendidos[item.codigo] += item.cantidad;
        });
      });
      
      const topProductos = Object.entries(productosVendidos)
        .map(([codigo, cantidad]) => {
          const producto = productos.find(p => p.codigo === codigo);
          return {
            codigo,
            nombre: producto ? producto.nombre : "Desconocido",
            cantidad
          };
        })
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);
      
      return {
        totalProductos,
        bajoStock,
        totalVentasMes,
        topProductos,
        ultimaVenta
      };
    }

    // Format date
    formatDate(date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      return new Intl.DateTimeFormat('es-MX').format(date);
    }

    /**
     * Function to validate user login
     * 
     * @param {username} username 
     * @param {password} password 
     * @returns return object with success and userData
     */
    validarLogin(username, password) {
      try {
        const usersSheet = this.ss.getSheetByName('Usuarios'); // Make sure this sheet exists
        const data = usersSheet.getDataRange().getValues();
        
        // Skip header row
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (row[0] === username && row[1] === password) {
            return {
              success: true,
              userData: {
                usuario: row[0],
                sucursal: row[2],    // Sucursal
                perfil: row[3],   // Perfil
                nombre: row[4],      // Nombre
                email: row[5]      // Email
              }
            };
          }
        }
        
        return {
          success: false,
          error: 'Usuario o contraseña incorrectos'
        };
      } catch (error) {
        return {
          success: false,
          error: error.toString()
        };
      }
    }


  }