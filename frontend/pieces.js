const reponse = await fetch('pieces-autos.json');
const pieces = await reponse.json();

// for (let piece of pieces) {
// 	const articleElement = `<img src="${piece.image}" alt="${piece.nom}">
//   <h2>${piece.nom}</h2>;
//   <p>Prix : ${piece.prix} € | (${piece.prix < 35 ? '€' : '€€€'})</p>
//   <p>${piece.categorie ?? 'Non catégorisé'}</p>
//  <p>${piece.description ?? 'Pas de description pour le moment.'}</p>
// <p>${piece.disponibilite ? 'En stock' : 'Rupture de stock'}</p>`;
// 	sectionFiches.innerHTML += articleElement;
// }

// Récupération des pièces depuis le fichier JSON

for (let i = 0; i < pieces.length; i++) {
	const article = pieces[i];
	// Récupération de l'élément du DOM qui accueillera les fiches
	const sectionFiches = document.querySelector('.fiches');
	// Création d’une balise dédiée à une pièce automobile
	const pieceElement = document.createElement('article');
	// Création des balises
	const imageElement = document.createElement('img');
	imageElement.src = article.image;
	const nomElement = document.createElement('h2');
	nomElement.innerText = article.nom;
	const prixElement = document.createElement('p');
	prixElement.innerText = `Prix: ${article.prix} € (${
		article.prix < 35 ? '€' : '€€€'
	})`;
	const categorieElement = document.createElement('p');
	categorieElement.innerText = article.categorie ?? '(aucune catégorie)';
	const descriptionElement = document.createElement('p');
	descriptionElement.innerText =
		article.description ?? 'Pas de description pour le moment.';
	const stockElement = document.createElement('p');
	stockElement.innerText = article.disponibilite
		? 'En stock'
		: 'Rupture de stock';

	// On rattache la balise article a la section Fiches
	sectionFiches.appendChild(pieceElement);
	// On rattache l’image à pieceElement (la balise article)
	pieceElement.appendChild(imageElement);
	pieceElement.appendChild(nomElement);
	pieceElement.appendChild(prixElement);
	pieceElement.appendChild(categorieElement);
	//Ajout des éléments au DOM pour l'exercice
	pieceElement.appendChild(descriptionElement);
	pieceElement.appendChild(stockElement);
}

/* Filtres des pièces */
// bouton Trier avec sort() :
const btnTrier = document.querySelector('.btn-trier');
btnTrier.addEventListener('click', () => {
	// copie du tableau de pieces :
	const piecesOrdonnees = [...pieces];
	piecesOrdonnees.sort((a, b) => a.prix - b.prix);
	console.log(piecesOrdonnees);
});

// bouton Trier par prix décroissant avec sort() :
const btnDecroissant = document.querySelector('.btn-decroissant');
btnDecroissant.addEventListener('click', () => {
	const piecesOrdonnees = [...pieces];
	piecesOrdonnees.sort((a, b) => b.prix - a.prix);
	console.log(piecesOrdonnees);
});

// bouton Filtrer prix abordables avec filter() :
const btnFiltrer = document.querySelector('.btn-filtrer');
btnFiltrer.addEventListener('click', () => {
	const piecesFiltrees = pieces.filter((piece) => piece.prix <= 35);
	console.log(piecesFiltrees);
});

// bouton Filter pieces sans decription avec filter() :
const btnFiltrerNoDesc = document.querySelector('.btn-nodesc');
btnFiltrerNoDesc.addEventListener('click', () => {
	const piecesFiltrees = pieces.filter((piece) => piece.description);
	console.log(piecesFiltrees);
});

// Affichage nom des pieces uniquement :
const noms = pieces.map((piece) => piece.nom);
for (let i = noms.length - 1; i >= 0; i--) {
	if (pieces[i].prix > 35) {
		noms.splice(i, 1);
	}
}

// Création de la liste des noms des pièces abordables
const abordablesElements = document.createElement('ul');

for (let i = 0; i < noms.length; i++) {
	const nomElement = document.createElement('li');
	nomElement.innerText = noms[i];
	abordablesElements.appendChild(nomElement);
}

document.querySelector('.abordables').appendChild(abordablesElements);

// Création de la liste des pièces disponibles :
const disponibles = pieces.map((piece) => `${piece.nom} - ${piece.prix} €`);
for (let i = noms.length - 1; i >= 0; i--) {
	if (!pieces[i].disponibilite) {
		disponibles.splice(i, 1);
	}
}
const disponiblesElements = document.createElement('ul');

for (let i = 0; i < disponibles.length; i++) {
	const disponibleElement = document.createElement('li');
	console.log(disponibles[i]);
	disponibleElement.innerText = disponibles[i];
	disponiblesElements.appendChild(disponibleElement);
}

document.querySelector('.disponibles').appendChild(disponiblesElements);
