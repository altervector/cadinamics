document.addEventListener('DOMContentLoaded', function() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");
    const descHTML = document.getElementById("descripcio-categoria");

    // Efecte de càrrega visual
    if (titolHTML && contenidor) {
        titolHTML.classList.add('loading');
        contenidor.classList.add('esperant-validacio');
    }

    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('cat'); 

    if (!catClau) return;

    function fetchAirtable() {
        const url = `https://cadialimentacio.netlify.app/.netlify/functions/get-articles?cat=${encodeURIComponent(catClau)}`;

        fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Error en la resposta");
            return response.json();
        })
        .then(data => {
            if (data && data.records) {
                processData(data.records);
                // Treure efecte de càrrega després de processar
                setTimeout(() => {
                    titolHTML.classList.remove('loading');
                    contenidor.classList.remove('esperant-validacio');
                    contenidor.classList.add('revelat-final');
                }, 1000); // Reduït a 1s perquè sigui més àgil
            }
        })
        .catch(err => {
            console.error("Error:", err);
            if (titolHTML) titolHTML.innerText = "Error en carregar";
        });
    }

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
                uniques.push({ titol: nomReal, foto: foto });
            }
        });

        let html = '';
        const baseRuta = "https://altervector.github.io/cadinamics/images/";
        
        uniques.forEach(item => {
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

    fetchAirtable();
});
// ==========================================
// CONTROL DE BLOQUEIG REMOT (SENSE DEPLOYS)
// ==========================================
const MOSTRAR_BLOQUEIG = true; // <--- CANVIA A 'false' PER DESBLOQUEJAR

if (MOSTRAR_BLOQUEIG) {
    document.addEventListener('DOMContentLoaded', function() {
        // 1. Creem el contenidor principal
        const capaProhibida = document.createElement('div');
        capaProhibida.id = 'capa-bloqueig-dinamica';
        
        // 2. Definim el contingut i l'estil (transparències ajustades)
        capaProhibida.innerHTML = `
            <style>
                #capa-bloqueig-dinamica {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(255, 255, 255, 0.2); /* Fons molt transparent */
                    backdrop-filter: blur(4px); /* Efecte borrós suau */
                    z-index: 100000; display: flex; align-items: center; justify-content: center;
                    pointer-events: all; padding: 20px;
                }
                .caixa-missatge {
                    background: rgba(255, 255, 255, 0.85); /* Quadre una mica transparent */
                    padding: 40px; border-radius: 20px; text-align: center;
                    max-width: 450px; width: 100%;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
                    border: 1px solid rgba(0,0,0,0.1);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .caixa-missatge h2 { color: #333; margin-top: 0; font-size: 1.6rem; }
                .caixa-missatge p { color: #555; line-height: 1.6; margin-bottom: 30px; }
                .botons-grup { display: flex; gap: 10px; justify-content: center; }
                .btn-bloqueig {
                    padding: 12px 20px; border-radius: 8px; text-decoration: none;
                    font-weight: bold; transition: 0.3s;
                }
                .btn-roig { background: #d32f2f; color: white; }
                .btn-negre { background: #333; color: white; }
                body { overflow: hidden !important; } /* Impedeix l'scroll */
            </style>
            
            <div class="caixa-missatge">
                <h2>⚠️ Avís del Sistema</h2>
                <p>S'ha acabat el període de prova d'aquest catàleg digital.<br><br>
                   Per renovar el servei o realitzar una comanda, posa't en contacte amb el suport tècnic.</p>
                <div class="botons-grup">
                    <a href="mailto:suport@altervector.com" class="btn-bloqueig btn-roig">Renovar Servei</a>
                    <a href="index.html" class="btn-bloqueig btn-negre">Tornar a l'Inici</a>
                </div>
            </div>
        `;
        
        // 3. Injectem al final del body
        document.body.appendChild(capaProhibida);
    });
}
