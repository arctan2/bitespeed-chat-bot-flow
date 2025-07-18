import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';
import { FlowNodeTypes, Sections, type FlowNodeTyped, type NodeTypeValue, type SectionsValue } from './types';
import NodeTypesPanel from './components/panels/NodeTypesPanel';
import MessagePanel from './components/panels/MessagePanel';


const initialNodes: FlowNodeTyped[] = [
	{
		id: 'n1',
		type: 'Message',
		position: { x: 0, y: 0 },
		data: { msg: "node 1" },
	},
	{
		id: 'n2',
		type: 'Message',
		position: { x: 100, y: 0 },
		data: { msg: "node 2" },
	},
];

const initialEdges: Edge[] = [];

function App() {
	const [nodes, setNodes] = useState<FlowNodeTyped[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);
	const [curSelectedNode, setCurSelectedNode] = useState<null | FlowNodeTyped>(null);
	const [curSection, setCurSection] = useState<SectionsValue>(Sections.NodeTypes);
	const [curNodeType, setCurNodeType] = useState<NodeTypeValue | null>(null);

	const onNodesChange = useCallback(
		(changes: any) => setNodes((nodesSnapshot) => {
			return applyNodeChanges(changes, nodesSnapshot);
		}), [],
	);

	const onEdgesChange = useCallback(
		(changes: any) => setEdges((edgesSnapshot) => {
			return applyEdgeChanges(changes, edgesSnapshot);
		}), [],
	);

	useEffect(() => {
		if(curSelectedNode === null) {
			setCurSection(Sections.NodeTypes);
		} else {
			setCurSection(Sections[curSelectedNode.type]);
		}
	}, [curSelectedNode])

	const onNodeClick = (_: any, node: FlowNodeTyped) => {
		const id = curSelectedNode?.id;

		setNodes((nodesSnapshot) => {
			const newNodes = nodesSnapshot.map(n => {
				if(n.id === id) {
					return { ...n, style: { } }
				}

				if(n.id === node.id) {
					return {
						...n,
						style: { outline: "2px solid purple", borderRadius: 6 }
					}
				}

				return n;
			})

			return newNodes;
		})

		setCurSelectedNode(node);
	}

	const unselectNode = () => {
		if(curSelectedNode === null) return;

		setNodes((nodesSnapshot) => {
			const id = curSelectedNode.id;
			setCurSelectedNode(null);
			return nodesSnapshot.map(n => {
				if(n.id === id) {
					return { ...n, style: { } }
				}
				return n;
			})
		})

	}
 
	const onConnect = useCallback(
		(params: any) => setEdges((edgesSnapshot) => {
			return addEdge(params, edgesSnapshot);
		}), [],
	);

	return (
		<div className="main-container">
			<div className="header">
				<button className="save-changes-btn">Save Changes</button>
			</div>

			<div className="content">
				<div className="flow-container">
					<ReactFlow
						nodes={nodes}
						edges={edges}
						nodeTypes={FlowNodeTypes}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onNodeClick={onNodeClick}
						onConnect={onConnect}
						onPaneClick={unselectNode}
						minZoom={0}
						maxZoom={1}
						fitView
					/>
				</div>

				<div className="nodes-panel">
					{(() => {
						switch(curSection) {
							case Sections.NodeTypes:
								return <NodeTypesPanel
									curNodeType={curNodeType}
									setCurNodeType={v => setCurNodeType(prev => prev === v ? null : v)} 
								/>
							case Sections.Message:
								if(curSelectedNode) return <MessagePanel
									node={curSelectedNode}
									setNodes={setNodes}
									key={curSelectedNode.id}
									unselectNode={unselectNode}
								/>;
								return <></>;
							default:
								<></>
						}
					})()}
				</div>
			</div>
		</div>
	)
}

export default App
