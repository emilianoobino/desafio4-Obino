const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultId = 0;

        // Cargar los carritos almacenados en el archivo
        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error al cargar los carritos: ", error);
            throw new Error("Error al cargar los carritos");
        }
    }

    async guardarCarritos() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error al guardar los carritos: ", error);
            throw new Error("Error al guardar los carritos");
        }
    }

    async crearCarrito() {
        try {
            const nuevoCarrito = {
                id: ++this.ultId,
                products: []
            }

            this.carts.push(nuevoCarrito);

            await this.guardarCarritos();
            return nuevoCarrito;
        } catch (error) {
            console.error("Error al crear un nuevo carrito: ", error);
            throw new Error("Error al crear un nuevo carrito");
        }
    }

    async getCarritoById(carritoId) {
        try {
            const carrito = this.carts.find(c => c.id === carritoId);
            if (!carrito) {
                throw new Error("No se encontró el carrito con ese ID");
            }
            return carrito;
        } catch (error) {
            console.error("Error al obtener un carrito por ID: ", error);
            throw new Error("Error al obtener un carrito por ID");
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            const existeProducto = carrito.products.find(p => p.product === productoId);
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productoId, quantity });
            }
            await this.guardarCarritos();
            return carrito;
        } catch (error) {
            console.error("Error al agregar producto al carrito: ", error);
            throw new Error("Error al agregar producto al carrito");
        }
    }
}

module.exports = CartManager;
