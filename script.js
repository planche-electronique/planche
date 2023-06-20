const adresse_serveur = 'http://127.0.0.1:7878'




async function chargement_des_ressources(document, tableau, vols, immatriculations, pilotes) {
    for (var vol of vols) {

        let ligne = tableau.insertRow();

        
        let heure_decollage = vol.decollage.slice(0, 2);
        let minute_decollage = vol.decollage.slice(3, 5);
        let decollage = new Date(0, 0, 0, heure_decollage, minute_decollage);

        let heure_atterissage= vol.atterissage.slice(0, 2);
        let minute_atterissage = vol.atterissage.slice(3, 5);
        let atterissage = new Date(0, 0, 0, heure_atterissage, minute_atterissage);

        let temps_vol = atterissage - decollage;
        let heures = Math.floor(temps_vol / 3600000).toString();
        let minutes = Math.floor((temps_vol-heures*3600000) / 60000);
        if (minutes < 10) {
            minutes = "0" + minutes.toString();
        } else {
            minutes = minutes.toString();
        }
                
                    
        vol.temps_vol = heures + ":" + minutes;
       //console.log(vol.temps_vol);
        for (const [champ, valeur] of Object.entries(vol)) {
            let cellule = ligne.insertCell();
                    
            if (champ == "pilote1" || champ == "pilote2") {
                select_generique(champ, valeur, pilotes, cellule, vol);
            } else if (champ == "aeronef") {
                select_generique(champ, valeur, immatriculations, cellule, vol);                
            } else if (champ == "code_vol") {
                select_generique(champ, valeur, CodeVol, cellule, vol);              
            } else if (champ == "code_decollage") {
                select_generique(champ, valeur, CodeDecollage, cellule, vol);
            } else if (champ == "machine_decollage"){
                let machines_decollage = await lire_json(adresse_serveur+'/machines_decollages.json');
                select_generique(champ, valeur, machines_decollage, cellule, vol);
            } else if (champ == "decolleur") {
                let liste = [];
                if (vol["code_decollage"] == "T") {
                    liste = await lire_json(adresse_serveur+'/pilotes_tr.json');
                } else if (vol["code_decollage"] == "R") {
                    liste = await lire_json(adresse_serveur+'/pilotes_rq.json');
                }
                select_generique(champ, valeur, liste, cellule, vol);
                
            } else {
                let texte = document.createTextNode(valeur.toString());
                cellule.appendChild(texte);
            }
        }
    }
}




const CodeDecollage = [
    "T",
    "R",
];



    
const CodeVol = [
    "S",
    "E",
    "B",
    "C",
    "M",
]



    
async function premier_chargement_tableau(document, vols, immatriculations, pilotes){
    let code_pilote = document.getElementById("champ_code_pilote").value;
    let mot_de_passe = document.getElementById("champ_mot_de_passe").value;
    let body = document.getElementById("body");
            
            
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
                    <th>Immatriculation</th>
                    <th>Code vol</th>
                    <th>Commandant de bord ou instructeur</th>
                    <th>Pilote 2 ou élève</th>
                    <th>Heure de décollage</th>
                    <th>Heure d'atterissage</th>
                    <th> Durée du vol</th>
                </tr>
                </thead>
            <tbody id="body_tableau"> 
            </tbody>
                    
        </table>`);
            
}




async function maitre(document) {
    
    let bouton = document.getElementById("bouton_soumission");
    
    bouton.addEventListener("click", () => {
        sous_maitre(document);
    });
}

async function sous_maitre(document) {
        
    let immatriculations = await lire_json(adresse_serveur+'/immatriculations.json');    
    let pilotes = await lire_json(adresse_serveur+'/pilotes.json');
    
    await premier_chargement_tableau(document);
        
    let tableau = document.getElementById("tableau");
    mise_a_jour_automatique(document, tableau, immatriculations, pilotes);
}
    
    
document.addEventListener('DOMContentLoaded', (_) => {
    maitre(document);
});




async function lire_json(adresse) {
    return await fetch(adresse)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error" + response.status);
            }
            return response.json();
        })
}




async function requete_mise_a_jour(numero_ogn, champ, nouvelle_valeur) {
    let corps = JSON.stringify({
        "numero_ogn": numero_ogn,
        "champ_mis_a_jour": champ,
        "nouvelle_valeur": nouvelle_valeur
    });
    let length = corps.length;
    await fetch(adresse_serveur+'/mise_a_jour', {
        method: 'POST',
        headers: {
            'Content-Type': 'charset=utf-8',
            'Content-Length': length,
        },
        body: corps
    })
}




async function mise_a_jour_automatique(document, tableau, immatriculations, pilotes) {
    
    while(tableau.rows.length > 1) {
        tableau.deleteRow(1);
    }
    let vols = await lire_json(adresse_serveur+'/vols.json');
    await chargement_des_ressources(document, tableau, vols, immatriculations, pilotes);
    setTimeout(
        function() {
            mise_a_jour_automatique(document, tableau, immatriculations, pilotes);
        },
        77777
    );
}



//fonction qui permet de créer les select (liste deroulantes de choix) pour une liste d'element et un champ
function select_generique(champ, valeur, liste_elements, cellule, vol) {   
    let liste = document.createElement("select");
    cellule.appendChild(liste);
    for (let element of liste_elements) {
        let option = document.createElement("option");
        option.value = element;
        option.text = element;
        liste.appendChild(option);
    }
    let numero_ogn = structuredClone(vol).numero_ogn;
                    
    liste.value = valeur;
    liste.addEventListener("change", function(){requete_mise_a_jour(numero_ogn, champ, this.value)});
                
}