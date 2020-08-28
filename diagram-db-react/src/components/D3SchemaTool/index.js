
import React, { useRef, useCallback, useMemo, useState } from "react";
import { ForceGraph2D } from 'react-force-graph';// import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import mis from "../../data/miserables.json";
import myschema from "./../../my-schema-nodes.json"
import graph from "../../db-schema.json";

let count = 0;
const NODE_R = 8;

// const { useRef, useCallback } = React;

class DemoWidget extends React.Component {
    engine;

    render() {
        return ( 
            <p>ciaociao</p>
        );
    }
}

export default () => {
    const fgRef = useRef();

    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [hoverNode, setHoverNode] = useState(null);

    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };

    const handleNodeHover = node => {
        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
            highlightNodes.add(node);
            // node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
            // node.links.forEach(link => highlightLinks.add(link));
        }

        setHoverNode(node || null);
        updateHighlight();
    };

    const onNodeDragEnd = node => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
    }

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

    const paintRing = useCallback((node, ctx, globalScale) => {

        // add ring just for highlighted nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_R * 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = node === hoverNode ? 'blue' : 'orange';
        ctx.fill();

        // labels on hover
        const label = node.id;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = node.color;
        ctx.fillText(label, node.x, node.y);

    }, [hoverNode]);

    
    


    //! 1) setup the diagram engine
    var style = {
        height: 500
    };
    
    return (
        <div style={style}>
            <ForceGraph2D
                // nodeRelSize={NODE_R}
                linkWidth={ link => highlightLinks.has(link) ? 5 : 1 }
                // linkDirectionalParticles={4}
                // linkDirectionalParticleWidth={ link => highlightLinks.has(link) ? 4 : 0 }
                // nodeCanvasObjectMode={ node => highlightNodes.has(node) ? 'before' : undefined }
                // onNodeHover={handleNodeHover}
                // onLinkHover={handleLinkHover}
                // graphData={mis}
                graphData={myschema}
                nodeAutoColorBy="group"
                linkDirectionalParticles = "value"
                linkDirectionalParticleSpeed = {
                    d => d.value * 0.001
                }
                nodeCanvasObject = {
                    (node, ctx, globalScale) => {

                        const label = node.id;
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        // console.log(node)
                        const textWidth = 180 // ctx.measureText(label).width;
                        // diventerà altezza carattere * n attributi

                        ctx.fillStyle = 'rgba(217, 238, 255, 0.4)';
                        // console.log(Array(node.fields).length)
                        var size = Object.keys(node.fields).length;
                        const bckgDimensions = [textWidth, size*fontSize+20].map(n => n + fontSize * 2); // some padding, altezza carattere + padding(2) * 150
                        // const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 2); // some padding, altezza carattere + padding(2) * 150


                        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 + 80, ...bckgDimensions);

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = node.color;
                        ctx.fillText(label, node.x, node.y);

                        let fields = node.fields
                        fields.forEach((el, i) => {
                            
                            // ctx.fillRect(node.x - bckgDimensions[0] / 2 + 100, node.y - bckgDimensions[1] / 2 + fontSize * i + 40, ...bckgDimensions);

                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            let attrWidthPosition = node.x - bckgDimensions[0] / 2 + 100
                            let attrHeightPosition = node.y - bckgDimensions[1] / 2 + fontSize * i + 110

                            // ctx.fillStyle =  node.color;
                            if (el.isAttrPrimary && el.isForeignKey) {
                                ctx.fillText("🔒 & 🔑" + el.attrLongName, attrWidthPosition, attrHeightPosition)
                            } else if (el.isAttrPrimary && !el.isForeignKey) {
                                ctx.fillText("🔒" + el.attrLongName, attrWidthPosition, attrHeightPosition)
                            } else if (!el.isAttrPrimary && el.isForeignKey) {
                                ctx.fillText("🔑" + el.attrLongName, attrWidthPosition, attrHeightPosition)
                            } else {
                                ctx.fillText(el.attrLongName, attrWidthPosition, attrHeightPosition)
                            }
                            // console.log(el.attrLongName)

                        })
                    }
                }

                // nodeCanvasObject={paintRing}

                // nodeCanvasObject = {
                //     (node, ctx, globalScale) => {
                //         const label = node.id;
                //         const fontSize = 12 / globalScale;
                //         ctx.font = `${fontSize}px Sans-Serif`;
                //         const textWidth = ctx.measureText(label).width;
                //         const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                //         ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                //         ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                //         ctx.textAlign = 'center';
                //         ctx.textBaseline = 'middle';
                //         ctx.fillStyle = node.color;
                //         ctx.fillText(label, node.x, node.y);
                //     }
                // }

                nodeLabel="id"
                onNodeDragEnd = {
                    node => {
                        node.fx = node.x;
                        node.fy = node.y;
                        node.fz = node.z;
                    }
                }
                ref={fgRef}
                cooldownTicks={100}
                // onEngineStop={ () => fgRef.current.zoomToFit(400) }
                // onNodeClick={handleClick}
                />
            <DemoWidget />
        </div>
        
    );
};
