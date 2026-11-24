
const categorias = ["Zapatos", "Vestidos", "Sacos", "Deportivos"];
let productos = [];
let carrito = [];
let usuarioActual = null;

const contenedorProductos = document.getElementById("productos");

function generarProductos() {
    productos = [];

    categorias.forEach((categoria, indice) => {
        for (let i = 1; i <= 15; i++) {
            productos.push({
                id: productos.length + 1,
                nombre: `${categoria} ${i}`,
                categoria: categoria,
                precio: 250 + (i * 35),
                imagen: `imagenes/${["zap", "ves", "sac", "dep"][indice]}${i}.jpg`
            });
        }
    });
}

function mostrarRegistro() {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("registerBox").classList.remove("hidden");
}

function mostrarLogin() {
    document.getElementById("registerBox").classList.add("hidden");
    document.getElementById("loginBox").classList.remove("hidden");
}

function registrarse() {
    const nombre = document.getElementById("registroNombre").value.trim();
    const correo = document.getElementById("registroCorreo").value.trim();
    const password = document.getElementById("registroPassword").value;

    if (!nombre || !correo || !password) {
        alert("Completa todos los campos.");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("chaka_usuarios")) || [];

    if (usuarios.some(u => u.correo === correo)) {
        alert("Este correo ya está registrado.");
        return;
    }

    usuarios.push({ nombre, correo, password });

    localStorage.setItem("chaka_usuarios", JSON.stringify(usuarios));

    usuarioActual = { nombre, correo };

    localStorage.setItem("chaka_usuario_actual", JSON.stringify(usuarioActual));

    alert("Cuenta creada correctamente.");

    abrirTienda();
}

function iniciarSesion() {
    const correo = document.getElementById("loginCorreo").value.trim();
    const password = document.getElementById("loginPassword").value;

    const usuarios = JSON.parse(localStorage.getItem("chaka_usuarios")) || [];

    const usuario = usuarios.find(u =>
        u.correo === correo && u.password === password
    );

    if (!usuario) {
        alert("Correo o contraseña incorrectos.");
        return;
    }

    usuarioActual = usuario;

    localStorage.setItem("chaka_usuario_actual", JSON.stringify(usuario));

    abrirTienda();
}

function abrirTienda() {
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("tienda").classList.remove("hidden");

    irInicio();
}

function cerrarSesion() {
    localStorage.removeItem("chaka_usuario_actual");
    usuarioActual = null;

    document.getElementById("tienda").classList.add("hidden");
    document.getElementById("auth").classList.remove("hidden");

    mostrarLogin();
}

function ocultarPaginas() {
    document.querySelectorAll(".pagina").forEach(p => {
        p.classList.add("hidden");
    });
}

function irInicio() {
    ocultarPaginas();
    document.getElementById("inicio").classList.remove("hidden");
}

function mostrarCatalogo() {
    ocultarPaginas();
    document.getElementById("catalogo").classList.remove("hidden");
    renderizarProductos("Todos");
}

function filtrarCategoria(categoria) {
    ocultarPaginas();
    document.getElementById("catalogo").classList.remove("hidden");
    renderizarProductos(categoria);
}

function renderizarProductos(categoria) {
    contenedorProductos.innerHTML = "";

    const lista = categoria === "Todos"
        ? productos
        : productos.filter(p => p.categoria === categoria);

    lista.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "producto";

        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}"
                 onerror="this.src='https://placehold.co/400x400?text=CHAKA'">
            <h3>${producto.nombre}</h3>
            <p>${producto.categoria}</p>
            <p class="precio">$${producto.precio.toFixed(2)} MXN</p>
            <button onclick="agregarCarrito(${producto.id})">
                Agregar al carrito
            </button>
        `;

        contenedorProductos.appendChild(tarjeta);
    });
}

function agregarCarrito(id) {
    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    carrito.push(producto);
    alert(`${producto.nombre} se agregó al carrito.`);
}

function mostrarCarrito() {
    ocultarPaginas();

    const paginaCarrito = document.getElementById("carrito");
    paginaCarrito.classList.remove("hidden");

    const lista = document.getElementById("listaCarrito");
    const total = document.getElementById("total");

    lista.innerHTML = "";

    if (carrito.length === 0) {
        lista.innerHTML = "<p>Tu carrito está vacío.</p>";
        total.textContent = "Total: $0.00 MXN";
        return;
    }

    carrito.forEach((producto, indice) => {
        const item = document.createElement("div");
        item.className = "carrito-item";

        item.innerHTML = `
            <div>
                <strong>${producto.nombre}</strong>
                <p>$${producto.precio.toFixed(2)} MXN</p>
            </div>
            <button onclick="eliminarCarrito(${indice})">Eliminar</button>
        `;

        lista.appendChild(item);
    });

    const suma = carrito.reduce((acc, p) => acc + p.precio, 0);

    total.textContent = `Total: $${suma.toFixed(2)} MXN`;
}

function eliminarCarrito(indice) {
    carrito.splice(indice, 1);
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}

// INICIO DEL PROGRAMA
generarProductos();

const sesionGuardada = localStorage.getItem("chaka_usuario_actual");

if (sesionGuardada) {
    usuarioActual = JSON.parse(sesionGuardada);
    abrirTienda();
}
