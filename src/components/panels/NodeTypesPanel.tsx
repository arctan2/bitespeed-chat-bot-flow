import { NodeTypes, type NodeTypeValue } from "../../types";
import "./NodeTypesPanel.css";
import MessageNodeType from "../node-types/Message";

interface NodeTypesProps {
	curNodeType: NodeTypeValue | null,
	setCurNodeType: (nodeType: NodeTypeValue) => void
}

const NodeTypesMap = {
	[NodeTypes.Message]: MessageNodeType
}

function NodeTypesPanel(props: NodeTypesProps) {
	return (
		<div className="nodes-list">
			{Object.values(NodeTypes).map((cur, key) => NodeTypesMap[cur]({
				isSelected: props.curNodeType === cur,
				setCurNodeType: props.setCurNodeType,
				key
			}))}
		</div>
	);
}

export default NodeTypesPanel;
