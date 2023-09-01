// ==UserScript==
// @name         OplusM AUTODAS
// @namespace    https://oplusm.fr
// @version      1
// @description  Envoie semi-automatique de prevenance Agora
// @author       Adi Lasri
// @match        https://agora2.cellnextelecom.com/*
// @grant        none
// ==/UserScript==

(function () {
  //'use strict';

  // Utilisez setTimeout pour afficher le message après 10 secondes
  window.addEventListener('load', function () {
    // Utilisez setTimeout pour afficher le message après 1 minute (60000 millisecondes)
    setTimeout(function () { // récuparation des data nécéssaire
      const idSociete = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_02-defaultXML--maintainer2-inner').value;
      const idLieux = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_02-defaultXML--interventionPlace-inner').value;
      const idIFSpec = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_03-defaultXML--needEquipement-labelText').textContent;
      const idSpec = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_03-defaultXML--specialEquipment-labelText').textContent;
      const idInter = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_02-defaultXML--interventionType-inner').value;
      const idDatedebut = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_01-defaultXML--beginDate-inner').value;
      const idDatefin = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_01-defaultXML--endDate-inner').value;
      const idDesc = document.getElementById('application-AccessManagement-Display-component---accessManagementPhase--accessmanagement_01_01_04-defaultXML--SARDescription-inner').value;
      var balisesBdi = document.getElementsByTagName("bdi");
      // Vérifiez s'il y a au moins deux balises <bdi> sur la page
      if (balisesBdi.length >= 2) {
        // Récupérez le texte contenu dans le deuxième élément <bdi>
        var idDas = balisesBdi[0].textContent;
        var idAdresse = balisesBdi[1].textContent;
        console.log("Texte du deuxième bdi : " + idAdresse);
      } else {
        console.log("Pas assez de balises bdi sur la page");
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
          var nameCell = row.querySelector("td:nth-child(2)");

          // Vérification si la cellule existe
          if (nameCell) {
            // Récupération du contenu de la cellule
            var name = nameCell.querySelector("input").value;
            contact.push(name); // Ajout du nom et prénom au tableau
          }
        });
      };
      // Récupération de l'adresse et du code site
      const idElement = idAdresse.slice(0, 13);
      idAdresse = idAdresse.substring(15);
      // Prompt des informations récupéré dans la console
      console.log("Code site: " + idElement + " Code das : " + idDas + " Société : " + idSociete + " Zone d'inter :" + idLieux + " Equipements spéciaux : " + idIFSpec + " / " + idSpec + " Nature inter :" + idInter + " Description inter : " + idDesc + " Contact : " + contact + " Adresse : " + idAdresse);
      console.log("Date debut : " + idDatedebut + "Date fin : " + idDatefin);
      // ouverture de la fenêtre pour la region
      var choix2 = prompt("Sélectionnez une Zone : \n1. NORD\n2. IDF\n3. SUD");
      // et on lance le mail !
      sendEmail(idElement, idDas, idSociete, idAdresse, idLieux, idInter, idSpec, idDesc, contact, idIFSpec, idDatedebut, idDatefin, choix2);
    }, 10000);
  });

  // fonction de création du mail
  function sendEmail(idElement, idDas, idSociete, idAdresse, idLieux, idInter, idSpec, idDesc, contact, idIFSpec, idDatedebut, idDatefin, choix2) {
    var recipient = ''; // pas de destinataire automatique
    var subject = "CELLNEX "+choix2 + ' Intervention sur les antennes FREE MOBILE,' + idElement + " // " + idDas; // sujet du mail
    var body = 'Bonjour,%0A%0ANous sommes la société CELLNEX France mandatée par l\'antenniste FREE. %0A';
    body += 'Nous vous informons que la société ' + idSociete + ' souhaite intervenir sur votre site situé au ' + idAdresse + ' le ' + idDatedebut + ' jusqu\'au ' + idDatefin + '. %0A'; //corps du mail
    body += 'Ci-dessous les informations concernant l’opération :%0A';
    body += 'Référence du site : ' + idElement + ' // ' + idDas + '.%0A';
    body += 'Lieu de l\'intervention : ' + idLieux + '.%0A';
    body += 'Nature d\'intervention :' + idInter + '.%0A';
    body += 'Sur les équipements de l\’opérateur : Cellnex France.';
    body += '%0AEquipements spéciaux : ' + idIFSpec + " " + idSpec;
    body += '%0AMotif de l’intervention : ' + idDesc;
    body += '%0ALes Intervenants sont : %0A';
    for (var i = 0; i < contact.length; i++) {
        body += contact[i] + "%0A";
    }
    body += '%0AAvons-nous votre accord pour l’intervention ? %0A';
    body += 'Dans l’attente de votre retour.%0A';
    body += '%0ACordialement,%0A';
    body += 'GACX - Guichet Accès Cellnex%0A';
    body += 'Retrouvez-nous du lundi au vendredi de 8h00 à 18h00, hors jours fériés.%0A';
    body += 'Téléphone : 0 800 94 10 99 (option 2, choix 1) %0A Cellnex Telecom%0A';


    //var mailtoLink = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); // encapsulage dans le mailto
    var urlOWA = "https://outlook.office365.com/owa/?path=/mail/action/compose&to=&subject="+subject+"&body="+body;
    window.open(urlOWA, "_blank");
    //window.location.href = mailtoLink;
  };


})();
