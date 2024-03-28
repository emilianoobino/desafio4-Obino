const express = require("express");
const router = express.Router();
const CartManager = require("../Controllers/cart-manager.js");
const cartManager = new CartManager("./src/Models/carts.json");

// Creamos un nuevo carrito:

router.post("/carts", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: "Error interno del servidor"
        });
    }
})

//Listamos productos que pertenecen a un carrito determinado

router.get("/carts/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        if (!carrito) {
            return res.status(404).json({
                status: false,
                msg: "El carrito no fue encontrado"
            });
        }
        res.json(carrito.products);
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: "Error interno del servidor"
        });
    }
})

module.exports = router;
