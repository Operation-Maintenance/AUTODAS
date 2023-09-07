// ==UserScript==
// @name         OplusM AUTODAS AGORA
// @namespace    https://oplusm.fr/
// @version      3.2
// @description  Envoie semi-automatique de prevenance Agora
// @author       Adi Lasri
// @match        https://agora2.cellnextelecom.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Operation-Maintenance/AUTODAS/main/autodas.js
// @downloadURL  https://raw.githubusercontent.com/Operation-Maintenance/AUTODAS/main/autodas.js
// ==/UserScript===

(function () {
  //'use strict';

  window.addEventListener('load', function () {
    setTimeout(function () { // récuparation des data nécéssaire
      //const idSociete = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_02-defaultXML--maintainer2-inner').value;
      //const idLieux = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_02-defaultXML--interventionPlace-inner').value;
      const idIFSpec = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_03-defaultXML--needEquipement-labelText').textContent;
      const idSpec = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_03-defaultXML--specialEquipment-labelText').textContent;
      //const idInter = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_02-defaultXML--interventionType-inner').value;
      //const idDatedebut = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_01-defaultXML--beginDate-inner').value;
      //const idDatefin = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_01-defaultXML--endDate-inner').value;
     // const idDesc = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_04-defaultXML--SARDescription-inner').value;
      var balisesBdi = document.getElementsByTagName("bdi");
      // Vérifiez s'il y a au moins deux balises <bdi> sur la page
      if (balisesBdi.length >= 2) {
        // Récupérez le texte contenu dans le deuxième élément <bdi>
        var idDas = balisesBdi[0].textContent;
        var idAdresse = balisesBdi[1].textContent;
      } else {
        console.log("Pas assez de balises bdi sur la page");
      }
      var baliseinput = document.getElementsByTagName("input");
      if(baliseinput){

        var idSociete = baliseinput[11].value;
        var idTbouygues = baliseinput[0].value;
        var idTbouygues = idTbouygues.slice(-6);
        var idLieux = baliseinput[12].value;
        var idDatedebut = baliseinput[3].value;
        var idDatefin = baliseinput[4].value;
        var idInter = baliseinput[6].value;

        console.log(baliseinput);
      }
      var balisespan = document.getElementsByTagName("span");
      //if (balisespan){
        //var idIFSpec = balisespan[199].textContent;
        //var idSpec = balisespan[205].textContent;

        //console.log(balisespan)
      //}
      var balisetextarea = document.getElementsByTagName("textarea");
      if (balisetextarea){
        console.log(balisetextarea);
        var idDesc = balisetextarea[1].value;
      }
      var tables = document.querySelectorAll("table");
      // Vérification s'il y a au moins quatre tableaux
      if (tables.length >= 4) {
        // Sélection du quatrième tableau
        var table = tables[3];
        // Sélection de toutes les lignes du tableau
        var rows = table.querySelectorAll("tbody tr");
        // Initialisation du tableau pour stocker les noms et prénoms
        var contact = [];
        // Parcourir chaque ligne et stocker les noms et prénoms
        rows.forEach(function (row) {
          // Sélection de la cellule contenant le nom et prénom
          var nameCell2 = row.querySelector("td:nth-child(1)");
          var nameCell = row.querySelector("td:nth-child(2)");
          var nameCell3 = row.querySelector("td:nth-child(3)");
          var nameCell4 = row.querySelector("td:nth-child(4)");
          // Vérification si la cellule existe
          if (nameCell) {
            // Récupération du contenu de la cellule
            var name = nameCell.querySelector("input").value;
            var name2 = nameCell2.querySelector("input").value;
            var name3 = nameCell3.querySelector("input").value;
            var name4 = nameCell4.querySelector("input").value;
            var name = name2 + " | " + name +" | "+name3 + " | "+ name4;
            contact.push(name); // Ajout du nom et prénom au tableau
          }
        });
      };
      // Récupération de l'adresse et du code site
      var idElement = idAdresse.slice(0, 13);
      idAdresse = idAdresse.substring(15);
      // Prompt des informations récupéré dans la console
      console.log("Code site: " + idElement +" Code BYTEL: "+ idTbouygues + " Code das : " + idDas + " Société : " + idSociete + " Zone d'inter :" + idLieux + " Equipements spéciaux : " + idIFSpec + " / " + idSpec + " Nature inter :" + idInter + " Description inter : " + idDesc + " Contact : " + contact + " Adresse : " + idAdresse);
      console.log("Date debut : " + idDatedebut + " Date fin : " + idDatefin);
      // Appelez la fonction pour la première fois
      // ouverture de la fenêtre pour la region
      var choix2;
        do {
            choix2 = prompt("Sélectionnez une Zone : \n1. NORD\n2. IDF\n3. SUD");
            // Vérifie si l'utilisateur a cliqué sur Annuler
            if (choix2 === null) {
                alert("Opération annulée.");
                break; // Sort de la boucle si l'utilisateur a cliqué sur Annuler
            }
        } while (choix2 !== "NORD" && choix2 !== "IDF" && choix2 !== "SUD");

        // Vérifie si l'utilisateur a fait un choix valide
        if (choix2 !== null) {
            sendEmail(idElement, idDas, idSociete, idAdresse, idLieux, idInter, idSpec, idDesc, contact, idIFSpec, idDatedebut, idDatefin, choix2,idTbouygues);
        }
    }, 15000);
   });




  // fonction de création du mail
  function sendEmail(idElement, idDas, idSociete, idAdresse, idLieux, idInter, idSpec, idDesc, contact, idIFSpec, idDatedebut, idDatefin, choix2, idTbouyges) {
    var recipient = ''; // pas de destinataire automatique
    var subject = "CELLNEX "+choix2 + ' Intervention sur les antennes Bouygues Telecom,' + idElement + " // " + idDas; // sujet du mail
    var body = 'Bonjour,%0A%0ANous sommes la société CELLNEX France mandatée par l\'antenniste Bouygues Telecom. %0A%0A';
    body += 'Nous vous informons que la société ' + idSociete + ' souhaite intervenir sur votre site situé au ' + idAdresse + ' le ' + idDatedebut + ' jusqu\'au ' + idDatefin + '. %0A%0A'; //corps du mail
    body += 'Ci-dessous les informations concernant l’opération :%0A%0A';
    body += 'Référence du site : ' + idElement + ' // ' + idTbouyges + '.%0A';
    body += 'Lieu de l\'intervention : ' + idLieux + '.%0A';
    body += 'Nature d\'intervention : ' + idInter + '.%0A';
    body += 'Sur les équipements de l\’opérateur : Cellnex France.';
    body += '%0AEquipements spéciaux : ' + idIFSpec + " " + idSpec;
    body += '%0AMotif de l’intervention : ' + idDesc;
    body += '%0ALes Intervenants sont : %0A';
    for (var i = 0; i < contact.length; i++) {
        body += contact[i] + "%0A";
    }
    body += '%0AAvons-nous votre accord pour l’intervention ? %0A';
    body += 'Dans l’attente de votre retour.%0A';
    body += 'Cordialement,%0A';


    //var mailtoLink = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); // encapsulage dans le mailto
    var urlOWA = "https://outlook.office365.com/owa/?path=/mail/action/compose&to=&subject="+subject+"&body="+body;
    var senderEmail = "guichet.acces@cellnextelecom.fr"; // Remplacez par l'adresse e-mail de l'expéditeur que vous souhaitez utiliser
    urlOWA += "&from=" + encodeURIComponent(senderEmail);

    window.open(urlOWA, "_blank");
    //window.location.href = mailtoLink;
  };
})();
