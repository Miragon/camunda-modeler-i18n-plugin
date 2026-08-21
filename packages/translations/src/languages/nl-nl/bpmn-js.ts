/**
 * This file contains the strings used in the bpmn-js module.
 */
const translations: Record<string, string> = {
    'A participant shown as a black box': 'Een participant die als black box wordt weergegeven',
    'A participant with its process shown inside':
        'Een participant met het proces zichtbaar aan de binnenkant',
    'A subprocess that completes as a whole, or is compensated':
        'Een subproces dat als geheel wordt afgerond of wordt gecompenseerd',
    'A subprocess triggered by an event in its scope':
        'Een subproces dat wordt getriggerd door een event binnen zijn scope',
    'A task done by a person without any tooling or UI':
        'Een taak die een persoon uitvoert zonder tooling of UI',
    'Activate create/remove space tool': 'Activeer gereedschap voor ruimte toevoegen/verwijderen',
    'Activate global connect tool': 'Activeer globaal verbindingsgereedschap',
    'Activities run in any order, any number of times':
        'Activities lopen in willekeurige volgorde en een willekeurig aantal keren',
    'Activities run in any order; shown collapsed':
        'Activities lopen in willekeurige volgorde; ingeklapt weergegeven',
    'Ad-hoc sub-process': 'Ad-hoc Sub-Process',
    'Ad-hoc sub-process (collapsed)': 'Ad-hoc Sub-Process (ingeklapt)',
    'Ad-hoc sub-process (expanded)': 'Ad-hoc Sub-Process (uitgeklapt)',
    'Add lane above': 'Voeg lane erboven toe',
    'Add lane below': 'Voeg lane eronder toe',
    'Align elements': 'Lijn elementen uit',
    'An unspecified step, often used as a placeholder':
        'Een niet nader bepaalde stap, vaak gebruikt als placeholder',
    'Append compensation activity': 'Voeg compensation activity toe',
    'Append conditional intermediate catch event': 'Voeg conditional intermediate catch event toe',
    'Append end event': 'Voeg end event toe',
    'Append gateway': 'Voeg gateway toe',
    'Append intermediate/boundary event': 'Voeg intermediate/boundary event toe',
    'Append message intermediate catch event': 'Voeg message intermediate catch event toe',
    'Append receive task': 'Voeg receive task toe',
    'Append signal intermediate catch event': 'Voeg signal intermediate catch event toe',
    'Append task': 'Voeg task toe',
    'Append timer intermediate catch event': 'Voeg timer intermediate catch event toe',
    'Atomic units of work in a process': 'Ondeelbare eenheden werk binnen een proces',
    'Attaches a compensation handler to the activity':
        'Koppelt een compensatie-handler aan de activity',
    'Automated work carried out by a job worker or connector':
        'Geautomatiseerd werk dat door een job worker of connector wordt uitgevoerd',
    'Boundary event': 'Boundary-Event',
    'Boundary events': 'Boundary-Events',
    'Broadcasts a signal': 'Zendt een signal uit',
    'Business rule task': 'Business-Rule-Task',
    'Call activity': 'Call-Activity',
    'Calls another process as a reusable subprocess':
        'Roept een ander proces aan als herbruikbaar subproces',
    'Cancel boundary event': 'Cancel-Boundary-Event',
    'Cancel end event': 'Cancel-End-Event',
    'Cancels the transaction and ends the path': 'Annuleert de transactie en beëindigt het pad',
    Collaboration: 'Collaboration',
    'Compensation boundary event': 'Compensation-Boundary-Event',
    'Compensation end event': 'Compensation-End-Event',
    'Compensation intermediate throw event': 'Compensation-Intermediate-Throw-Event',
    'Compensation start event': 'Compensation-Start-Event',
    'Complex gateway': 'Complex-Gateway',
    'Conditional boundary event': 'Conditional-Boundary-Event',
    'Conditional boundary event (non-interrupting)':
        'Conditional-Boundary-Event (niet-onderbrekend)',
    'Conditional flow': 'Conditional-Flow',
    'Conditional intermediate catch event': 'Conditional-Intermediate-Catch-Event',
    'Conditional start event': 'Conditional-Start-Event',
    'Conditional start event (non-interrupting)': 'Conditional-Start-Event (niet-onderbrekend)',
    'Connect to other element': 'Verbind met ander element',
    'Connect using association': 'Verbind met een association',
    'Connect using data input association': 'Verbind met een data input association',
    'Connects one element to the next in the flow':
        'Verbindt het ene element met het volgende in de flow',
    'Continues from a matching link event': 'Gaat verder vanaf een passend link-event',
    'Create data object reference': 'Maak data object reference',
    'Create data store reference': 'Maak data store reference',
    'Create end event': 'Maak end event',
    'Create expanded sub-process': 'Maak uitgeklapt sub-process',
    'Create gateway': 'Maak gateway',
    'Create group': 'Maak groep',
    'Create intermediate/boundary event': 'Maak intermediate/boundary event',
    'Create pool/participant': 'Maak pool/participant',
    'Create start event': 'Maak start event',
    'Create task': 'Maak task',
    Data: 'Data',
    'Data created and used within a process instance':
        'Gegevens die binnen een process instance worden aangemaakt en gebruikt',
    'Data object must be placed within a pool/participant.':
        'Data-object moet binnen een pool/participant worden geplaatst.',
    'Data object reference': 'Data-Object-Reference',
    'Data store reference': 'Data-Store-Reference',
    'Data that persists beyond the process instance':
        'Gegevens die blijven bestaan na de process instance',
    'Data the process uses': 'Gegevens die het proces gebruikt',
    'Default flow': 'Default-Flow',
    'Distribute elements horizontally': 'Verdeel elementen horizontaal',
    'Distribute elements vertically': 'Verdeel elementen verticaal',
    'Divide into three lanes': 'Verdeel in drie lanes',
    'Divide into two lanes': 'Verdeel in twee lanes',
    'Emit an event, then continue': 'Sturen een event uit en gaan dan verder',
    'Empty pool/participant (removes content)': 'Lege pool/participant (inhoud wordt verwijderd)',
    'End event': 'End-Event',
    'End events': 'End-Events',
    'Ends the current path': 'Beëindigt het huidige pad',
    'Ends the path and broadcasts a signal': 'Beëindigt het pad en zendt een signal uit',
    'Ends the path and raises an escalation': 'Beëindigt het pad en stuurt een escalation',
    'Ends the path and sends a message': 'Beëindigt het pad en verstuurt een message',
    'Ends the path and triggers compensation': 'Beëindigt het pad en triggert compensatie',
    'Ends the path by throwing an error': 'Beëindigt het pad door een error te gooien',
    'Error boundary event': 'Error-Boundary-Event',
    'Error end event': 'Error-End-Event',
    'Error start event': 'Error-Start-Event',
    'Escalation boundary event': 'Escalation-Boundary-Event',
    'Escalation boundary event (non-interrupting)': 'Escalation-Boundary-Event (niet-onderbrekend)',
    'Escalation end event': 'Escalation-End-Event',
    'Escalation intermediate throw event': 'Escalation-Intermediate-Throw-Event',
    'Escalation start event': 'Escalation-Start-Event',
    'Escalation start event (non-interrupting)': 'Escalation-Start-Event (niet-onderbrekend)',
    'Evaluates a business rule, typically a DMN decision':
        'Evalueert een business rule, meestal een DMN-decision',
    'Event sub-process': 'Event-Sub-Process',
    'Event-based gateway': 'Event-Based-Gateway',
    Events: 'Events',
    'Exclusive gateway': 'Exclusive-Gateway (XOR)',
    'Expanded pool/participant': 'Uitgeklapte pool/participant',
    'Fires on a timer while the activity continues':
        'Vuurt af op een timer terwijl de activity doorloopt',
    'Follows the path of whichever event occurs first':
        'Volgt het pad van het event dat als eerste optreedt',
    Gateways: 'Gateways',
    'Groups elements into a subprocess, shown collapsed':
        'Groepeert elementen in een subproces, ingeklapt weergegeven',
    'Groups elements into a subprocess, shown inline':
        'Groepeert elementen in een subproces, uitgeklapt weergegeven',
    'Handles an event that occurs while an activity is active':
        'Handelt een event af dat optreedt terwijl een activity actief is',
    'Immediately ends all active paths in the scope':
        'Beëindigt direct alle actieve paden binnen de scope',
    'Inclusive gateway': 'Inclusive-Gateway (OR)',
    'Intermediate catch events': 'Intermediate-Catch-Events',
    'Intermediate throw event': 'Intermediate-Throw-Event',
    'Intermediate throw events': 'Intermediate-Throw-Events',
    'Interrupts the activity on a defined timer':
        'Onderbreekt de activity op een gedefinieerde timer',
    'Interrupts the activity on a matching signal':
        'Onderbreekt de activity bij een passend signal',
    'Interrupts the activity on an escalation': 'Onderbreekt de activity bij een escalation',
    'Interrupts the activity when a condition is met':
        'Onderbreekt de activity zodra een conditie is vervuld',
    'Interrupts the activity when a message is received':
        'Onderbreekt de activity zodra er een message wordt ontvangen',
    'Interrupts the activity when it throws an error':
        'Onderbreekt de activity zodra deze een error gooit',
    'Jumps to a matching link event': 'Springt naar een passend link-event',
    'Link intermediate catch event': 'Link-Intermediate-Catch-Event',
    'Link intermediate throw event': 'Link-Intermediate-Throw-Event',
    'Manual task': 'Manual-Task',
    'Marks a point in the flow': 'Markeert een punt in de flow',
    'Message boundary event': 'Message-Boundary-Event',
    'Message boundary event (non-interrupting)': 'Message-Boundary-Event (niet-onderbrekend)',
    'Message end event': 'Message-End-Event',
    'Message intermediate catch event': 'Message-Intermediate-Catch-Event',
    'Message intermediate throw event': 'Message-Intermediate-Throw-Event',
    'Message start event': 'Message-Start-Event',
    'Message start event (non-interrupting)': 'Message-Start-Event (niet-onderbrekend)',
    'Models complex branching or merging behavior': 'Modelleert complex splits- of samenvoeggedrag',
    'Nested or reusable activities': 'Geneste of herbruikbare activities',
    'Open {element}': '{element} openen',
    'Parallel gateway': 'Parallel-Gateway (AND)',
    'Parallel multi-instance': 'Parallelle multi-instance',
    'Participant multiplicity': 'Participant-multipliciteit',
    Participants: 'Participants',
    'Preconfigured elements': 'Vooraf geconfigureerde elementen',
    'Publishes a message to a receiver': 'Publiceert een message naar een ontvanger',
    'Raises an escalation to a higher scope': 'Stuurt een escalation naar een hogere scope',
    'React to something while an activity is running':
        'Reageren op iets terwijl een activity loopt',
    'Reacts to a message while the activity continues':
        'Reageert op een message terwijl de activity doorloopt',
    'Reacts to a signal while the activity continues':
        'Reageert op een signal terwijl de activity doorloopt',
    'Reacts to an escalation while the activity continues':
        'Reageert op een escalation terwijl de activity doorloopt',
    'Reacts when a condition is met; activity continues':
        'Reageert zodra een conditie is vervuld; de activity loopt door',
    'Reacts when a transaction is canceled': 'Reageert wanneer een transactie wordt geannuleerd',
    'Receive task': 'Receive-Task',
    'no shape type specified': 'geen vorm type gekozen',
    'out of bounds release': 'release buiten bereik',
    'element required': 'element vereist',
    Loop: 'Loop',
    'Ad-hoc': 'Ad-hoc',
    'no diagram to display': 'geen diagram om weer te geven',
    'no process or collaboration to display': 'geen process of collaboration om weer te geven',
    'Route the flow: branch or merge paths': 'Sturen de flow: paden splitsen of samenvoegen',
    'Routes the token down one path, based on data':
        'Stuurt de token op basis van gegevens naar één pad',
    'Runs a script': 'Voert een script uit',
    'Script task': 'Script-Task',
    'Send task': 'Send-Task',
    'Sends a message': 'Verstuurt een message',
    'Sequence flow': 'Sequence-Flow',
    'Sequential multi-instance': 'Sequentiële multi-instance',
    'Service task': 'Service-Task',
    'Signal boundary event': 'Signal-Boundary-Event',
    'Signal boundary event (non-interrupting)': 'Signal-Boundary-Event (niet-onderbrekend)',
    'Signal end event': 'Signal-End-Event',
    'Signal intermediate catch event': 'Signal-Intermediate-Catch-Event',
    'Signal intermediate throw event': 'Signal-Intermediate-Throw-Event',
    'Signal start event': 'Signal-Start-Event',
    'Signal start event (non-interrupting)': 'Signal-Start-Event (niet-onderbrekend)',
    'Splits the flow into parallel paths, or joins them':
        'Splitst de flow in parallelle paden of voegt ze samen',
    'Start event': 'Start-Event',
    'Start events': 'Start-Events',
    'Starts an event subprocess on a message, without interrupting':
        'Start een event-subproces bij een message, zonder te onderbreken',
    'Starts an event subprocess on a signal, without interrupting':
        'Start een event-subproces bij een signal, zonder te onderbreken',
    'Starts an event subprocess on a timer, without interrupting':
        'Start een event-subproces op een timer, zonder te onderbreken',
    'Starts an event subprocess on an escalation': 'Start een event-subproces bij een escalation',
    'Starts an event subprocess on an escalation, without interrupting':
        'Start een event-subproces bij een escalation, zonder te onderbreken',
    'Starts an event subprocess to handle compensation':
        'Start een event-subproces om compensatie af te handelen',
    'Starts an event subprocess when a condition is met, without interrupting':
        'Start een event-subproces zodra een conditie is vervuld, zonder te onderbreken',
    'Starts an event subprocess when an error is thrown':
        'Start een event-subproces zodra er een error wordt gegooid',
    'Starts the process on a defined timer': 'Start het proces op een gedefinieerde timer',
    'Starts the process when a condition is met': 'Start het proces zodra een conditie is vervuld',
    'Starts the process when a matching signal is broadcast':
        'Start het proces zodra een passend signal wordt uitgezonden',
    'Starts the process when a message is received':
        'Start het proces zodra er een message wordt ontvangen',
    'Sub-process': 'Sub-Process',
    'Sub-process (collapsed)': 'Sub-Process (ingeklapt)',
    'Sub-process (expanded)': 'Sub-Process (uitgeklapt)',
    'Sub-processes': 'Sub-Processes',
    'Systems or organizations involved': 'Betrokken systemen of organisaties',
    'Taken only when its condition is met': 'Wordt alleen genomen als de conditie is vervuld',
    'Takes every outgoing path whose condition is met':
        'Neemt elk uitgaand pad waarvan de conditie is vervuld',
    Tasks: 'Tasks',
    'Terminate end event': 'Terminate-End-Event',
    'The default path, taken when no other path condition is met':
        'Het standaardpad, dat wordt genomen als geen enkele andere padconditie is vervuld',
    'Things a process reacts to or emits': 'Zaken waarop een proces reageert of die het uitstuurt',
    'Timer boundary event': 'Timer-Boundary-Event',
    'Timer boundary event (non-interrupting)': 'Timer-Boundary-Event (niet-onderbrekend)',
    'Timer intermediate catch event': 'Timer-Intermediate-Catch-Event',
    'Timer start event': 'Timer-Start-Event',
    'Timer start event (non-interrupting)': 'Timer-Start-Event (niet-onderbrekend)',
    'Toggle non-interrupting': 'Schakel niet-onderbrekend om',
    'Triggers compensation of completed activities':
        'Triggert de compensatie van afgeronde activities',
    'User task': 'User-Task',
    'Wait for something to happen before continuing':
        'Wachten tot er iets gebeurt voordat ze verdergaan',
    'Waits for a defined time or duration':
        'Wacht op een gedefinieerd tijdstip of een gedefinieerde duur',
    'Waits for a matching signal to be broadcast':
        'Wacht tot er een passend signal wordt uitgezonden',
    'Waits for a message to be received': 'Wacht tot er een message wordt ontvangen',
    'Waits until a condition is met': 'Wacht tot een conditie is vervuld',
    'Waits until a message is received': 'Wacht tot er een message wordt ontvangen',
    'Where a process or path begins': 'Waar een proces of pad begint',
    'Where a process path ends': 'Waar een pad van het proces eindigt',
    'Where the process begins': 'Waar het proces begint',
    'Work that needs to be done by a person': 'Werk dat door een persoon moet worden gedaan',
    Group: 'Groep',
    Process: 'Proces',
    'Text Annotation': 'Tekstannotatie',
    'Intermediate Catch Event': 'Intermediate-Catch-Event',
    'Collapsed Sub Process': 'Ingeklapt subproces',
    'No Issues': 'Geen problemen',
    'Toggle linting overlays': 'Linting-overlays in-/uitschakelen',
    'Issues for child elements': 'Problemen met onderliggende elementen',
    '{errors} Errors, {warnings} Warnings': '{errors} fouten, {warnings} waarschuwingen',
};
export default translations;
