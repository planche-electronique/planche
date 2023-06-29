const adresse_serveur = 'http://127.0.0.1:7878'




async function chargement_des_ressources(document, tableau, vols, immatriculations, pilotes, pilotes_tr, pilotes_rq, treuils, remorqueurs) {
    let numero_vol_planeur = 0;
    for (var vol of vols) {
        numero_vol_planeur += 1;
        let ligne = tableau.insertRow();
        
        //numero_ogn
        texte_tableau_generique(document, ligne, numero_vol_planeur, "numero_ogn", vol);
        //code de decollage
        select_generique("code_decollage", vol["code_decollage"], CodeDecollage, ligne, vol);
        //selectionne les pilotes et les machines en fonction du moyen de decollage
        let machines_decollage = []; 
        let pilotes_decollage = [];
        if (vol["code_decollage"] == "T") {
            machines_decollage = treuils;
            pilotes_decollage = pilotes_tr;
        } else if (vol["code_decollage"] == "R") {
            machines_decollage = remorqueurs;
            pilotes_decollage = pilotes_rq;
        }
        // machine de decollage
        select_generique("machine_decollage", vol["machine_decollage"], machines_decollage, ligne, vol);
        //pilote qui a fait decoller
        select_generique("decolleur", vol["decolleur"], pilotes_decollage, ligne, vol);
        //immatriculation
        select_generique("aeronef", vol["aeronef"], immatriculations, ligne, vol);
        //code vol
        select_generique("code_vol", vol["code_vol"], CodeVol, ligne, vol);
        // pilote 1 (cdb, instructeur...)
        select_generique("pilote1", vol["pilote1"], pilotes, ligne, vol);
        // pilote 2 (eleve, passager...)
        select_generique("pilote2", vol["pilote2"], pilotes, ligne, vol);

        let decollage = temps_texte_vers_heure_type(vol.decollage);
        let atterissage = temps_texte_vers_heure_type(vol.atterissage);

        //heure de decollage
        heure_tableau_generique(document, ligne, vol, "decollage", structuredClone(vol).decollage, decollage, atterissage);
        //heure d'atterissage
        
        heure_tableau_generique(document, ligne, vol, "atterissage", structuredClone(vol).atterissage, decollage, atterissage);
        //hdv       
        
        let temps_vol = atterissage - decollage;
        let heures = Math.floor(temps_vol / 3600000).toString();
        let minutes = Math.floor((temps_vol-heures*3600000) / 60000);
        if (minutes < 10) {
            minutes = "0" + minutes.toString();
        } else {
            minutes = minutes.toString();
        }
                
        vol.temps_vol = heures + ":" + minutes;
        texte_tableau_generique(document, ligne, structuredClone(vol).temps_vol, "temps_vol", vol);
    }
}




const CodeDecollage = [
    "T",
    "R",
];



    
const CodeVol = [
    "B",
    "S",
    "E",
    "C",
    "M",
]

    
async function premier_chargement_tableau(document, immatriculations, pilotes, pilotes_tr, pilotes_rq, treuils, remorqueurs) {
    let code_pilote = document.getElementById("champ_code_pilote").value;
    let mot_de_passe = document.getElementById("champ_mot_de_passe").value;
    let body = document.getElementById("body");
            
            
        /*requete*/
    let formulaire = document.getElementById("formulaire de connexion");
    formulaire.remove();
    
    
            
    /*ajoute le tableau*/
    let ul = document.createElement("ul");
    ul.className += "menu";
    body.appendChild(ul);
    let li = document.createElement("li");
    li.className.id = "date_menu";
    let a =document.createElement("a");
    let entree_date = document.createElement("input");
    entree_date.type = "date";
    entree_date.value = "2023-04-25";
    entree_date.id = "entree_date";
    a.appendChild(entree_date);
    li.appendChild(a);
    ul.appendChild(li);
    entree_date.addEventListener(
        "change",
        function () { 
            recharger(
                document,
                entree_date.value,
                tableau,
                immatriculations,
                pilotes,
                pilotes_tr,
                pilotes_rq,
                treuils,
                remorqueurs
            );
        }
    );
    
    let tableau_html = document.createElement("table");
    tableau_html.id = "tableau";
    body.appendChild(tableau_html);

    let thead = document.createElement("thead");
    thead.className += "ligne_info";

    let tr = document.createElement("tr");
    thead.appendChild(tr);
    let colonnes = [
        "Ligne", "Code de décollage", "Avec", "Par", "Immatriculation", "Code vol", "Commandant de bord ou Instructeur", "Pilote 2 ou élève", "Heure de décollage", "Heure d'atterissage", "Temps de vol"
    ];
    for (let titre of colonnes) {
        let th = document.createElement("th");
        th.textContent = titre;
        tr.appendChild(th);
    
    }
    tableau.appendChild(thead);
    let tbody = document.createElement("tbody");
    tbody.id = "body_tableau";
    tableau_html.appendChild(tbody);       
}




async function maitre(document) {
    
    let bouton = document.getElementById("bouton_soumission");
    
    bouton.addEventListener("click", () => {
        sous_maitre(document);
    });
}

async function sous_maitre(document) {
        
    let immatriculations = await lire_json(adresse_serveur+'/immatriculations.json');    
    let pilotes          = await lire_json(adresse_serveur+'/pilotes.json');
    let treuils          = await lire_json(adresse_serveur+'/treuils.json');
    let remorqueurs      = await lire_json(adresse_serveur+'/remorqueurs.json');
    let pilotes_tr       = await lire_json(adresse_serveur+'/pilotes_tr.json');
    let pilotes_rq       = await lire_json(adresse_serveur+'/pilotes_rq.json');

    await premier_chargement_tableau(
        document,
        immatriculations,
        pilotes,
        pilotes_tr,
        pilotes_rq,
        treuils,
        remorqueurs
    );
        
    let tableau = document.getElementById("tableau");
    mise_a_jour_automatique(document, tableau, immatriculations, pilotes, pilotes_tr, pilotes_rq, treuils, remorqueurs);
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




async function vols_du(date_format_slash) {
    let adresse = adresse_serveur + "/vols/" + date_format_slash;
    let planche = await lire_json(adresse);
    return planche.vols;
}




async function requete_mise_a_jour(numero_ogn, champ, nouvelle_valeur, date) {
        let corps = JSON.stringify({
        "numero_ogn": numero_ogn,
        "champ_mis_a_jour": champ,
        "nouvelle_valeur": nouvelle_valeur,
        "date": date
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




async function mise_a_jour_automatique(document, tableau, immatriculations, pilotes, pilotes_tr, pilotes_rq, treuils, remorqueurs) {
    
    while(tableau.rows.length > 1) {
        tableau.deleteRow(1);
    }

    let entree_date = document.getElementById("entree_date");
    let date = entree_date.value;
    let vols = await vols_du(date.replaceAll("-", "/"));
    await chargement_des_ressources(document, tableau, vols, immatriculations, pilotes, pilotes_tr, pilotes_rq, treuils , remorqueurs);
    setTimeout(
        function() {
            mise_a_jour_automatique(document, tableau, immatriculations, pilotes, pilotes_tr, pilotes_rq, treuils, remorqueurs);
        },
        77777
    );
}




async function recharger(
    document,
    date_format_tirets,
    tableau,
    immatriculations,
    pilotes,
    pilotes_tr,
    pilotes_rq,
    treuils,
    remorqueurs
) {
    
    while(tableau.rows.length > 1) {
        tableau.deleteRow(1);
    }
    let vols = await vols_du(date_format_tirets.replaceAll("-", "/"));
    await chargement_des_ressources(
        document,
        tableau,
        vols,
        immatriculations,
        pilotes,
        pilotes_tr,
        pilotes_rq,
        treuils,
        remorqueurs
    );
}




//fonction qui permet de créer les select (liste deroulantes de choix) pour une liste d'element et un champ
function select_generique(champ, valeur, liste_elements, ligne, vol) {
       
    let cellule = ligne.insertCell();
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
    liste.id = champ + numero_ogn;

    if (champ == "code_vol") {
        liste.addEventListener("change", function() {
            let select_machines_decollage = document.getElementById("machine_decollage" + numero_ogn);
            let select_pilotes_machine_decollage = document.getElementById("decolleur" + numero_ogn);
            if (this.value == "T") {
                while (select_machines_decollage.lastChild) {
                    select_machines_decollage.removeChild(select_machines_decollage.lastChild);
                    //on a enlevé les enfants de la liste                   
                }
                for (let element of treuils) {
                    let option = document.createElement("option");
                    option.value = element;
                    option.text = element;
                    select_machines_decollage.appendChild(option);
                }
            } else {
                while (select_pilotes_machine_decollage.lastChild) {
                    select_pilotes_machine_decollage.removeChild(select_pilotes_machine_decollage.lastChild);
                    //on a enlevé les enfants de la liste                   
                }
                for (let element of treuils) {
                    let option = document.createElement("option");
                    option.value = element;
                    option.text = element;
                    select_pilotes_machine_decollage.appendChild(option);
                }
            }
        })
    }
    let selecteur_date = document.getElementById("entree_date");
    let date = selecteur_date.value.replaceAll("-", "/");
    liste.addEventListener("change", function(){requete_mise_a_jour(numero_ogn, champ, this.value, date)});
                
}




function texte_tableau_generique(document, ligne, texte, champ, vol) {
    let cellule = ligne.insertCell();
    // let texte_node = document.createTextNode(texte)
    let paragraphe = document.createElement("p");
    paragraphe.textContent = texte;
    cellule.appendChild(paragraphe);
    paragraphe.id = structuredClone(vol).numero_ogn + champ; // id usefull for changing and recalculating time when updating takeoff time
    paragraphe.className += "paragraphe_texte_tableau";
}




function heure_tableau_generique(document, ligne, vol, champ_heure, heure, decollage, atterissage) {
    
    let numero_ogn = structuredClone(vol).numero_ogn;
    
    let cellule = ligne.insertCell();
    let label = document.createElement("label");
    cellule.appendChild(label);
    label.for = heure + numero_ogn;
    let entree_heure = document.createElement("input");
    cellule.appendChild(entree_heure);
    let bouton_envoi = document.createElement("input");
    cellule.appendChild(bouton_envoi);
    entree_heure.type = "time";
    entree_heure.value = heure;
    entree_heure.name = "une entree d'heure";
    bouton_envoi.type = "button";
    bouton_envoi.value = "Enregistrer";
    bouton_envoi.addEventListener("click", function() {
        if ((champ_heure == "decollage") && (atterissage < temps_texte_vers_heure_type(entree_heure.value))) {
            alert("Le décollage ne peut pas etre plus tard que l'atterissage !");
            
        } else if ((champ_heure == "atterissage") && (decollage > temps_texte_vers_heure_type(entree_heure.value))) {
            alert("L'atterissage ne peut pas être plus tôt que le décollage !");
            
        } else if ((champ_heure == "decollage") && (atterissage > temps_texte_vers_heure_type(entree_heure.value))) {
            requete_mise_a_jour(numero_ogn, champ_heure, entree_heure.value);
            let temps_vol = atterissage - temps_texte_vers_heure_type(entree_heure.value);
            let temps_vol_texte = temps_type_vers_temps_texte(temps_vol);
            let paragraphe = document.getElementById(numero_ogn + "temps_vol");
            paragraphe.innerHTML = temps_vol_texte;
            
            
        } else if ((champ_heure == "atterissage") && (decollage < temps_texte_vers_heure_type(entree_heure.value))) {
            requete_mise_a_jour(numero_ogn, champ_heure, entree_heure.value);
        }
    });
}




function temps_texte_vers_heure_type(temps) {
    let heure_decollage = temps.slice(0, 2);
    let minute_decollage = temps.slice(3, 5);
    let decollage = new Date(0, 0, 0, heure_decollage, minute_decollage);
    return decollage;
}




function temps_type_vers_temps_texte(temps_type) {
        let heures = Math.floor(temps_type / 3600000).toString();
        let minutes = Math.floor((temps_type-heures*3600000) / 60000);
        if (minutes < 10) {
            minutes = "0" + minutes.toString();
        } else {
            minutes = minutes.toString();
        }
        console.log(heures + ":" + minutes);
        return (heures + ":" + minutes);
}




