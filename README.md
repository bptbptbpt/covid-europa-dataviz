# Cartographie des décès dûs au COVID-19 en Europe

Le but de ce projet est de pouvoir facilement découvrir les statistiques du nombre de personnes décédées suite au COVID-19 dans les différents pays d'Europe. La manière interactive de les présenter, grâce aux foncionnalités de hover, click et présentation de graphique, souhaitent rendre ces données plus captivantes. 

## Les données

### Source

Les statistiques utilsées proviennet du site de l'OECD (Organisation for Economic Co-operation and Development): www.oecd.org.
Ils  mettent à disposition des statistiques concernant le COVID-19, entre autres. Nous avons récupéré le nombre de morts par semaine et par pays pour l'année 2022, pour les hommes, les femmes et le nombre total. Ces données ont ensuite été nettoyées dans excel pour pouvoir être utilisées par l'application. 

La couche vectorielle est un fichier geoJSOn récupéré sur [ce repository](https://github.com/leakyMirror/map-of-europe) le leakyMirror puis modifié manuellement avec www.geojson.io. 

Le fond de carte provient de XXX.

### Organisation

/////// TODO

Lister les features du fichier geojson
Expliquer vite fait l'organistaion des fichiers ?

## Outils et librairies

- La librairie Javascript Leaflet pour la création de la carte interactive
- d3 pour la création et visualisation de graphiques
- Github pour la collaboration durant l'élaboration  du projet 
