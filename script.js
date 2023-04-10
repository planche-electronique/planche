document.addEventListener('DOMContentLoaded', (event) => {
    let bouton = document.getElementById("bouton_soumission");

    bouton.addEventListener("click", (event) => {
        
        let code_pilote = document.getElementById("champ_code_pilote").value;
        let mot_de_passe = document.getElementById("champ_mot_de_passe").value;
        let body = document.getElementById("body");
        console.log(code_pilote);
        console.log(mot_de_passe);
        
        
        /*requete*/
        let formulaire = document.getElementById("formulaire de connexion");
        formulaire.remove();

        
        /*ajoute le tableau*/
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
        
        let tableau = document.getElementById("tableau");
        var body_tableau = tableau.getElementsByTagName("tbody")[0];
    })
})

