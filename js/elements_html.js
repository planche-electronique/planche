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




