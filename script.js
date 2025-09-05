document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");
  const textarea = form.querySelector("textarea");
  const entradas = document.getElementById("entradas");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (textarea.value.trim() !== "") {
      const nuevaEntrada = document.createElement("p");
      nuevaEntrada.textContent = textarea.value;
      entradas.appendChild(nuevaEntrada);
      textarea.value = "";
    }
  });
});
