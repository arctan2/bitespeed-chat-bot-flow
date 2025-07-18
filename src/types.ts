import MessageNode from "./components/MessageNode";
import { type Node as FlowNode } from "@xyflow/react";
import MessageIcon from "./components/node-types/MessageIcon";

export const NodeTypes = {
	Message: "Message"
}

export type NodeTypeKey = keyof typeof NodeTypes;
export type NodeTypeValue = typeof NodeTypes[NodeTypeKey];

export const FlowNodeTypes = {
	Message: MessageNode,
};

export type FlowNodeTyped = FlowNode & { type: NodeTypeKey };

export const Sections = {
	NodeTypes: "NodeTypes",
	...NodeTypes
}

export type SectionsKey = keyof typeof Sections;
export type SectionsValue = typeof Sections[SectionsKey];

export const NodeTypesIconMap = {
	[NodeTypes.Message]: MessageIcon
}

