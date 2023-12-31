/*
    Planche-électronique - projet de système d'enregistrement de vols en planeur pour clubs de vol à voile
    
    requetes.js
        fonctions qui s'occupent de faire des requetes GET et POST avec le serveur
    
    Licensed under the MIT licence, provided 'as is' without any warranty.
    Soumis à la licence MIT, fourni 'en l'état' sans aucune garantie.
    Voir https://raw.githubusercontent.com/planche-electronique/planche/master/LICENSE pour la licence complète
*/




async function lire_json(adresse) {
    return await fetch(adresse)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response);
            }
            return response.json();
        })
        .catch(error => {
            console.log(adresse);
            notification(5, 5, "Impossible d'accéder à la ressource: " + adresse + error);
        })
}




async function requete_mise_a_jour(numero_ogn, champ, nouvelle_valeur, date) {
    if (champ == "code_decollage") {
        requete_mise_a_jour(numero_ogn, "machine_decollage", "", date);
        requete_mise_a_jour(numero_ogn, "decolleur", "", date);
    }
    let corps = JSON.stringify({
        "numero_ogn": numero_ogn,
        "champ_mis_a_jour": champ,
        "nouvelle_valeur": nouvelle_valeur,
        "date": date
    });
    let length = corps.length;
    await fetch('./mise_a_jour', {
        method: 'POST',
        headers: {
            'Content-Type': 'charset=utf-8',
            'Content-Length': length,
        },
        body: corps
    })
}



async function planche_du(date) {
    let date_aujourdhui_slash = date_jour_str().replaceAll("-", "/");
    let planche;
    if (date_aujourdhui_slash == date) {
        console.log(adresse_serveur + "planche/")
        planche = await lire_json(adresse_serveur + "planche/");
    } else {
        planche = await lire_json(adresse_serveur + "planche?date=" + date)
    }
    return planche;
}


async function recharger(
    document,
    date,
    tableau,
    infos_fixes
) {
    nettoyage(document);
    date_slash = date.replaceAll("-", "/");
    let planche = await planche_du(date_slash);
    let vols = planche["vols"];
    let affectations = planche["affectations"];
    chargement_affectations(document, affectations, infos_fixes);
    
    await chargement_des_ressources(
        document,
        tableau,
        vols,
        infos_fixes
    );    
}



