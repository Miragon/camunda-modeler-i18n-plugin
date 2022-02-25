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
    'Append {type}': '追加 {type}',
    'Add Lane above': '在上方添加泳道',
    'Divide into two Lanes': '拆分成两条泳道',
    'Divide into three Lanes': '拆分成三条泳道',
    'Add Lane below': '在下方添加泳道',
    'Append ReceiveTask': '追加接收任务',
    'Append MessageIntermediateCatchEvent': '追加消息中间捕获事件',
    'Append TimerIntermediateCatchEvent': '追加时间中间捕获事件',
    'Append ConditionIntermediateCatchEvent': '追加条件中间捕获事件',
    'Append SignalIntermediateCatchEvent': '追加信号中间捕获事件',
    'Append compensation activity': '追加补偿活动',
    'Append EndEvent': '追加结束事件',
    'Append Gateway': '追加网关',
    'Append Task': '追加任务',
    'Append TextAnnotation': '追加文本描述',
    'TextAnnotation': '文本描述',
    'Append Intermediate/Boundary Event': '追加中间/边界事件',
    'Change type': '改变类型',
    'Default Flow': '默认连线',
    'Connect using Association': '使用关联连接',
    'Connect using Sequence/MessageFlow or Association': '使用序列/消息流或关联进行连接',
    'Connect using DataInputAssociation': '使用数据输入关联进行连接',
    'Remove': '删除',
    'no shape type specified': '未指定形状类型',
    'out of bounds release': '越界释放',
    'more than {count} child lanes': '超过 {count} 个子泳道',
    'element required': '所需元素',
    'no parent for {element} in {parent}': '{parent}中的{element}没有父元素',
    'Create {type}': '创建{type}',
    'Activate the hand tool': '激活手动工具',
    'Activate the lasso tool': '激活套索工具',
    'Activate the create/remove space tool': '激活创建/删除空间工具',
    'Activate the global connect tool': '激活全局连接工具',
    'Create StartEvent': '创建开始事件',
    'Create Intermediate/Boundary Event': '创建中间/边界事件',
    'Create EndEvent': '创建结束事件',
    'Create Gateway': '创建网关',
    'Create Task': '创建任务',
    'Create DataObjectReference': '创建数据对象引用',
    'Create DataStoreReference': '创建数据存储引用',
    'Create expanded SubProcess': '创建展开子流程',
    'Create Pool/Participant': '创建泳池/参与者',
    'Create Group': '创建组',
    'Parallel Multi Instance': '并行多实例',
    'Sequential Multi Instance': '串行多实例',
    'Loop': '循环',
    'Ad-hoc': '临时的',
    'element {element} referenced by {referenced}#{property} not yet drawn': '由{referenced}{property}引用的元素{element}尚未绘制',
    'unknown di {di} for element {semantic}': '元素{semantic}的未知di{di}',
    'missing {semantic}#attachedToRef': '缺少{semantic}的附加到引用',
    '{semantic}#{side} Ref not specified': '未指定{semantic}的{side}引用',
    'already rendered {element}': '已呈现 {element}',
    'failed to import {element}': '无法导入 {element}',
    'multiple DI elements defined for {element}': '{element}定义了多个DI元素',
    'no bpmnElement referenced in {element}': '{element}中没有引用bpmn元素',
    'diagram not part of bpmn:Definitions': '流程图不属于bpmn:Definitions',
    'no diagram to display': '没有要显示的流程图',
    'no process or collaboration to display': '没有要显示的流程或协作',
    'correcting missing bpmnElement on {plane} to {rootElement}': '正在将{plane}上缺少的bpmn元素更正为{rootElement}',
    'unsupported bpmnElement for {plane}: {rootElement}': '{plane}:{rootElement}的bpmn元素不受支持',
    'unrecognized flowElement {element} in context {context}': '上下文{context}中无法识别的流程元素{element}',
    'HELLO {you}!': '你好 {you}!'
};
