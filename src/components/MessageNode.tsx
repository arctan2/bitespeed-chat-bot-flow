import "./MessageNode.css";
import { Handle, Position } from '@xyflow/react';

interface MessageNodeProps {
	data: { 
		msg: string
	}
}

function MessageNode(props: MessageNodeProps) {
	return (
		<div className="text-message-node">
			<section>Send Message</section>
			<p className="message-body">{ props.data.msg }</p>
			<Handle type="source" position={Position.Left} />
			<Handle type="target" position={Position.Right} />
		</div>
	);
}

export default MessageNode;
