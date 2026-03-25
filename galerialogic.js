document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");
    const descHTML = document.getElementById("descripcio-categoria");

    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('cat'); 

    if (!catClau) return;

    // Funció per carregar dades des de la Netlify Function
    function fetchAirtable() {
        // Cridem a la funció que hem creat a Netlify
       const url = `https://cadialimentacio.netlify.app/.netlify/functions/get-articles?cat=${encodeURIComponent(catClau)}`;

        fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Error en la resposta de la funció");
            return response.json();
        })
        .then(data => {
            if (data && data.records) {
                processData(data.records);
            } else {
                console.error("No s'han rebut registres vàlids.");
            }
        })
        .catch(err => console.error("Error de connexió:", err));
    }

    // La teva lògica de processament original, sense canvis
    function processData(records) {
        if (!records || records.length === 0) return;

        const articles = records.map(r => r.fields);

        if (titolHTML) titolHTML.innerText = articles[0].Titol || "";
        if (descHTML) descHTML.innerText = articles[0].Descripcio || "";

        const uniques = [];
        const nomsVistos = new Set();

        articles.forEach(art => {
            let nomReal = Array.isArray(art.TitolSub) ? art.TitolSub[0] : art.TitolSub;

            if (nomReal && !nomsVistos.has(nomReal)) {
                nomsVistos.add(nomReal);
                let foto = Array.isArray(art.Subfoto) ? art.Subfoto[0] : art.Subfoto;
                uniques.push({ 
                    titol: nomReal, 
                    foto: foto 
                });
            }
        });

        let html = '';
        uniques.forEach(item => {
            // Ruta base a GitHub Pages (cadinamics)
            const baseRuta = "https://altervector.github.io/cadinamics/images/";
            const imgPath = item.foto ? `${baseRuta}${item.foto}` : `${baseRuta}default.jpg`;

            html += `
                <div class="bloc-galeria-item" 
                    onclick="window.location.href='article.html?cat=${catClau}&sub=${encodeURIComponent(item.titol)}'"
                    style="cursor:pointer;">
                    <img src="${imgPath}" alt="${item.titol}" onerror="this.src='${baseRuta}Default.png'">
                    <div class="titol-item">${item.titol}</div>
                </div>
            `;
        });
        contenidor.innerHTML = html;
    }

    // Iniciem la càrrega
    fetchAirtable();
});