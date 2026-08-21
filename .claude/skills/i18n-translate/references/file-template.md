# Translation File Template

Every translation file in this project follows this exact structure.

Source files carry **no per-file license header**. The project is licensed
MIT centrally via the `LICENSE` file at the repo root.

## Translation File (e.g., bpmn-js.js)

```javascript
/**
 * This file contains the strings used in the bpmn-js module.
 */
export default {
    'English key': 'Translated value',
    'Another key with {param}': 'Translated with {param}',
};
```

**File-specific doc comments:**

- `bpmn-js.js`: `This file contains the strings used in the bpmn-js module.`
- `dmn-js.js`: `This file contains the translated strings used in the dmn-js component.`
- `properties-panel.js`: `This file contains the translations used by the bpmn-js-properties-panel component.`
- `other.js`: `This file contains translations that were used in other components.`

## Barrel File (e.g., es.js)

```javascript
import bpmnJs from './<locale>/bpmn-js';
import dmnJs from './<locale>/dmn-js';
import propertiesPanel from './<locale>/properties-panel';
import other from './<locale>/other';

/**
 * Joins and exports the translated strings.
 */
export default {
    ...bpmnJs,
    ...dmnJs,
    ...propertiesPanel,
    ...other,
};
```

## Formatting Rules

- Use single quotes for all strings
- Trailing comma on every key-value pair
- 4-space indentation inside the export object
- No trailing newline after the closing `};`
- Keys must be in the same order as the German (de) source files
