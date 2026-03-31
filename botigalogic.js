const htmlBotiga = `

<div class="bloc-imatges">
    <div class="columna-esquerra">
        <a href="https://cadialimentacio.netlify.app/principal.html?cat=ver" class="enllac-imatge-fix"> 
            <img src="https://altervector.github.io/cadinamics/images/PICATVer.webp" alt="Verdures" class="imatge-petita">
            <span class="etiqueta-categoria">Verdures</span>
        </a>
        <a href="https://cadialimentacio.netlify.app/principal.html?cat=pre" class="enllac-imatge-fix">
            <img src="https://altervector.github.io/cadinamics/images/PICATPre.webp" alt="Croquetes" class="imatge-petita">
            <span class="etiqueta-categoria">Precuinats</span>
        </a>
    </div>
    <div class="imatge-dreta">
        <a href="https://cadialimentacio.netlify.app/principal.html?cat=px" class="enllac-imatge-fix">
            <img src="https://altervector.github.io/cadinamics/images/PICATPx.webp" alt="Peix i Marisc" class="imatge-gran">
            <span class="etiqueta-categoria">Peix i Marisc</span>
        </a>
    </div>
</div>
<div class="bloc-imatge-inferior">
    <a href="https://cadialimentacio.netlify.app/principal.html?cat=alt" class="enllac-imatge-fix item-horizontal">
        <img src="https://altervector.github.io/cadinamics/images/PICATAlt.webp" alt="Postres i Altres" class="imatge-petita">
        <span class="etiqueta-categoria">Postres i Altres</span>
    </a>
</div>
<p style="max-width:400px; width:90%; margin: 10px auto 10px auto; font-size: 14px; color:#555; text-align: center;">
    <em>Productes seleccionats de primera qualitat <br><span style="display:block; text-align:center;"> Servei proper i professional</span></em>
</p>

`;

// Injectem tot el bloc al "forat" de l'HTML
document.getElementById('contingut-botiga').innerHTML = htmlBotiga;

const MOSTRAR_BLOQUEIG = true; 

if (MOSTRAR_BLOQUEIG) {
    document.addEventListener('DOMContentLoaded', function() {
        const capaProhibida = document.createElement('div');
        capaProhibida.id = 'capa-bloqueig-glass';
        
        capaProhibida.innerHTML = `
            <style>
                #capa-bloqueig-glass {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    /* Fons blanc molt transparent per no tapar la botiga */
                    background: rgba(255, 255, 255, 0.1); 
                    z-index: 100000; display: flex; align-items: center; justify-content: center;
                    pointer-events: all; padding: 20px;
                }

                .caixa-glass {
                    /* Efecte Vidre: Blanc amb transparència i ataronjat molt suau */
                    background: rgba(255, 245, 230, 0.7); 
                    backdrop-filter: blur(12px); /* El vidre que bofega el darrere */
                    -webkit-backdrop-filter: blur(12px);
                    
                    padding: 45px; border-radius: 30px; text-align: center;
                    max-width: 450px; width: 100%;
                    box-shadow: 0 10px 40px rgba(255, 165, 0, 0.1); /* Ombra taronja suau */
                    border: 1px solid rgba(255, 165, 0, 0.2); /* Vora ataronjada fina */
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .caixa-glass h2 { 
                    color: #e67e22; /* Taronja corporatiu suau */
                    margin-top: 0; font-size: 1.8rem; font-weight: 800;
                }

                .caixa-glass p { color: #444; line-height: 1.6; font-size: 1.05rem; }

                .botons-grup { display: flex; gap: 15px; justify-content: center; margin-top: 30px; }

                .btn-bloqueig {
                    padding: 14px 24px; border-radius: 12px; text-decoration: none;
                    font-weight: bold; transition: 0.3s; font-size: 0.95rem;
                }

                /* El botó de Renovació més seriós (Ataronjat/Fosc) */
                .btn-mail { background: #e67e22; color: white; border: 1px solid #d35400; }
                .btn-mail:hover { background: #d35400; }

                .btn-tornar { background: rgba(0, 0, 0, 0.7); color: white; }

                /* HEM TREM EL BLOQUEIG D'SCROLL PERQUÈ PUGUIN NAVEGAR AL DARRERE */
            </style>
            
            <div class="caixa-glass">
                <div style="font-size: 3rem; margin-bottom: 10px;">🧀</div>
                <h2>Avís del Sistema</h2>
                <p>S'ha acabat el període de prova d'aquest catàleg digital.</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Per renovar el servei o realitzar una comanda, posa't en contacte amb el suport tècnic.</p>
                
                <div class="botons-grup">
                    <a href="mailto:carles-suport@exemple.com?subject=Renovació Catàleg Cadí" class="btn-bloqueig btn-mail">Renovar Servei</a>
                    <a href="index.html" class="btn-bloqueig btn-tornar">Tornar a l'Inici</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(capaProhibida);
    });
}
