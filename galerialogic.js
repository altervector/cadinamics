document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");
    const descHTML = document.getElementById("descripcio-categoria");

    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('cat'); 

    if (!catClau) return;

    const BASE_ID = 'app36XfjG6hxnjqxo';
    const TABLE_NAME = 'Articles';

    // NO posis el TOKEN aquí. El buscarem a la finestra (window)
    const TOKEN = window.AIRTABLE_TOKEN;
   

    let allRecords = [];

    // Función interna para cargar datos recursivamente
    function fetchAirtable(offset = "") {
        let url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=AND(LOWER({Cat})=LOWER('${catClau}'), {Web}=1)&sort[0][field]=id&sort[0][direction]=asc`;
        
        if (offset) {
            url += `&offset=${offset}`;
        }

        fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
        .then(response => response.json())
        .then(data => {
            allRecords = allRecords.concat(data.records);

            // Si hay más de 100, Airtable devuelve un offset. Si existe, pedimos la siguiente tanda.
            if (data.offset) {
                fetchAirtable(data.offset);
            } else {
                // Cuando ya no hay más páginas, procesamos los datos
                processData(allRecords);
            }
        })
        .catch(err => console.error("Error:", err));
    }

    // Tu lógica de renderizado original extraída a una función para que espere a tener todos los datos
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
            // Canviem la ruta base a GitHub Pages
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

    // Iniciamos la carga
    fetchAirtable();
});
