document.getElementById('procurar').addEventListener('click', async() => {

    console.log("Botão clicado");

    const moodTextarea = document.getElementById('mood');
    const mood = document.getElementById('mood').value.trim();
    const divResultado = document.getElementById('resultado');

    if(!mood){
        divResultado.innerHTML = "Indique-nos como se sente, por favor...";
        return;
    }

    try{

        const buttonProcurar = document.getElementById('procurar');

        buttonProcurar.disabled = true;
        buttonProcurar.innerHTML = "A procurar <img src='/assets/img/loading.svg' alt='Loading' id='loadingGif'>";
        buttonProcurar.style = "cursor: not-allowed;";
        
        const webhookURL = "https://oliveiraxavier14.app.n8n.cloud/webhook/1ceace4d-69f0-4386-abe6-8821b045cad5";

        const resposta = await fetch (webhookURL,{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({mood}),
        })

        if (!resposta.ok) {
            const errorText = await resposta.text();
            console.error(`Erro HTTP ${resposta.status}:`, errorText);
            divResultado.innerHTML = `Erro de comunicação com o servidor (Status: ${resposta.status}).`;
            return; 
        }

        const data = await resposta.json();

        console.log(data);

        if(!data.title){
            divResultado.innerHTML = "Não encontrei nenhum filme... 😞"
            return;
        }

        divResultado.innerHTML = 
            `<h2 id="sugestaoTitle"> ${data.title} </h2>
            <img id="sugestaoImagem" src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="Poster do Filme">
            <p id="sugestaoPontuacao"> Pontuação Média: ⭐️ ${data.vote_average}</p>`
        ;

        moodTextarea.value = "";

        buttonProcurar.disabled = false;
        buttonProcurar.innerHTML = "Procurar filmes";
        buttonProcurar.style = "cursor: pointer;";

    } catch (error){
        console.error("Erro ao obter sugestão de filme:", error);
        divResultado.innerHTML = "Ocorreu um erro. 😞";

    }

})
