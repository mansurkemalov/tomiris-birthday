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
let playRequestId = 0;


// Сброс состояния кнопки
function resetMusicButton(button) {
    if (!button) return;

    const icon = button.querySelector(".play-icon");

    if (icon) {
        icon.textContent = "▶";
    }

    button.classList.remove("playing");
}


// Остановка текущей песни
function stopCurrentAudio() {
    // Отменяем результаты предыдущих запросов воспроизведения
    playRequestId++;

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.removeAttribute("src");
        currentAudio.load();
    }

    resetMusicButton(currentButton);

    currentAudio = null;
    currentButton = null;
}


// Воспроизведение с одной повторной попыткой
async function playMusic(audio, button, requestId) {
    const icon = button.querySelector(".play-icon");

    if (!icon) return;

    for (let attempt = 0; attempt < 2; attempt++) {
        // Если пользователь уже переключил песню — прекращаем
        if (
            requestId !== playRequestId ||
            audio !== currentAudio
        ) {
            return;
        }

        try {
            // Ждём, пока браузер загрузит данные для воспроизведения
            if (audio.readyState < 2) {
                await new Promise((resolve, reject) => {
                    const cleanup = () => {
                        audio.removeEventListener("canplay", onReady);
                        audio.removeEventListener("error", onError);
                    };

                    const onReady = () => {
                        cleanup();
                        resolve();
                    };

                    const onError = () => {
                        cleanup();
                        reject(
                            audio.error ||
                            new Error("Не удалось загрузить аудио")
                        );
                    };

                    audio.addEventListener("canplay", onReady, {
                        once: true
                    });

                    audio.addEventListener("error", onError, {
                        once: true
                    });

                    audio.load();

                    // Если данные уже доступны, продолжаем
                    if (audio.readyState >= 2) {
                        cleanup();
                        resolve();
                    }
                });
            }

            if (
                requestId !== playRequestId ||
                audio !== currentAudio
            ) {
                return;
            }

            await audio.play();

            if (
                requestId !== playRequestId ||
                audio !== currentAudio
            ) {
                audio.pause();
                return;
            }

            icon.textContent = "❚❚";
            button.classList.add("playing");

            return;

        } catch (error) {
            console.error(
                `Ошибка воспроизведения (попытка ${attempt + 1}):`,
                error
            );

            if (
                requestId !== playRequestId ||
                audio !== currentAudio
            ) {
                return;
            }

            // Повторяем попытку только один раз
            if (attempt === 0) {
                await new Promise(resolve => setTimeout(resolve, 400));
                continue;
            }

            resetMusicButton(button);

            // Не показываем системное окно при каждом сбое.
            // Сохраняем подробности ошибки в консоли.
            return;
        }
    }
}


// Обработчики музыкальных кнопок
musicButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        const song = button.dataset.song;

        if (!song) {
            console.error("У музыкальной кнопки отсутствует data-song.");
            return;
        }

        // Повторное нажатие на текущую песню — пауза или продолжение
        if (currentAudio && currentButton === button) {
            if (currentAudio.paused) {
                const requestId = ++playRequestId;

                await playMusic(
                    currentAudio,
                    button,
                    requestId
                );
            } else {
                currentAudio.pause();
                resetMusicButton(button);
            }

            return;
        }

        // Останавливаем предыдущую песню
        stopCurrentAudio();

        const requestId = ++playRequestId;

        try {
            // Корректно формируем URL относительно адреса сайта
            const songURL = new URL(song, document.baseURI);

            const audio = new Audio();

            audio.preload = "auto";
            audio.volume = 0.75;
            audio.src = songURL.href;

            currentAudio = audio;
            currentButton = button;

            // Если воспроизведение завершилось
            audio.addEventListener("ended", () => {
                if (currentAudio !== audio) return;

                resetMusicButton(button);

                currentAudio = null;
                currentButton = null;

                playRequestId++;
            });

            // Дополнительная диагностика ошибок загрузки
            audio.addEventListener("error", () => {
                if (currentAudio !== audio) return;

                console.error("Ошибка загрузки песни:", {
                    file: songURL.href,
                    code: audio.error?.code,
                    message: audio.error?.message
                });
            });

            await playMusic(
                audio,
                button,
                requestId
            );

        } catch (error) {
            console.error("Ошибка музыкального плеера:", error);

            if (requestId === playRequestId) {
                resetMusicButton(button);
            }
        }
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
