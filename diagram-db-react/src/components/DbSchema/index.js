import createEngine, {
    DiagramModel,
    DagreEngine,
    PathFindingLinkFactory,
    DefaultPortModel,
    DefaultLinkModel
} from "@projectstorm/react-diagrams";
import * as React from "react";
import {
    DemoButton,
    DemoWorkspaceWidget
} from "../DemoWorkspaceWidget";
import {
    CanvasWidget
} from "@projectstorm/react-canvas-core";
import {
    DemoCanvasWidget
} from "../DemoCanvasWidget";
import createNode from "../../utils/createNode";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import connectNodes from "../../utils/connectNodes";
// import graph from "../../data/miserables.json";
import graph from "../../db-schema.json";

let count = 0;

/**
 * Tests auto distribution
 */
class DemoWidget extends React.Component {
    engine;

    constructor(props) {
        super(props);
        this.engine = new DagreEngine({
            graph: {
                rankdir: "RL",
                ranker: "longest-path"
            },
            includeLinks: true
        });
    }

    autoLayout = () => {
        this.engine.redistribute(this.props.model);

        // only happens if pathfinding is enabled (check line 25)
        this.reroute();
        this.props.engine.repaintCanvas();
    };

    componentDidMount() {
        setTimeout(() => {
            this.autoLayout();
        }, 500);
    }

    reroute() {
        this.props.engine
            .getLinkFactories()
            .getFactory(PathFindingLinkFactory.NAME)
            .calculateRoutingMatrix();
    }

    render() {
        return ( 
            <DemoWorkspaceWidget buttons = {
                <DemoButton onClick={this.autoLayout}>
                    Re-layout
                </DemoButton>}>
                <DemoWorkspaceWidget buttons={
                    <DemoButton onClick={() => this.props.engine.zoomToFitNodes(50)}>
                        Zoom to fit
                    </DemoButton>}>
                </DemoWorkspaceWidget>
                <DemoCanvasWidget>
                    <CanvasWidget engine={this.props.engine}/>
                </DemoCanvasWidget>
            </DemoWorkspaceWidget>
        );
    }
}

export default () => {
    //! 1) setup the diagram engine
    let engine = createEngine();

    //! 2) setup the diagram model
    let model = new DiagramModel();

    //! 3) create a default nodes
    const link = new DefaultLinkModel();

    // create an array to hold
    // react-diagram's representation of the nodes
    const nodes = [];
    const nodesHash = {};
    let reactDiagramNode;

    // console.log(graph)
    Array.from(graph).forEach(node => {
        console.log(node.tableName)
        reactDiagramNode = createNode(node.tableLongReference);

        node.items.forEach(item => {
            // console.log(item)
            
            if (item.isAttrPrimary && !item.isForeignKey) {
                reactDiagramNode.addOutPort("🔐 " + item.attrLongName)
            } else if (!item.isattrPrimary && item.isForeignKey) {
                reactDiagramNode.addInPort("🔑 " + item.attrLongName)
            } else {
                reactDiagramNode.addInPort(item.attrLongName)
            }
        })

        nodes.push(reactDiagramNode);
        nodesHash[node.tableName] = reactDiagramNode;
    });
    console.log("nodes -> ",nodes)
    console.log("***********************************")
    console.log("nodesHash -> ",nodesHash)

    //  per i link
    // Array.from(graph).forEach(node => {

    //     node.items.forEach(item => {

    //         if (item.isAttrPrimary && !item.isForeignKey) {
    //             item.link(item.attrLongName)
    //         } else if (!item.isattrPrimary && item.isForeignKey) {
    //             reactDiagramNode.addInPort(item.attrLongName)
    //         } else {
    //             reactDiagramNode.addOutPort(item.attrLongName)
    //         }
    //     })

    //     nodes.push(reactDiagramNode);
    //     nodesHash[node.tableName] = reactDiagramNode;
    // });

    //! 4) link nodes together
    // create an array to hold
    // react-diagram's represenation of the links




    // const links = [];

    // let reactDiagramLink;
    // graph.links.forEach((link, i) => {
    //     const sourceKey = "source";
    //     const targetKey = "target";
    //     const sourceNode = nodesHash[link[sourceKey]];
    //     const targetNode = nodesHash[link[targetKey]];
    //     reactDiagramLink = connectNodes({
    //         sourceNode,
    //         targetNode,
    //         engine,
    //         count: count++,
    //         pathFinding: false
    //     });
    //     links.push(reactDiagramLink);
    // });

    nodes.forEach((node, i) => {
        node.setPosition(i * 140, i * 70);
        model.addNode(node);
    });

    // links.forEach(link => {
    //     model.addLink(link);
    // });

    engine.setModel(model);




    return (<DemoWidget 
        model={model}
        engine={engine}/>);
};
