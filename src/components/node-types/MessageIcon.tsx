import { NodeTypes, type NodeTypeValue } from "../../types";
import ChatIcon from "../../assets/icons/chat.png";
import "./common.css";

export default function(props: { isSelected: boolean, key: number, setCurNodeType: (v: NodeTypeValue) => void }) {
	return <div 
		key={props.key}
		className={["node-type-icon", props.isSelected ? "selected-node" : ""].join(" ")}
		onClick={() => props.setCurNodeType(NodeTypes.Message)}
	>
		<div className="icon">
			<img src={ChatIcon} />
		</div>
		<div>Message</div>
	</div>
}
