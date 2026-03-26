document.addEventListener("DOMContentLoaded", async () => {
    const contenidor = document.getElementById("contingut-fitxa");
    const h1 = document.getElementById("titol-article");
    if (!contenidor || !h1) return;

    // Efecte de càrrega inicial
    h1.classList.add('loading');

    const params = new URLSearchParams(window.location.search);
    const subNomURL = params.get("sub");
    if (!subNomURL) return;

    const nomBusqueda = decodeURIComponent(subNomURL).trim();
    const url = `https://cadialimentacio.netlify.app/.netlify/functions/get-fitxa?sub=${encodeURIComponent(nomBusqueda)}`;

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Error en la resposta");
        
        const data = await resposta.json();
        
        if (!data.records || data.records.length === 0) {
            h1.innerText = "Producte no trobat";
            h1.classList.remove('loading');
            return;
        }

        const neteja = (v) => Array.isArray(v) ? v[0] : v;

        const variants = data.records.map(r => {
            const f = r.fields;
            return {
                Ref: neteja(f.Ref),
                Nom: neteja(f.Nom),
                Caixa: neteja(f.Caixa),
                Preu: neteja(f.Preu),
                TitolSub: neteja(f.TitolSub),
                Subfoto: neteja(f.Subfoto),
                DescripcioSub: neteja(f.DescripcioSub)
            };
        });

        const info = variants[0];
        let filesTaula = "";
        variants.forEach(art => {
            const preuNum = parseFloat(art.Preu) || 0;
            filesTaula += `
                <tr>
                    <td>${art.Ref || ''}</td>
                    <td>${art.Nom || ''}</td>
                    <td>${art.Caixa || ''}</td>
                    <td>${preuNum.toFixed(2)} €</td>
                </tr>
            `;
        });

        const baseRuta = "https://altervector.github.io/cadinamics/images/";

        // Pintem tot el contingut
        contenidor.innerHTML = `
            <h1>${info.TitolSub || ""}</h1>
            <img src="${baseRuta}${info.Subfoto}" class="imatge-fitxa-principal" onerror="this.src='${baseRuta}Default.png'">
            <p class="descripcio-curta">${info.DescripcioSub || ""}</p>
            <div class="especificacions-bloc">
                <h2>Articles Disponibles</h2>
                <p style="color: red; font-size: 11px; font-weight: bold; text-align: center; margin: 10px 0;">
                    * Preus orientatius subjectes a canvis. Per a preus definitius i actualitzats, consulteu el catàleg en PDF.
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Ref.</th>
                            <th>Nom</th>
                            <th>Caixa</th>
                            <th>Preu/kg</th>
                        </tr>
                    </thead>
                    <tbody>${filesTaula}</tbody>
                </table>
                <p class="info-extra">Preus sense IVA.</p>
            </div>
        `;

        document.title = info.TitolSub || "Producte";

        // Efecte visual de "revelat"
        setTimeout(() => {
            Array.from(contenidor.children).forEach(child => {
                if (child.tagName !== 'H1') {
                    child.classList.add('revelat-final');
                }
            });
        }, 500);

    } catch (error) {
        console.error("Error en la càrrega:", error);
        h1.innerText = "Error en carregar la fitxa";
        h1.classList.remove('loading');
    }
});