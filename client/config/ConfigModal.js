import React from 'camunda-modeler-plugin-helpers/vendor/react';
import Modal from 'camunda-modeler-plugin-helpers/components/Modal.js';

const Title = Modal.Title || (({children}) => <h2>{children}</h2>);
const Body = Modal.Body || (({children}) => <div>{children}</div>);
const Footer = Modal.Footer || (({children}) => <div>{children}</div>);


export default function ConfigModal({onClose}) {

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
                <button type="button" className="btn btn-primary" onClick={() => onClose()}>Ok</button>
            </div>
        </Footer>
    </Modal>);
}

