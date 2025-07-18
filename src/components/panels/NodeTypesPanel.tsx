import { NodeTypes, NodeTypesIconMap, type NodeTypeValue } from "../../types";
import "./NodeTypesPanel.css";

interface NodeTypesProps {
	curNodeType: NodeTypeValue | null,
	setCurNodeType: (nodeType: NodeTypeValue) => void
}

function NodeTypesPanel(props: NodeTypesProps) {
	return (
		<div className="nodes-list">
			{Object.values(NodeTypes).map((cur, key) => NodeTypesIconMap[cur]({
				isSelected: props.curNodeType === cur,
				setCurNodeType: props.setCurNodeType,
				key
			}))}
		</div>
	);
}

export default NodeTypesPanel;
