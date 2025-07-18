import "./MessageNode.css";
import { Handle, Position } from '@xyflow/react';
import ChatIcon from "../assets/icons/chat.png";
import WhatsappIcon from "../assets/icons/WhatsApp.webp";

interface MessageNodeProps {
	id: string,
	data: {
		msg: string
	}
}

function MessageNode(props: MessageNodeProps) {
	return (
		<div className="text-message-node">
			<section className="node-title">
				<div className="icon">
					<img src={ChatIcon} />
				</div>
				<div>Send Message</div>
				<div className="icon">
					<img src={WhatsappIcon} />
				</div>
			</section>
			<p className="message-body">{props.data.msg}</p>
			<Handle type="source" position={Position.Right} />
			<Handle type="target" position={Position.Left} isConnectableStart={false} />
		</div>
	);
}

export default MessageNode;
