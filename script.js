
const book = document.getElementById("book");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const pageCounter = document.getElementById("pageCounter");

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");

let currentPage = 0;

const pages = [

    {
        type: "cover",
        image: "portada.jpg"
    },

    {
        type: "text",
        title: "Para ti",
        text: `Este pequeño libro es para ti

Aquí guardé algunas palabras, recuerdos
y detalles que quiero compartir contigo

No es un libro cualquiera, es una pequeña
parte de todo lo bonito que hemos vivido`
    },

    {
        type: "text",
        title: "Nuestro primer mes",
        text: `Hoy cumplimos nuestro primer mes juntas

Quería hacer algo especial para guardar
este momento y tener un pequeño recuerdo
de nuestro comienzo

Espero que disfrutes cada página
porque preparé todo pensando en ti`
    },

    {
        type: "photo",
        title: "Un recuerdo",
        image: "fotos/foto1.jpg",
        caption: "Un momento que quiero conservar"
    },

    {
        type: "text",
        title: "Lo que me gusta de ti",
        text: `Me gusta poder compartir mis días contigo

Me gusta escucharte, conocerte un poquito
más y descubrir todas esas cosas que te
hacen ser tú

Hay muchos detalles tuyos que valoro
y que hacen especial nuestra historia`
    },

    {
        type: "photo",
        title: "Otro recuerdo",
        image: "fotos/foto2.jpg",
        caption: "Uno de mis momentos favoritos"
    },

    {
        type: "text",
        title: "Y esto apenas comienza",
        text: `Quiero que este sea solamente el primer
capítulo de muchos que todavía nos quedan

Gracias por compartir este comienzo conmigo
y por formar parte de mi vida

Feliz primer mes

Con mucho cariño`
    },

    {
        type: "back",
        image: "contraportada.jpg"
    }

];

function createPage(page) {

    if (page.type === "cover") {
        return `
            <div class="page cover-page">
                <img class="cover-image"
                     src="${page.image}"
                     alt="Portada del libro">

                <button class="cover-button"
                        id="openBook">
                    Abrir libro
                </button>
            </div>
        `;
    }

    if (page.type === "back") {
        return `
            <div class="page back-page">
                <img class="cover-image"
                     src="${page.image}"
                     alt="Contraportada del libro">
            </div>
        `;
    }

    if (page.type === "photo") {
        return `
            <div class="page paper">
                <h2>${page.title}</h2>

                <img class="paper-photo"
                     src="${page.image}"
                     alt="${page.caption}">

                <p class="caption">${page.caption}</p>
            </div>
        `;
    }

    return `
        <div class="page paper">
            <h2>${page.title}</h2>
            <p>${page.text}</p>
        </div>
    `;
}

function showPage() {

    book.innerHTML = createPage(pages[currentPage]);

    prevButton.disabled = currentPage === 0;

    nextButton.disabled =
        currentPage === pages.length - 1;

    if (currentPage === 0) {
        pageCounter.textContent = "Portada";
        nextButton.textContent = "Abrir libro";
    } else if (currentPage === pages.length - 1) {
        pageCounter.textContent = "Final";
        nextButton.textContent = "Final";
    } else {
        pageCounter.textContent =
            `Página ${currentPage} de ${pages.length - 2}`;

        nextButton.textContent = "Siguiente";
    }

    const openButton = document.getElementById("openBook");

    if (openButton) {
        openButton.addEventListener("click", nextPage);
    }
}

function nextPage() {

    if (currentPage < pages.length - 1) {
        currentPage++;
        showPage();
    }

}

function previousPage() {

    if (currentPage > 0) {
        currentPage--;
        showPage();
    }

}

nextButton.addEventListener("click", nextPage);
prevButton.addEventListener("click", previousPage);

// Música
musicButton.addEventListener("click", async () => {

    if (music.paused) {

        try {
            await music.play();
            musicButton.textContent = "Pausar música";
        } catch (error) {
            musicButton.textContent = "Intenta reproducir";
        }

    } else {

        music.pause();
        musicButton.textContent = "♫ Reproducir";

    }

});

// Deslizar páginas
let touchStartX = 0;

book.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

book.addEventListener("touchend", event => {

    const touchEndX = event.changedTouches[0].screenX;
    const difference = touchEndX - touchStartX;

    if (Math.abs(difference) > 60) {

        if (difference < 0) {
            nextPage();
        } else {
            previousPage();
        }

    }

}, { passive: true });

// Mostrar primera página
showPage();

// Registrar aplicación sin conexión
if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./sw.js")
            .catch(error => {
                console.error("Error del service worker:", error);
            });

    });

}
