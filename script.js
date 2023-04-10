document.addEventListener('DOMContentLoaded', (event) => {
    if (false) {
        let body = document.getElementById("body");
        body.insertAdjacentHTML('beforeend',`<ul class="menu">
            <li id="date_menu"><a><input type="date" id="date"></a></li>
            <li class="text_menu"><a>Eplanche</a></li>
            <li class="text_menu"><a>Affectation</a></li>
        </ul>
        <div>
            
        </div>
        <table id="tableau">
            <thead class="ligne_info">
                <tr>
                    <th>Ligne</th>
                    <th>Code de décollage</th>
                    <th>Avec</th>
                    <th>Par</th>
                    <th>Durée</th>
                    <th>Immatriculation</th>
                    <th>Code vol</th>
                    <th>Heure de décollage</th>
                    <th>Heure d'atterissage</th>
                    <th> Durée du vol</th>
                    <th>Commandant de bord ou instructeur</th>
                    <th>Pilote 2 ou élève</th>
                </tr>
            </thead>
            <tbody id="body_tableau"> 
            </tbody>
            
        </table>`);
    }
    
    
    let tableau = document.getElementById("tableau");
    var body_tableau = tableau.getElementsByTagName("tbody")[0];
    function nouvelle_ligne(body_tableau) {
        tr = body_tableau.insertRow(0);
        for (let i=0; i<12;i+=1) {
            actual_th = tr.insertCell(0);
            actual_th.textContent = i.toString();
        }
    }
    for( let l = 0; l <40; l+=1) {
        nouvelle_ligne(body_tableau);
    }
})

