import React, { PureComponent } from 'camunda-modeler-plugin-helpers/vendor/react';
import Modal from 'camunda-modeler-plugin-helpers/components/Modal.js';

export default class RestartModal extends PureComponent {
    render() {
        const { onClose } = this.props;

        return (
            <Modal onClose={onClose}>
                <Modal.Title>Language changed</Modal.Title>
                <Modal.Body>
                    <p>Restart the modeler to apply the configuration.</p>
                </Modal.Body>
                <Modal.Footer>
                    <div id="languageChangeButton">
                        <button type="button" className="btn btn-primary" onClick={() => onClose()}>
                            Ok
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}
