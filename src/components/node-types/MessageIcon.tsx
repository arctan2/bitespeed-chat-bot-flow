import { NodeTypes, type NodeTypeValue } from "../../types";
import "./common.css";

export default function(props: { isSelected: boolean, key: number, setCurNodeType: (v: NodeTypeValue) => void }) {
	return <div 
		key={props.key}
		className={["node-type-icon", props.isSelected ? "selected-node" : ""].join(" ")}
		onClick={() => props.setCurNodeType(NodeTypes.Message)}
	>
		Message
	</div>
}
