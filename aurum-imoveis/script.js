const botaoEnviar = document.getElementById("enviar");
const mensAgens = document.getElementById("msg");

botaoEnviar.addEventListener("click", function () {
    const textoMensagem = mensAgens.value.trim();
    if (textoMensagem !== "") {
        alert("Mensagem enviada! Responderemos você em menos de 24h.");
    } else {
        alert("Por favor, PREENCHA o formulário antes de enviar.");
    }
});
