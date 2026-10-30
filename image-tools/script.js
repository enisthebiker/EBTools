
const trBtn = document.getElementById("trBtn");
const enBtn = document.getElementById("enBtn");

function setLanguage(language) {
    document.documentElement.lang = language;

    document.querySelectorAll("[data-tr][data-en]").forEach(element => {
        element.textContent = element.dataset[language];
    });

    localStorage.setItem("ebToolsLanguage", language);
}

trBtn.addEventListener("click", () => setLanguage("tr"));
enBtn.addEventListener("click", () => setLanguage("en"));

setLanguage(localStorage.getItem("ebToolsLanguage") || "tr");
