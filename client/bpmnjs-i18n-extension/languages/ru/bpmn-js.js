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

/**
 * This file contains the strings used in the bpmn-js module.
 */
export default {
    'Append {type}': 'Добавить {type}',
    'Add Lane above': 'Добавить дорожку выше',
    'Divide into two Lanes': 'Разделить на две дорожки',
    'Divide into three Lanes': 'Разделить на три дорожки',
    'Add Lane below': 'Добавить дорожку ниже',
    'Append ReceiveTask': 'Добавить задачу приема сообщения',
    'Append MessageIntermediateCatchEvent': 'Добавить промежуточное событие приема сообщения',
    'Append TimerIntermediateCatchEvent': 'Добавить промежуточное событие таймер',
    'Append ConditionIntermediateCatchEvent': 'Добавить промежуточное событие условие',
    'Append SignalIntermediateCatchEvent': 'Добавить промежуточное событие приема сигнала',
    'Append compensation activity': 'Добавить событийный подпроцесс',
    'Append EndEvent': 'Добавить конечное событие',
    'Append Gateway': 'Добавить шлюз',
    'Append Task': 'Добавить задачу',
    'Append Intermediate/Boundary Event': 'Добавить промежуточное/граничащее событие',
    'Append TextAnnotation': 'Добавить текстовую аннотацию',
    'Change type': 'Изменить тип',
    'Connect using Association': 'Соединить с помощью ассоциации',
    'Connect using Sequence/MessageFlow or Association': 'Соединить с помощью потока управления/сообщений или ассоциации',
    'Connect using DataInputAssociation': 'Соединить с помощью ассоциации',
    'Remove': 'Удалить',
    'no shape type specified': 'не указан тип фигуры',
    'out of bounds release': 'выход за пределы',
    'more than {count} child lanes': 'более {count} дочерних дорожек',
    'element required': 'обязательный элемент',
    'no parent for {element} in {parent}': 'нет родительского элемента для {element} в {parent}',
    'Create {type}': 'Создать {type}',
    'Activate the hand tool': 'Активировать инструмент свободного перемещения',
    'Activate the lasso tool': 'Активировать интрумент лассо',
    'Activate the create/remove space tool': 'Активировать инструмент создания/удаления пространства',
    'Activate the global connect tool': 'Активировать инструмент соединения',
    'Create StartEvent': 'Создать стартовое событие',
    'Create Intermediate/Boundary Event': 'Создать промежуточное/граничащее событие',
    'Create EndEvent': 'Создать конечное событие',
    'Create Gateway': 'Создать шлюз',
    'Create Task': 'Создать задачу',
    'Create DataObjectReference': 'Создать объект данных',
    'Create DataStoreReference': 'Создать хранилище данных',
    'Create expanded SubProcess': 'Создать встроенные подпроцесс',
    'Create Pool/Participant': 'Создать пул',
    'Create Group': 'Создать группу',
    'Parallel Multi Instance': 'Параллельный мультипроцесс',
    'Sequential Multi Instance': 'Последовательный мультипроцесс',
    'Loop': 'Цикл',
    'Ad-hoc': 'Ad-hoc',
    'element {element} referenced by {referenced}#{property} not yet drawn': 'элемент {element}, на который ссылается {referenced}#{property} еще не создан',
    'unknown di {di} for element {semantic}': 'неизвестная директория {di} для элемента {semantic}',
    'missing {semantic}#attachedToRef': 'потерянный {semantic}#attachedToRef',
    '{semantic}#{side} Ref not specified': '{semantic}#{side} Ссылка не указана',
    'already rendered {element}': 'уже используемый {element}',
    'failed to import {element}': 'не удалось импортировать {element}',
    'multiple DI elements defined for {element}': 'несколько элементов DI, определенных для {element}',
    'no bpmnElement referenced in {element}': 'нет ссылки на элемент BPMN в {element}',
    'diagram not part of bpmn:Definitions': 'диаграмма не является частью bpmn:Definitions',
    'no diagram to display': 'нет диаграммы для отображения',
    'no process or collaboration to display': 'нет процесса или совместной процесса для отображения',
    'correcting missing bpmnElement on {plane} to {rootElement}': 'исправление отсутствующего элемента BPMN в {plane} для {rootElement}',
    'unsupported bpmnElement for {plane}: {rootElement}': 'неподдреживаемый элемент BPMN для {plane}: {rootElement}',
    'unrecognized flowElement {element} in context {context}': 'нераспознанный поток {element} в контексте {context}',
    'HELLO {you}!': 'ПРИВЕТ {you}!'
};
