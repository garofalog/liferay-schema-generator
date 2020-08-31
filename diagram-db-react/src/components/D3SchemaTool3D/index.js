
import React, { useRef, useCallback, useMemo, useState } from "react";
import {ForceGraph3D} from 'react-force-graph';
import mis from "../../data/miserables.json";
import myschema from "../../my-schema-nodes.json"
import graph from "../../db-schema.json";
import SpriteText from 'three-spritetext';


let count = 0;
const NODE_R = 8;

// const { useRef, useCallback } = React;

// class DemoWidget extends React.Component {
//     engine;

//     render() {
//         return ( 
            
//         );
//     }
// }

export default () => {
    // const data = useMemo(() => {

    //     // cross-link node objects
    //     myschema.links.forEach(link => {
    //         const a = myschema.nodes[link.source];
    //         const b = myschema.nodes[link.target];
    //         // !a.neighbors && (a.neighbors = []);
    //         // !b.neighbors && (b.neighbors = []);
    //         // a.neighbors.push(b);
    //         // b.neighbors.push(a);

    //         !a.links && (a.links = []);
    //         !b.links && (b.links = []);
    //         a.links.push(link);
    //         b.links.push(link);
    //     });

    //     return myschema;
    // }, []);

    // const highlightNodes = new Set();
    // const highlightLinks = new Set();
    // let hoverNode = null;
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [hoverNode, setHoverNode] = useState(null);

    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };

    // const handleNodeHover = node => {
    //     highlightNodes.clear();
    //     highlightLinks.clear();
    //     if (node) {
    //         highlightNodes.add(node);
    //         // node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
    //         node.links.forEach(link => highlightLinks.add(link));
    //     }

    //     setHoverNode(node || null);
    //     updateHighlight();
    // };

    const handleLinkHover = link => {
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
        }

        updateHighlight();
    };

    const paintRing = useCallback((node, ctx) => {
        // add ring just for highlighted nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
        ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
        ctx.fill();
    }, [hoverNode]);









    var style = {
        height: "500px"
    };

    const fgRef = useRef();

    const handleClick = useCallback(node => {
        // Aim at node from outside it
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        fgRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
        );
    }, [fgRef]);

    
    const fieldList = useCallback((node, ctx, globalScale) => {
        
        // const label = node.id;
        // const textWidth = ctx.measureText(label).width;
        // const fontSize = 12 / globalScale;
        // ctx.fillStyle = 'rgba(217, 238, 255, 0.4)';
        // // console.log(Array(node.fields).length)
        // var size = Object.keys(node.fields).length;
        // const bckgDimensions = [textWidth, size*fontSize+20].map(n => n + fontSize * 2); // some padding, altezza carattere + padding(2) * 150
        // // const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 2); // some padding, altezza carattere + padding(2) * 150
        // ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);


        let Fieldslist = node.id.toUpperCase() + "<br>"

        node.fields.forEach((el, i) => {
            // console.log(el.attrLongName)
            let fieldEl
            if (el.isAttrPrimary && el.isForeignKey) {
                fieldEl = "🔒 & 🔑 " + el.attrLongName
            } else if (el.isAttrPrimary && !el.isForeignKey) {
                fieldEl = "🔒&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + el.attrLongName
            } else if (!el.isAttrPrimary && el.isForeignKey) {
                fieldEl = "🔑&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + el.attrLongName
            } else {
                fieldEl = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + el.attrLongName
            }
            Fieldslist += fieldEl + "<br>"
        })
        return Fieldslist
    })

    
    return (
        <div 
            style={style} 
            className="3d-graph">
            <ForceGraph3D
                backgroundColor="#000"
                nodeRelSize={NODE_R}
                ref={fgRef}
                graphData={myschema}
                nodeLabel={fieldList}
                linkWidth={link => highlightLinks.has(link) ? 5 : 1}
                // linkDirectionalParticles={4}
                linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
                nodeCanvasObjectMode={node => highlightNodes.has(node) ? 'before' : undefined}
                // onNodeHover={handleNodeHover}
                onLinkHover={handleLinkHover}
                nodeCanvasObject={
                    (node, ctx, globalScale) => {
                        paintRing()
                        const label = node.id;
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        const textWidth = ctx.measureText(label).width;
                        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                        // label rect position
                        ctx.fillStyle = 'rgba(217, 238, 255, 1)';
                        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = node.color;
                        ctx.fillText(label, node.x, node.y);
                    }
                }
                // nodeLabel="id"
                nodeAutoColorBy="group"
                onNodeClick={handleClick}
                linkDirectionalParticleColor={() => 'cyan'}
                linkDirectionalParticles="value"
                linkDirectionalParticleSpeed={d => d.value * 0.001}
                nodeThreeObject={node => {
                    const sprite = new SpriteText(node.id);
                    sprite.color = node.color;
                    sprite.textHeight = 8;
                    sprite.fillColor = "red"         
                    return sprite;
                }}
            />;
            {/* <DemoWidget /> */}
        </div>
        
    );
};
