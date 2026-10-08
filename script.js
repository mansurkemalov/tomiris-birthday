// ========================================
// START BUTTON
// ========================================

const startButton = document.getElementById("startButton");

if (startButton) {
    startButton.addEventListener("click", () => {
        document.querySelector(".story").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}


// ========================================
// SCROLL REVEAL
// ========================================

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }

        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element, index) => {

    element.style.transitionDelay =
        `${Math.min(index % 5, 4) * 0.08}s`;

    observer.observe(element);

});


// ========================================
// MUSIC PLAYER
// ========================================

const musicButtons = document.querySelectorAll(".music-card");

let currentAudio = null;
let currentButton = null;

musicButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const song = button.dataset.song;
        const icon = button.querySelector(".play-icon");

        // Если нажали на ту же песню
        if (currentAudio && currentButton === button) {

            if (currentAudio.paused) {

                currentAudio.play()
                    .then(() => {
                        icon.textContent = "❚❚";
                    })
                    .catch((error) => {
                        console.error("Ошибка воспроизведения:", error);
                    });

            } else {

                currentAudio.pause();
                icon.textContent = "▶";

            }

            return;
        }


        // Остановить предыдущую песню
        if (currentAudio) {

            currentAudio.pause();
            currentAudio.currentTime = 0;

        }

        if (currentButton) {

            const oldIcon =
                currentButton.querySelector(".play-icon");

            if (oldIcon) {
                oldIcon.textContent = "▶";
            }

            currentButton.classList.remove("playing");

        }


        // Создать новый audio
        currentAudio = new Audio(song);
        currentButton = button;

        currentAudio.volume = 0.75;

        currentAudio.play()
            .then(() => {

                icon.textContent = "❚❚";
                button.classList.add("playing");

            })
            .catch((error) => {

                console.error("Не удалось воспроизвести:", error);

                icon.textContent = "▶";

                alert(
                    "Не удалось запустить песню.\n\n" +
                    "Проверь, что MP3 находится в папке music."
                );

            });


        // Когда песня закончилась
        currentAudio.addEventListener("ended", () => {

            icon.textContent = "▶";
            button.classList.remove("playing");

            currentAudio = null;
            currentButton = null;

        });

    });

});


// ========================================
// PHOTO MODAL
// ========================================

const photoModal = document.getElementById("photoModal");
const modalImage = document.getElementById("modalImage");
const photoClose = document.getElementById("photoClose");

const photos = document.querySelectorAll(
    ".photo-card img, .family-photo img"
);

photos.forEach((photo) => {

    photo.addEventListener("click", () => {

        modalImage.src = photo.src;
        modalImage.alt = photo.alt;

        photoModal.classList.add("active");

        document.body.classList.add("modal-open");

    });

});


function closePhotoModal() {

    photoModal.classList.remove("active");

    document.body.classList.remove("modal-open");

}


if (photoClose) {
    photoClose.addEventListener("click", closePhotoModal);
}


if (photoModal) {

    photoModal.addEventListener("click", (event) => {

        if (event.target === photoModal) {
            closePhotoModal();
        }

    });

}


// Закрытие фотографии по Escape
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closePhotoModal();
    }

});
// ========================================
// SECRET
// ========================================

const secretButton = document.getElementById("secretButton");
const secretModal = document.getElementById("secretModal");
const secretClose = document.getElementById("secretClose");

if (secretButton && secretModal) {
    secretButton.addEventListener("click", () => {
        secretModal.classList.add("active");
        document.body.classList.add("modal-open");
    });
}

if (secretClose) {
    secretClose.addEventListener("click", () => {
        secretModal.classList.remove("active");
        document.body.classList.remove("modal-open");
    });
}

if (secretModal) {
    secretModal.addEventListener("click", (event) => {
        if (event.target === secretModal) {
            secretModal.classList.remove("active");
            document.body.classList.remove("modal-open");
        }
    });
}
