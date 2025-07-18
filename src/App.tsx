import { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, type Edge, useReactFlow, MarkerType, type OnConnectStartParams } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';
import { FlowNodeTypes, NodeTypesIconMap, Sections, type FlowNodeTyped, type NodeTypeValue, type SectionsValue } from './types';
import NodeTypesPanel from './components/panels/NodeTypesPanel';
import MessagePanel from './components/panels/MessagePanel';

const initialNodes: FlowNodeTyped[] = [];

const initialEdges: Edge[] = [];

function App() {
	const [nodes, setNodes] = useState<FlowNodeTyped[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);
	const [curSelectedNode, setCurSelectedNode] = useState<null | FlowNodeTyped>(null);
	const [curSection, setCurSection] = useState<SectionsValue>(Sections.NodeTypes);
	const [curNodeType, setCurNodeType] = useState<NodeTypeValue | null>(null);
	const { screenToFlowPosition } = useReactFlow();
	const iconRef = useRef<HTMLDivElement | null>(null);
	const [showError, setShowError] = useState<boolean>(false);

	const [cursor, setCursor] = useState({ x: 0, y: 0 });

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
		if (curSelectedNode === null) {
			setCurSection(Sections.NodeTypes);
		} else {
			setCurSection(Sections[curSelectedNode.type]);
		}
	}, [curSelectedNode])

	useEffect(() => {
		const updateMouse = (e: MouseEvent) => {
			setCursor({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener('mousemove', updateMouse);
		return () => window.removeEventListener('mousemove', updateMouse);
	}, []);

	const onNodeClick = (e: any, node: FlowNodeTyped) => {
		if (curNodeType !== null) {
			onContentClick(e);
			return;
		}

		const id = curSelectedNode?.id;

		setNodes((nodesSnapshot) => {
			const newNodes = nodesSnapshot.map(n => {
				if (n.id === id) {
					return { ...n, style: {} }
				}

				if (n.id === node.id) {
					return {
						...n,
						style: { outline: "2px solid #7a66b6", borderRadius: 6 }
					}
				}

				return n;
			})

			return newNodes;
		})

		setCurSelectedNode(node);
	}

	const unselectNode = () => {
		if (curSelectedNode === null) return;

		setNodes((nodesSnapshot) => {
			const id = curSelectedNode.id;
			setCurSelectedNode(null);
			return nodesSnapshot.map(n => {
				if (n.id === id) {
					return { ...n, style: {} }
				}
				return n;
			})
		})
	}

	const onPaneClick = (e: any) => {
		if (curNodeType !== null) {
			onContentClick(e);
			return;
		}
		unselectNode();
	}

	const onContentClick = (e: any) => {
		if (curNodeType === null) return;

		const iconDiv = iconRef.current;
		if (iconDiv === null) return;

		const { width, height } = getComputedStyle(iconDiv);

		const canvasPosition = screenToFlowPosition({
			x: e.clientX - Number(width.slice(0, -2)) / 2,
			y: e.clientY - Number(height.slice(0, -2)) / 2
		});

		setNodes((prev) => [
			...prev,
			{
				id: crypto.randomUUID(),
				type: 'Message',
				position: canvasPosition,
				data: { msg: "New message" },
			},
		]);

		setCurNodeType(null);
	}

	const onConnect = (params: any) => {
		const id = `edge-${params.source}`;

		const customEdge = {
			...params,
			id: `${id}|${params.target}`,
		};

		setEdges((edgesSnapshot) => {
			return [...edgesSnapshot, customEdge];
		})
	}

	const onConnectStart = (_: any, node: OnConnectStartParams) => {
		if (node.handleType === "target") return;

		const id = `edge-${node.nodeId}`;
		const out = edges.find(e => e.id.startsWith(id));

		if (out) {
			setEdges(edges.filter(n => n !== out));
		}
	}

	const onSaveChanges = () => {
		setShowError(false);

		if (nodes.length === 0) return;

		const graph = new Map();

		nodes.forEach((node) => graph.set(node.id, []));
		edges.forEach(({ source, target }) => {
			graph.get(source)?.push(target);
			graph.get(target)?.push(source);
		});

		const visited = new Set();
		const forests = [];

		for (const node of nodes) {
			if(visited.has(node.id)) continue;

			const queue = [node.id];
			const forest = [];

			while (queue.length > 0) {
				const curr = queue.shift();
				if (!visited.has(curr)) {
					visited.add(curr);
					forest.push(curr);
					for (const neighbor of graph.get(curr) || []) {
						if (!visited.has(neighbor)) queue.push(neighbor);
					}
				}
			}

			forests.push(forest);
		}

		if (forests.length > 1) {
			setShowError(true);
		} else {
			alert("Flow saved successfully!");
		}
	}

	return (
		<div className="main-container">
			<div className="header">
				{showError ? <div className='cannot-save-flow'>Cannot save flow</div> : ""}
				<button className="save-changes-btn" onClick={onSaveChanges}>Save Changes</button>
			</div>

			<div className="content">
				<div className="flow-container">

					{curNodeType && (
						<div
							ref={iconRef}
							style={{
								position: 'fixed',
								left: cursor.x,
								top: cursor.y,
								pointerEvents: 'none',
								transform: "translate(-50%, -50%)",
								width: "max-content",
								height: "max-content"
							}}
						>
							{NodeTypesIconMap[curNodeType]({ isSelected: false } as any)}
						</div>
					)}

					<ReactFlow
						nodes={nodes}
						edges={edges}
						nodeTypes={FlowNodeTypes}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onNodeClick={onNodeClick}
						onConnect={onConnect}
						onConnectStart={onConnectStart}
						onPaneClick={onPaneClick}
						minZoom={0}
						maxZoom={1}
						fitView
						defaultEdgeOptions={{
							style: {
								stroke: '#888888',
								strokeWidth: 2,
							},
							markerEnd: {
								type: MarkerType.Arrow,
								width: 20,
								height: 20,
								color: '#888888',
							},
						}}
					/>
				</div>

				<div className="nodes-panel">
					{(() => {
						switch (curSection) {
							case Sections.NodeTypes:
								return <NodeTypesPanel
									curNodeType={curNodeType}
									setCurNodeType={v => setCurNodeType(prev => prev === v ? null : v)}
								/>
							case Sections.Message:
								if (curSelectedNode) return <MessagePanel
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
