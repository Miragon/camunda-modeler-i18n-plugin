/**
 * Copyright 2021 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'camunda-modeler-plugin-helpers/react';
import {Modal} from 'camunda-modeler-plugin-helpers/components';

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
                <button type="button" class="btn btn-primary" onClick={() => onClose()}>Ok</button>
            </div>
        </Footer>
    </Modal>);
}

