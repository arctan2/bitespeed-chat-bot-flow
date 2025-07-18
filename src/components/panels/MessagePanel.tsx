import type { FlowNodeTyped } from "../../types";
import "./MessagePanel.css";
import BackIcon from "../../assets/icons/back.png";

interface Props {
	node: FlowNodeTyped,
	unselectNode: () => void,
	setNodes: React.Dispatch<React.SetStateAction<FlowNodeTyped[]>>
}

function MessagePanel(props: Props) {
	const onChange = (e: any) => {
		props.setNodes(prev => {
			return prev.map(n => {
				if(props.node.id === n.id) {
					return {...n, data: { msg: e.target.value }};
				}
				return n;
			})
		});
	}

	return (
		<div className="message-panel">
			<div className="title">
				<div onClick={props.unselectNode}>
					<img src={BackIcon} />
				</div>
				<div>Message</div>
			</div>

			<div className="body">
				<div>Text</div>
				<textarea onChange={onChange} defaultValue={props.node.data.msg as string}></textarea>
			</div>
		</div>
	);
}

export default MessagePanel;
