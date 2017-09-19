# README

Cette documentation explique les fonctionnalités de l’éditeur de texte Authôt et la manière de l’intégrer.

## Fonctionnalités : 

### Sauvegarde

La fonction de sauvegarde va récupérer le texte présent dans l’éditeur et grâce à un call API en AJAX, va aller sauvegarder le document sur l’application Authôt.

### Alignement

La fonction d’alignement va permettre de resynchroniser vos modifications dans votre transcription avec l’audio ou la vidéo. Nous allons d’abord sauvegarder votre document sur l’application Authôt. Une fois la synchronisation faite, nous récupérons le document sur notre application et mettons à jour le document présent dans votre plateforme.

N.B : Aucun changement visuel ne sera présent dans le texte, mais en arrière-plan, vos modifications seront intégrées dans les balises Authôt pour assurer le bon suivi.

### Export

La fonction d’export va permettre de récupérer votre transcription au format souhaité. Nous avons actuellement 10 formats d’export disponibles qui sont les suivants :

* Texte 
* Document 
* Sous-titres SRT 
* Sous-titres Webvtt
* Timecode 
* Xml 
* Xml original 
* Tst 
* Sjson 
* Html 

Une fois la sélection de votre format, un call AJAX demandera le fichier auprès de l’application Authôt et votre fichier sera ensuite téléchargé par votre navigateur.

N.B : Avant chaque export, votre transcription sera sauvegardée et un alignement sera aussi effectué.
Intégration

Maintenant nous allons voir comment intégrer l’éditeur de texte et nous expliquons le code fourni.

Nous allons commencer par la partie HTML qui est la plus simple.

## Partie Éditeur de texte :

Il vous suffit juste d’ajouter une div avec la classe summernote comme ceci : 
```html
<div class="summernote">
</div>
```

Nous avons aussi ajouté un modal pour sélectionner le fichier que vous souhaitez exporter ou pour recevoir des messages d’attentes. Celui-ci est personnalisable et peut être changé. Vous retrouverez le code dans le fichier index.html.

## Partie Lecteur audio/vidéo :

La seule spécificité demandée est d’ajouter un attribut supplémentaire à votre lecteur. Qui est le data-id et qui doit contenir comme valeur, l’id du fichier qu'Authôt vous fournit lors de l’envoi du fichier via notre API, dans la version de démo celui est défini en tant que CHANGE_ME.

Attention, par défaut dans le code de démonstration, le lecteur à un id=”player”, n’oubliez pas de le changer pour la suite.

## La Partie CSS : 

Vous pourrez rajouter facilement des classes à vos boutons sur notre Éditeur de texte (voir la partie JavaScript ). Il sera simple après de les configurer dans votre fichier css.

Le fichier CSS actuel comprend une configuration des boutons ainsi qu’un effet de spin qui tourne pour les chargements de vos fichiers.

## La partie Javascript :

C’est la partie la plus importante, car c’est ici que sont défini les différents calls API, ainsi que l’initialisation de l’éditeur de texte et le suivi karaoké.

## Les différents call API :

Pour chaque call API, il faudra stocker le Token d’authentification Authôt afin que l’éditeur de texte puisse le récupérer. Pour la démo, le token est configuré en tant que variable directement dans le fichier JavaScript, dans la version de démo celui-ci ainsi que l'url API d'authôt est défini comme "CHANGE_ME".

Il y a trois fonctions différentes : 

La première qui s’appelle LoadXml, qui va aller chercher le fichier XML de la transcription sur l’application Authôt afin d’initialiser la transcription.

La seconde qui s’appelle SaveApiCall, va permettre de sauvegarder votre transcription sur l’application Authôt et aussi de resynchroniser votre transcription.

La dernière est la fonction ExportApiCall qui va permettre d’exporter votre transcription au format souhaité. La sélection du format se fait à travers le modal, vous pouvez modifier la sélection du format comme vous le souhaitez.

L’initialisation de l’éditeur de texte et sa configuration : 

L’éditeur de texte utilisé est Summernote. Comme tout éditeur de texte, il faudra en javascript appeler la div qui va devenir l’éditeur de texte (ici .summernote ), et après vous pouvez configurer différentes options, telles que la hauteur de votre éditeur ainsi que la hauteur maximale et minimale. Vous pouvez aussi définir la langue des boutons et configurer la toolbar pour afficher, rajouter des boutons spécifiques (tels que le bouton de sauvegarde, alignement, export ) ou alors utiliser les boutons déjà présents dans Summernote que vous pouvez retrouver ici : [Listes des boutons](http://summernote.org/deep-dive/#custom-toolbar-popover)

Pour définir un bouton : 

Il faut l’appeler dans la toolbar puis indiquer en dessous à quelle fonction correspond le bouton.

Summernote permet aussi d’utiliser des callbacks (plus d’infos ici : [Listes des callbacks](http://summernote.org/deep-dive/#callbacks )

Nous allons donc utiliser le callback onInit, afin d’exécuter la fonction karaoké ainsi que la fonction de récupération de la transcription. 

## Le suivi Karaoké : 

Nous avons intégré le suivi karaoké sur cette démonstration, cette fonction va aller chercher le timecode présent dans le mot cliqué et placer la tête de lecture au bon endroit.

Quand le player est en cours de lecture, il y a une deuxième partie de cette fonction qui a pour objectif d’analyser les mots pour surligner le mot qui correspond au timecode retourné par l’éditeur de texte.

La fonction karaoké s’appelle dans l'init de l’éditeur de texte.
