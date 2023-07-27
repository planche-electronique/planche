/*
    Planche-électronique - projet de système d'enregistrement de vols en planeur pour clubs de vol à voile
    
    elements_html.js
        fionctions qui permettent de créer des éléments html avec des parametres que l'on retrouve souvent lors de l'ecriture d'une planche
    
    Licensed under the MIT licence, provided 'as is' without any warranty.
    Soumis à la licence MIT, fourni 'en l'état' sans aucune garantie.
    Voir https://raw.githubusercontent.com/planche-electronique/planche/master/LICENSE pour la licence complète
*/




//fonction qui permet de créer les select (liste deroulantes de choix) pour une liste d'element et un champ
function select_generique_tableau(champ, valeur, ligne, vol, infos_fixes) {
    let liste_elements;
    if (champ == "machine_decollage") {
        if (vol["code_decollage"] == "T") {
            liste_elements = infos_fixes["treuils"];
        } else { //vol["code_decollage"] = "R"
            liste_elements = infos_fixes["remorqueurs"];
        }   
    } else if (champ == "decolleur") {
        if (vol["code_decollage"] == "T") {
            liste_elements = infos_fixes["pilotes_tr"];
        } else { // vol["code_decollage"] = "R"
            liste_elements = infos_fixes["pilotes_rq"];
        }   
    } else if (champ == "pilote1" || champ == "pilote2") {
        liste_elements = infos_fixes["pilotes"];
    } else if (champ == "code_decollage") {
        liste_elements = infos_fixes["CodeDecollage"];
    } else if (champ == "code_vol") {
        liste_elements = infos_fixes["CodeVol"];
    } else if (champ == "aeronef") {
        liste_elements = infos_fixes["immatriculations"];
    }

    let numero_ogn = structuredClone(vol).numero_ogn;
    let cellule = ligne.insertCell();
    let liste = select_generique(document, liste_elements, champ+numero_ogn, valeur);
    cellule.appendChild(liste);

    if (champ == "code_decollage") {
        liste.addEventListener("change", function() {
            let select_machines_decollage = document.getElementById("machine_decollage" + numero_ogn);
            let select_pilotes_machine_decollage = document.getElementById("decolleur" + numero_ogn);
            let liste_machines_decollage;
            let liste_pilotes;
            if (this.value == "T") {
                liste_machines_decollage = infos_fixes["treuils"];
                liste_pilotes = infos_fixes["pilotes_tr"];
            } else {
                liste_machines_decollage = infos_fixes["remorqueurs"];
                liste_pilotes = infos_fixes["pilotes_rq"];
            }

            nettoyer_et_ajouter_au_select(select_machines_decollage, liste_machines_decollage);
            nettoyer_et_ajouter_au_select(select_pilotes_machine_decollage, liste_pilotes);
        })
    }
    let selecteur_date = document.getElementById("entree_date");
    let date = selecteur_date.value.replaceAll("-", "/");
    liste.addEventListener("change", function(){requete_mise_a_jour(numero_ogn, champ, this.value, date)});
                
}




function select_generique(document, liste_elements, id, valeur) {
    let liste = document.createElement("select");
    for (let element of liste_elements) {
        let option = document.createElement("option");
        option.value = element;
        option.text = element;
        liste.appendChild(option);
    }
    liste.value = valeur;
    liste.id = id;
    return liste;
}




function nettoyer_et_ajouter_au_select(select, liste) {
    while (select.options.length > 0) {
        select.remove(0);
        //on a enlevé les enfants de la liste                   
    }
    for (let element of liste) {
        let option = document.createElement("option");
        option.value = element;
        option.text = element;
        select.appendChild(option);
    }
    select.value = "";
}




function texte_tableau_generique(document, ligne, vol, texte, champ) {
    let cellule = ligne.insertCell();
    cellule.id = champ + structuredClone(vol).numero_ogn;
    // let texte_node = document.createTextNode(texte)
    let paragraphe = document.createElement("p");
    paragraphe.textContent = texte;
    cellule.appendChild(paragraphe);
    paragraphe.id = structuredClone(vol).numero_ogn + champ; // id usefull for changing and recalculating time when updating takeoff time
    paragraphe.className += "paragraphe_texte_tableau";
}




function heure_tableau_generique_cellule(document, ligne, vol, champ_heure, numero_ogn) {
    let cellule = ligne.insertCell();
    cellule.id = champ_heure + structuredClone(vol).numero_ogn;
    let heure;
    if (champ_heure == "decollage") {
        heure = structuredClone(vol).decollage;
    } else {
        heure = structuredClone(vol).atterissage;
    }
    heure_tableau_generique(document, cellule, vol, champ_heure, heure, numero_ogn);
}




function heure_tableau_generique(document, parent, vol, champ_heure, heure, numero_ogn) {
    let decollage = temps_texte_vers_heure_type(vol.decollage);
    let atterissage = temps_texte_vers_heure_type(vol.atterissage);
    let label = document.createElement("label");
    let date = date_jour_str().replaceAll("-", "/");
    parent.appendChild(label);
    label.for = heure + numero_ogn;
    let entree_heure = document.createElement("input");
    parent.appendChild(entree_heure);
    let bouton_envoi = document.createElement("input");
    parent.appendChild(bouton_envoi);
    entree_heure.type = "time";
    entree_heure.value = heure;
    entree_heure.name = "une entree d'heure";
    entree_heure.id = "entree" + champ_heure + numero_ogn;
    entree_heure.classList += " input_tr";
    bouton_envoi.type = "button";
    bouton_envoi.value = "Enregistrer";
    bouton_envoi.addEventListener("click", function() {
        if ((champ_heure == "decollage") && (atterissage < temps_texte_vers_heure_type(entree_heure.value)) && (vol.atterissage != "00:00")) {
            alert("Le décollage ne peut pas etre plus tard que l'atterissage !");
            
        } else if ((champ_heure == "atterissage") && (decollage > temps_texte_vers_heure_type(entree_heure.value))) {
            alert("L'atterissage ne peut pas être plus tôt que le décollage !");
            
        } else if ((champ_heure == "decollage") && (atterissage > temps_texte_vers_heure_type(entree_heure.value))) {
            recharger_temps_vol(document, numero_ogn);
            requete_mise_a_jour(numero_ogn, champ_heure, entree_heure.value, date);
        } else if ((champ_heure == "atterissage") && (decollage < temps_texte_vers_heure_type(entree_heure.value))) {
            recharger_temps_vol(document, numero_ogn);
            requete_mise_a_jour(numero_ogn, champ_heure, entree_heure.value, date);
        }
    });
}




function bouton_mettre_heure(document, vol, champ, titre) {    
    let bouton = document.createElement("button");
    bouton.innerHTML = titre;
    bouton.id = "bouton_"+ champ + structuredClone(vol).numero_ogn.toString();
    return bouton;
}




