/* eslint-disable no-unused-vars */
import React, { useState } from 'camunda-modeler-plugin-helpers/react';
import { Modal } from 'camunda-modeler-plugin-helpers/components';


// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{ children }</h2>);
const Body = Modal.Body || (({ children }) => <div>{ children }</div>);
const Footer = Modal.Footer || (({ children }) => <div>{ children }</div>);

// we can even use hooks to render into the application
export default function ConfigModal({ initValues, onClose }) {
  const [ enabled, setEnabled ] = useState(initValues.enabled);
  const [ interval, setAutoSaveInterval ] = useState(initValues.interval);

  const onSubmit = () => onClose({ enabled, interval });

  // we can use the built-in styles, e.g. by adding "btn btn-primary" class names
  return <Modal onClose={ onClose }>
    <Title>
      AutoSave Configuration
    </Title>

    <Body>
      <form id="autoSaveConfigForm" onSubmit={ onSubmit }>
        <p>
          <label>
            Enabled:
            <input
              type="checkbox"
              name="enabled"
              checked={ enabled }
              onChange={ () => setEnabled(!enabled) }
            />
          </label>
        </p>
        <p>
          <label>
            Interval (seconds):
            <input
              type="number"
              name="interval"
              min="1"
              value={ interval }
              onChange={ event => setAutoSaveInterval(Number(event.target.value)) }
            />
          </label>
        </p>
      </form>
    </Body>

    <Footer>
      <div id="autoSaveConfigButtons">
        <button type="submit" class="btn btn-primary" form="autoSaveConfigForm">Save</button>
        <button type="button" class="btn btn-secondary" onClick={ () => onClose() }>Cancel</button>
      </div>
    </Footer>
  </Modal>;
}

