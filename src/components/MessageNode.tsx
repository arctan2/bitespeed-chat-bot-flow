import "./MessageNode.css";
import { Handle, Position } from '@xyflow/react';

interface MessageNodeProps {
	id: string,
	data: { 
		msg: string
	}
}

function MessageNode(props: MessageNodeProps) {
	return (
		<div className="text-message-node">
			<section>Send Message</section>
			<p className="message-body">{ props.data.msg }</p>
			<Handle type="source" position={Position.Right} />
			<Handle type="target" position={Position.Left} />
		</div>
	);
}

export default MessageNode;
