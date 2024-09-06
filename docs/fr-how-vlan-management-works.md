<h1>Access Port</h1>

<h3>Paramètre</h2>
<p>"Access VLAN" : Un nombre entier allant de 1 à 4094.</p>

<h3>En mode Entrée</h3>
<p>- Les trames non taggées sont taggées avec la valeur "Access VLAN" et passent.</p>
<p>- Les trames déjà taggées avec la valeur "Access VLAN" passent.</p>

<h3>En mode Sortie</h3>
<p>- Les trames taggées avec la valeur "Access VLAN" sont dé-taggées</p>

<hr>

<h1>Trunk port</h1>

<h3>Paramètres</h3>
<p>"Native VLAN" : Un nombre entier allant de 1 à 4094.</p>
<p>"Allowed VLAN" : Une combinaison de valeurs telle que " 15,40-100,120-150,501,505 " pour indiquer des plages et/ou des valeurs seules.</p>
<br/>
<p>Note : Si "Allowed VLAN" est absent, sa valeur est automiquement positionné sur "1-4094"</p>

<h3>En mode entrée</h3>
<p>Le Native VLAN permet de tagger les trames non taggées en entrées. La trame est taggée et passe uniquement si elle est autorisée.</p>
<p>Seules passent les trames autorisées par "Allowed VLAN"</p>
<p>Les modes Trunk et Uplink partagent exactement le même traitement pour les trames entrantes.</p>

<h3>En mode sortie</h3>
<p>Le Native VLAN permet de détagger les trames taggées. Attention, elle passe et se retrouve détaguée uniquement si elle est autorisée par "Allowed VLAN"</p>
<p>Seules sortent les trames autorisées dans "Allowed VLAN"</p>

<hr>

<h1>Uplift port</h1>

<h3>Paramètres</h3>
<p>"Native VLAN" : Un nombre entier allant de 1 à 4094.</p>
<p>"Allowed VLAN" : Une combinaison de valeurs telle que " 15,40-100,120-150,501,505 " pour indiquer des plages et/ou des valeurs seules.</p>
<br/>
<p>Note : Si "Allowed VLAN" est absent, sa valeur est automiquement positionné sur "1-4094"</p>

<h3>En mode entrée</h3>
<p>Le Native VLAN permet de tagger les trames non taggées en entrées. La trame est taggée et passe uniquement si elle est autorisée.</p>
<p>Seules passent les trames autorisées par "Allowed VLAN"</p>
<p>Les modes Trunk et Uplink partagent exactement le même traitement pour les trames entrantes.</p>

<h3>En mode sortie</h3>
<p>Le Native VLAN n'est jamais utilisé en sortie. Le mode Uplift ne détagge JAMAIS de trame.</p>
<p>Seules sortent les trames autorisées dans "Allowed VLAN"</p>

<hr>

<h1>Hybrid port</h1>

<h3>Paramètres</h3>
<p>"Native VLAN" : Un nombre entier allant de 1 à 4094.</p>
<p>"Tag Allowed VLAN" : Une combinaison de valeurs telle que " 15,40-100,120-150,501,505 " pour indiquer des plages et/ou des valeurs seules.</p>
<p>"UNTag Allowed VLAN" : Une combinaison de valeurs telle que " 15,40-100,120-150,501,505 " pour indiquer des plages et/ou des valeurs seules.</p>
<br/>
<p>Par défaut, si "Tag Allowed VLAN" est vide, cela correspond à tous les ports sauf ceux de "Native VLAN" et "UNTag Allowed VLAN"</p>
<p>Par défaut, si "UNTag Allowed VLAN" est vide, il correspond à "Native VLAN".</p>

<h3>En mode entrée</h3>
<p>La valeur du "Native VLAN" permet de tagger en entrée les trames non taggées, mais uniquement si la valeur est bien présente dans "UNTag Allowed VLAN".</p>
<p>Les valeurs dans "Tag Allowed VLAN" et "UNTag Allowed VLAN" combinées permettent d'autoriser les trames taggées en entrée.</p>
<p>Dans "Tag Allowed VLAN", il n'est pas possible d'y inclure la valeur de Native VLAN</p>
<br/>

<h3>En mode sortie</h3>
<p>Les valeurs combinées de "Tag Allowed VLAN" et "UNTag Allowed VLAN" permettent d'autoriser les trames taggées à passer.</p>
<p>Les trames taguées correspondantes aux valeurs combinées de "Native VLAN" et "UNTag Allowed VLAN" sont détaggées en sortie.</p>
<p>Attention : la valeur "Native VLAN" doit être présente dans "UNTag Allowed VLAN" pour que les trames soient détaggées.</p>



