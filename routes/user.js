const express = require("express");
const router = express.Router();
const { register, login, update, deleteUser } = require("../auth/auth.js");
const { getUsers, getUserCart, getUserOrders, addBookToCart, purchaseBook, purchaseCart  } = require("../controllers/usercontroller.js");
const { adminAuth, userAuth } = require("../middleware/auth")

router.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
router.get("/user", userAuth, (req, res) => res.send("User Route"));

router.post("/register", register);
router.post("/login", login);

router.put("/update", update);

router.get("/users", getUsers);

router.delete("/delete", deleteUser)

router.get('/users/:userId/cart', getUserCart);
router.get('/users/:userId/orders', getUserOrders);
router.post('/users/:userId/cart', addBookToCart);
router.post('/purchase', purchaseBook);

router.post('/users/:userId/purchase-cart', purchaseCart);

module.exports = router;