- Un joueur ne peut pas rejoindre une partie s'il y a déjà 2 joueur dedans = OK

- Ne pas donner le rôle d'admin à tout le monde pour qu'un user ne puisse pas modifier les infos d'un autre utilisateur = OK

- Le middleware CheckRole est utilisé dans la route GET users pour montrer que la gestion des rôles fonctionne.= OK

- Si un joueur est seul dans une partie il ne peut pas jouer et dois attendre qu'un autre joueur se connecte = OK

- Si un joueur ne fait pas partie de la partie il ne peut pas jouer = OK

- Un joueur ne doit pas pouvoir jouer sur une case qui a déjà été utilisée = OK

- Si un joueur vient de jouer il ne doit pas pouvoir rejouer avant que l'autre joueur n'aie jouer son tour = OK

- Verification de si quelqu'un a gagné semble buggé : 
=> si le joueur X fait 0 + 3 + 6 il devrait gagner 
=> Donc problème dans le check des colonnes = OK
=> Diagonales et lignes sont OK 

- Quand un joueur est déclaré gagnant, on demande de cloturer la partie et on fait une requete DELETE camouflée en "terminer la partie / cloturer" = OK 

- Uniquement un joueur de la partie peut la cloturer = OK 

- Inclure CheckAuth a chaque move dans une partie ? ( de la connexion à la fin) = OK

- Inclure la gestion de la traduction = OK POUR LA PARTIE GAME
- Inclure le versionning 
- inclure la gestion de la norme HATEOAS

- Faire un READ.ME qui explique tout notre projet et comment verifier que ca fonctionne bien.

