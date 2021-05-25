/* eslint-disable no-unused-vars */
import React from 'camunda-modeler-plugin-helpers/react';
import {Modal} from 'camunda-modeler-plugin-helpers/components';


// polyfill upcoming structural components
const Title = Modal.Title || (({children}) => <h2>{children}</h2>);
const Body = Modal.Body || (({children}) => <div>{children}</div>);
const Footer = Modal.Footer || (({children}) => <div>{children}</div>);

// we can even use hooks to render into the application
export default function ConfigModal({onClose}) {

    // we can use the built-in styles, e.g. by adding "btn btn-primary" class names
    return (<Modal onClose={onClose}>
        <Title>
            Language changed
        </Title>
        <Body>
            <p>
                Restart the modeler to apply the configuration.
            </p>
        </Body>
        <Footer>
            <div id="languageChangeButton">
                <button type="button" class="btn btn-primary" onClick={() => onClose()}>Ok</button>
            </div>
        </Footer>
    </Modal>);
}

