/**
 * This file contains the strings used in the bpmn-js module.
 */
const translations: Record<string, string> = {
    'A participant shown as a black box': 'Un participant affiché comme une boîte noire',
    'A participant with its process shown inside':
        "Un participant dont le processus est affiché à l'intérieur",
    'A subprocess that completes as a whole, or is compensated':
        "Un sous-processus qui s'achève dans son ensemble ou qui est compensé",
    'A subprocess triggered by an event in its scope':
        'Un sous-processus déclenché par un événement dans sa portée',
    'A task done by a person without any tooling or UI':
        'Une tâche réalisée par une personne sans outil ni interface',
    'Activate create/remove space tool': "Activer l'outil d'ajout/suppression d'espace",
    'Activate global connect tool': "Activer l'outil de connexion globale",
    'Activities run in any order, any number of times':
        "Les activités s'exécutent dans n'importe quel ordre et autant de fois que nécessaire",
    'Activities run in any order; shown collapsed':
        "Les activités s'exécutent dans n'importe quel ordre ; affiché réduit",
    'Ad-hoc sub-process': 'Sous-processus ad-hoc',
    'Ad-hoc sub-process (collapsed)': 'Sous-processus ad-hoc (réduit)',
    'Ad-hoc sub-process (expanded)': 'Sous-processus ad-hoc (développé)',
    'Add lane above': 'Ajouter un couloir au-dessus',
    'Add lane below': 'Ajouter un couloir en dessous',
    'Align elements': 'Aligner les éléments',
    'An unspecified step, often used as a placeholder':
        'Une étape non spécifiée, souvent utilisée comme espace réservé',
    'Append compensation activity': 'Ajouter une activité de compensation',
    'Append conditional intermediate catch event':
        'Ajouter un événement intermédiaire conditionnel de réception',
    'Append end event': 'Ajouter un événement de fin',
    'Append gateway': 'Ajouter une passerelle',
    'Append intermediate/boundary event': 'Ajouter un événement intermédiaire / de bordure',
    'Append message intermediate catch event':
        'Ajouter un événement intermédiaire de réception de message',
    'Append receive task': 'Ajouter une tâche de réception',
    'Append signal intermediate catch event':
        'Ajouter un événement intermédiaire de réception de signal',
    'Append task': 'Ajouter une tâche',
    'Append timer intermediate catch event': 'Ajouter un événement intermédiaire de minuterie',
    'Atomic units of work in a process': "Unités de travail atomiques d'un processus",
    'Attaches a compensation handler to the activity':
        "Attache un gestionnaire de compensation à l'activité",
    'Automated work carried out by a job worker or connector':
        'Un travail automatisé réalisé par un job worker ou un connecteur',
    'Boundary event': 'Événement de bordure',
    'Boundary events': 'Événements de bordure',
    'Broadcasts a signal': 'Diffuse un signal',
    'Business rule task': 'Tâche de règle métier',
    'Call activity': "Activité d'appel",
    'Calls another process as a reusable subprocess':
        'Appelle un autre processus comme sous-processus réutilisable',
    'Cancel boundary event': "Événement de bordure d'annulation",
    'Cancel end event': "Événement de fin d'annulation",
    'Cancels the transaction and ends the path': 'Annule la transaction et termine le chemin',
    Collaboration: 'Collaboration',
    'Compensation boundary event': 'Événement de bordure de compensation',
    'Compensation end event': 'Événement de fin de compensation',
    'Compensation intermediate throw event': "Événement intermédiaire d'émission de compensation",
    'Compensation start event': 'Événement de démarrage de compensation',
    'Complex gateway': 'Passerelle complexe',
    'Conditional boundary event': 'Événement de bordure conditionnel',
    'Conditional boundary event (non-interrupting)':
        'Événement de bordure conditionnel (non interruptif)',
    'Conditional flow': 'Flux conditionnel',
    'Conditional intermediate catch event': 'Événement intermédiaire conditionnel de réception',
    'Conditional start event': 'Événement de démarrage conditionnel',
    'Conditional start event (non-interrupting)':
        'Événement de démarrage conditionnel (non interruptif)',
    'Connect to other element': 'Connecter à un autre élément',
    'Connect using association': 'Connecter avec une association',
    'Connect using data input association': 'Connecter avec une association de données en entrée',
    'Connects one element to the next in the flow': 'Relie un élément au suivant dans le flux',
    'Continues from a matching link event': "Reprend à partir d'un événement de lien correspondant",
    'Create data object reference': "Créer une référence d'objet de données",
    'Create data store reference': 'Créer une référence de magasin de données',
    'Create end event': 'Créer un événement de fin',
    'Create expanded sub-process': 'Créer un sous-processus développé',
    'Create gateway': 'Créer une passerelle',
    'Create group': 'Créer un groupe',
    'Create intermediate/boundary event': 'Créer un événement intermédiaire / de bordure',
    'Create pool/participant': 'Créer un pool/participant',
    'Create start event': 'Créer un événement de démarrage',
    'Create task': 'Créer une tâche',
    Data: 'Données',
    'Data created and used within a process instance':
        "Données créées et utilisées au sein d'une instance de processus",
    'Data object must be placed within a pool/participant.':
        "L'objet de données doit être placé dans un pool/participant.",
    'Data object reference': "Référence d'objet de données",
    'Data store reference': 'Référence de magasin de données',
    'Data that persists beyond the process instance':
        "Données qui persistent au-delà de l'instance de processus",
    'Data the process uses': 'Données utilisées par le processus',
    'Default flow': 'Flux par défaut',
    'Distribute elements horizontally': 'Répartir les éléments horizontalement',
    'Distribute elements vertically': 'Répartir les éléments verticalement',
    'Divide into three lanes': 'Diviser en trois couloirs',
    'Divide into two lanes': 'Diviser en deux couloirs',
    'Emit an event, then continue': 'Émettent un événement, puis continuent',
    'Empty pool/participant (removes content)': 'Pool/participant vide (le contenu est supprimé)',
    'End event': 'Événement de fin',
    'End events': 'Événements de fin',
    'Ends the current path': 'Termine le chemin actuel',
    'Ends the path and broadcasts a signal': 'Termine le chemin et diffuse un signal',
    'Ends the path and raises an escalation': 'Termine le chemin et déclenche une escalade',
    'Ends the path and sends a message': 'Termine le chemin et envoie un message',
    'Ends the path and triggers compensation': 'Termine le chemin et déclenche la compensation',
    'Ends the path by throwing an error': 'Termine le chemin en levant une erreur',
    'Error boundary event': "Événement de bordure d'erreur",
    'Error end event': "Événement de fin d'erreur",
    'Error start event': "Événement de démarrage d'erreur",
    'Escalation boundary event': "Événement de bordure d'escalade",
    'Escalation boundary event (non-interrupting)':
        "Événement de bordure d'escalade (non interruptif)",
    'Escalation end event': "Événement de fin d'escalade",
    'Escalation intermediate throw event': "Événement intermédiaire d'émission d'escalade",
    'Escalation start event': "Événement de démarrage d'escalade",
    'Escalation start event (non-interrupting)':
        "Événement de démarrage d'escalade (non interruptif)",
    'Evaluates a business rule, typically a DMN decision':
        'Évalue une règle métier, généralement une décision DMN',
    'Event sub-process': 'Sous-processus événementiel',
    'Event-based gateway': 'Passerelle événementielle',
    Events: 'Événements',
    'Exclusive gateway': 'Passerelle exclusive (XOR)',
    'Expanded pool/participant': 'Pool/participant développé',
    'Fires on a timer while the activity continues':
        "Se déclenche sur une minuterie pendant que l'activité se poursuit",
    'Follows the path of whichever event occurs first':
        "Suit le chemin de l'événement qui survient en premier",
    Gateways: 'Passerelles',
    'Groups elements into a subprocess, shown collapsed':
        'Regroupe des éléments dans un sous-processus, affiché réduit',
    'Groups elements into a subprocess, shown inline':
        'Regroupe des éléments dans un sous-processus, affiché développé',
    'Handles an event that occurs while an activity is active':
        "Traite un événement survenant pendant qu'une activité est active",
    'Immediately ends all active paths in the scope':
        'Termine immédiatement tous les chemins actifs de la portée',
    'Inclusive gateway': 'Passerelle inclusive (OR)',
    'Intermediate catch events': 'Événements intermédiaires de réception',
    'Intermediate throw event': "Événement intermédiaire d'émission",
    'Intermediate throw events': "Événements intermédiaires d'émission",
    'Interrupts the activity on a defined timer':
        "Interrompt l'activité selon une minuterie définie",
    'Interrupts the activity on a matching signal':
        "Interrompt l'activité sur un signal correspondant",
    'Interrupts the activity on an escalation': "Interrompt l'activité lors d'une escalade",
    'Interrupts the activity when a condition is met':
        "Interrompt l'activité lorsqu'une condition est remplie",
    'Interrupts the activity when a message is received':
        "Interrompt l'activité à la réception d'un message",
    'Interrupts the activity when it throws an error':
        "Interrompt l'activité lorsqu'elle lève une erreur",
    'Jumps to a matching link event': 'Saute vers un événement de lien correspondant',
    'Link intermediate catch event': 'Événement intermédiaire de réception de lien',
    'Link intermediate throw event': "Événement intermédiaire d'émission de lien",
    'Manual task': 'Tâche manuelle',
    'Marks a point in the flow': 'Marque un point dans le flux',
    'Message boundary event': 'Événement de bordure de message',
    'Message boundary event (non-interrupting)':
        'Événement de bordure de message (non interruptif)',
    'Message end event': 'Événement de fin de message',
    'Message intermediate catch event': 'Événement intermédiaire de réception de message',
    'Message intermediate throw event': "Événement intermédiaire d'émission de message",
    'Message start event': 'Événement de démarrage de message',
    'Message start event (non-interrupting)': 'Événement de démarrage de message (non interruptif)',
    'Models complex branching or merging behavior':
        'Modélise un comportement complexe de division ou de fusion',
    'Nested or reusable activities': 'Activités imbriquées ou réutilisables',
    'Open {element}': 'Ouvrir {element}',
    'Parallel gateway': 'Passerelle parallèle (AND)',
    'Parallel multi-instance': 'Multi-instance parallèle',
    'Participant multiplicity': 'Multiplicité du participant',
    Participants: 'Participants',
    'Preconfigured elements': 'Éléments préconfigurés',
    'Publishes a message to a receiver': "Publie un message à destination d'un récepteur",
    'Raises an escalation to a higher scope': 'Déclenche une escalade vers une portée supérieure',
    'React to something while an activity is running':
        "Réagissent à quelque chose pendant l'exécution d'une activité",
    'Reacts to a message while the activity continues':
        "Réagit à un message pendant que l'activité se poursuit",
    'Reacts to a signal while the activity continues':
        "Réagit à un signal pendant que l'activité se poursuit",
    'Reacts to an escalation while the activity continues':
        "Réagit à une escalade pendant que l'activité se poursuit",
    'Reacts when a condition is met; activity continues':
        "Réagit lorsqu'une condition est remplie ; l'activité se poursuit",
    'Reacts when a transaction is canceled': "Réagit lorsqu'une transaction est annulée",
    'Receive task': 'Tâche de réception',
    'no shape type specified': 'aucun type de forme spécifié',
    'out of bounds release': 'libération hors limites',
    'element required': 'élément requis',
    Loop: 'Boucle',
    'Ad-hoc': 'Ad-hoc',
    'no diagram to display': 'aucun diagramme à afficher',
    'no process or collaboration to display': 'aucun processus ou collaboration à afficher',
    'Route the flow: branch or merge paths':
        'Orientent le flux : divisent ou fusionnent les chemins',
    'Routes the token down one path, based on data':
        'Oriente le jeton vers un seul chemin, en fonction des données',
    'Runs a script': 'Exécute un script',
    'Script task': 'Tâche de script',
    'Send task': "Tâche d'envoi",
    'Sends a message': 'Envoie un message',
    'Sequence flow': 'Flux de séquence',
    'Sequential multi-instance': 'Multi-instance séquentielle',
    'Service task': 'Tâche de service',
    'Signal boundary event': 'Événement de bordure de signal',
    'Signal boundary event (non-interrupting)': 'Événement de bordure de signal (non interruptif)',
    'Signal end event': 'Événement de fin de signal',
    'Signal intermediate catch event': 'Événement intermédiaire de réception de signal',
    'Signal intermediate throw event': "Événement intermédiaire d'émission de signal",
    'Signal start event': 'Événement de démarrage de signal',
    'Signal start event (non-interrupting)': 'Événement de démarrage de signal (non interruptif)',
    'Splits the flow into parallel paths, or joins them':
        'Divise le flux en chemins parallèles ou les fusionne',
    'Start event': 'Événement de démarrage',
    'Start events': 'Événements de démarrage',
    'Starts an event subprocess on a message, without interrupting':
        'Démarre un sous-processus événementiel sur un message, sans interrompre',
    'Starts an event subprocess on a signal, without interrupting':
        'Démarre un sous-processus événementiel sur un signal, sans interrompre',
    'Starts an event subprocess on a timer, without interrupting':
        'Démarre un sous-processus événementiel sur une minuterie, sans interrompre',
    'Starts an event subprocess on an escalation':
        "Démarre un sous-processus événementiel lors d'une escalade",
    'Starts an event subprocess on an escalation, without interrupting':
        "Démarre un sous-processus événementiel lors d'une escalade, sans interrompre",
    'Starts an event subprocess to handle compensation':
        'Démarre un sous-processus événementiel pour gérer la compensation',
    'Starts an event subprocess when a condition is met, without interrupting':
        "Démarre un sous-processus événementiel lorsqu'une condition est remplie, sans interrompre",
    'Starts an event subprocess when an error is thrown':
        "Démarre un sous-processus événementiel lorsqu'une erreur est levée",
    'Starts the process on a defined timer': 'Démarre le processus selon une minuterie définie',
    'Starts the process when a condition is met':
        "Démarre le processus lorsqu'une condition est remplie",
    'Starts the process when a matching signal is broadcast':
        "Démarre le processus lorsqu'un signal correspondant est diffusé",
    'Starts the process when a message is received':
        "Démarre le processus à la réception d'un message",
    'Sub-process': 'Sous-processus',
    'Sub-process (collapsed)': 'Sous-processus (réduit)',
    'Sub-process (expanded)': 'Sous-processus (développé)',
    'Sub-processes': 'Sous-processus',
    'Systems or organizations involved': 'Systèmes ou organisations impliqués',
    'Taken only when its condition is met': 'Emprunté uniquement lorsque sa condition est remplie',
    'Takes every outgoing path whose condition is met':
        'Emprunte tous les chemins sortants dont la condition est remplie',
    Tasks: 'Tâches',
    'Terminate end event': 'Événement de fin de terminaison',
    'The default path, taken when no other path condition is met':
        "Le chemin par défaut, emprunté lorsqu'aucune autre condition n'est remplie",
    'Things a process reacts to or emits': "Ce à quoi un processus réagit ou ce qu'il émet",
    'Timer boundary event': 'Événement de bordure de minuterie',
    'Timer boundary event (non-interrupting)':
        'Événement de bordure de minuterie (non interruptif)',
    'Timer intermediate catch event': 'Événement intermédiaire de minuterie',
    'Timer start event': 'Événement de démarrage de minuterie',
    'Timer start event (non-interrupting)': 'Événement de démarrage de minuterie (non interruptif)',
    'Toggle non-interrupting': 'Basculer en non interruptif',
    'Triggers compensation of completed activities':
        'Déclenche la compensation des activités terminées',
    'User task': 'Tâche utilisateur',
    'Wait for something to happen before continuing':
        "Attendent qu'un événement survienne avant de continuer",
    'Waits for a defined time or duration': 'Attend un instant ou une durée définis',
    'Waits for a matching signal to be broadcast': "Attend la diffusion d'un signal correspondant",
    'Waits for a message to be received': "Attend la réception d'un message",
    'Waits until a condition is met': "Attend qu'une condition soit remplie",
    'Waits until a message is received': "Attend qu'un message soit reçu",
    'Where a process or path begins': 'Là où un processus ou un chemin commence',
    'Where a process path ends': 'Là où un chemin du processus se termine',
    'Where the process begins': 'Là où le processus commence',
    'Work that needs to be done by a person': 'Un travail qui doit être effectué par une personne',
    Group: 'Groupe',
    Process: 'Processus',
    'Text Annotation': 'Annotation',
    'Intermediate Catch Event': 'Événement intermédiaire de réception',
    'Collapsed Sub Process': 'Sous-processus réduit',
    'No Issues': 'Aucun problème',
    'Toggle linting overlays': 'Afficher/masquer les incrustations de linting',
    'Issues for child elements': 'Problèmes des éléments enfants',
    '{errors} Errors, {warnings} Warnings': '{errors} erreurs, {warnings} avertissements',
};
export default translations;
