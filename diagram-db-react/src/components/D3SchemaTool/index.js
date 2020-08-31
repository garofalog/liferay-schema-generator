
import React, { useRef, useCallback, useMemo, useState, useEffect } from "react";
import { ForceGraph2D } from 'react-force-graph';// import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import mis from "../../data/miserables.json";
import myschema from "./../../my-schema-nodes.json"
import graph from "../../db-schema.json";

let count = 0;
const NODE_R = 8;
// const [graphData, setGraphData] = useState({
//     nodes: [],
//     links: []
// });


// const { useRef, useCallback } = React;

// class DemoWidget extends React.Component {
//     engine;

//     render() {
//         return ( 
//             <p>ciaociao</p>
//         );
//     }
// }

export default () => {
    const fgRef = useRef();
    useEffect(() => {
        const fg = fgRef.current;

        // Deactivate existing forces
        // fg.d3Force('center', null);
        // fg.d3Force('charge', null);
        fg.d3Force('charge').strength(-420);

        // Add collision and bounding box forces
        // fg.d3Force('collide', d3.forceCollide(4));
        fg.d3Force('box', () => {
            const SQUARE_HALF_SIDE = N * 2;

            nodes.forEach(node => {
                const x = node.x || 0,
                    y = node.y || 0;

                // bounce on box walls
                if (Math.abs(x) > SQUARE_HALF_SIDE) {
                    node.vx *= -1;
                }
                if (Math.abs(y) > SQUARE_HALF_SIDE) {
                    node.vy *= -1;
                }
            });
        });

        // Generate nodes
        const N = 80;
        const nodes = [...Array(N).keys()].map(() => ({
            // Initial velocity in random direction
            vx: (Math.random() * 2) - 1,
            vy: (Math.random() * 2) - 1
        }));

        // setGraphData({
        //     nodes,
        //     links: []
        // });
    }, []);

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
            highlightNodes.add("node");
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
    
    const invertHex = (hex) => (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()

    // invertHex('00FF00'); // Returns FF00FF


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
        // label color
        ctx.fillStyle = 'rgba(217, 238, 255, 0.4)';
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // let oppositecolor = invertColor(node.__invertColor)
        // ctx.fillStyle = node.color;
        ctx.fillText(label, node.x, node.y);

    }, [hoverNode]);

    const fieldList = useCallback((node, ctx, globalScale) => {
        let Fieldslist = ''

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

    
    


    //! 1) setup the diagram engine
    var style = {
        height: "500px"
    };
    
    return (
        <div style={style}>
            <ForceGraph2D
                // nodeRelSize={NODE_R}
                linkWidth={ link => highlightLinks.has(link) ? 10 : 1 }
                // linkDirectionalParticles={4}
                linkDirectionalParticleWidth={ link => highlightLinks.has(link) ? 4 : 0 }
                // nodeCanvasObjectMode={ node => highlightNodes.has(node) ? 'before' : undefined }
                // onNodeHover={handleNodeHover}
                // onLinkHover={handleLinkHover}
                graphData={myschema}
                nodeAutoColorBy="group"
                linkDirectionalParticles = "value"
                linkDirectionalParticleSpeed = {
                    d => d.value * 0.001
                }
                // nodeCanvasObject = {
                //     (node, ctx, globalScale) => {

                //         const label = node.id;
                //         const fontSize = 12 / globalScale;
                //         ctx.font = `${fontSize}px Sans-Serif`;
                //         // console.log(node)
                //         const textWidth = ctx.measureText(label).width;
                //         // diventerà altezza carattere * n attributi

                //         ctx.fillStyle = 'rgba(217, 238, 255, 0.4)';
                //         // console.log(Array(node.fields).length)
                //         var size = Object.keys(node.fields).length;
                //         const bckgDimensions = [textWidth, size*fontSize+20].map(n => n + fontSize * 2); // some padding, altezza carattere + padding(2) * 150
                //         const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 2); // some padding, altezza carattere + padding(2) * 150

                //         ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                //         ctx.textAlign = 'center';
                //         ctx.textBaseline = 'middle';
                //         ctx.fillStyle = node.color;
                //         ctx.fillText(label, node.x, node.y);

                        // node.fields.forEach((el, i) => {
                        //     ctx.textAlign = 'center';
                        //     ctx.textBaseline = 'middle';
                        //     let attrWidthPosition = node.x - bckgDimensions[0] / 2 + 100
                        //     let attrHeightPosition = node.y - bckgDimensions[1] / 2 + fontSize * i + 110
                        //     // ctx.fillStyle =  node.color;
                        //     if (el.isAttrPrimary && el.isForeignKey) {
                        //         ctx.fillText("🔒 & 🔑" + el.attrLongName, attrWidthPosition, attrHeightPosition)
                        //     } else if (el.isAttrPrimary && !el.isForeignKey) {
                        //         ctx.fillText("🔒" + el.attrLongName, attrWidthPosition, attrHeightPosition)
                        //     } else if (!el.isAttrPrimary && el.isForeignKey) {
                        //         ctx.fillText("🔑" + el.attrLongName, attrWidthPosition, attrHeightPosition)
                        //     } else {
                        //         ctx.fillText(el.attrLongName, attrWidthPosition, attrHeightPosition)
                        //     }
                        // })
                //     }
                // }

                // nodeCanvasObject={paintRing}

                nodeCanvasObject = {
                    // 
                    (node, ctx, globalScale) => {
                        const label = node.id;
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        const textWidth = ctx.measureText(label).width;
                        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                        // label rect position
                        ctx.fillStyle = 'rgba(217, 238, 255, 0.4)';
                        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = node.color;
                        ctx.fillText(label, node.x, node.y);
                    }
                }

                nodeLabel={fieldList}
                onNodeDragEnd = {
                    node => {
                        node.fx = node.x;
                        node.fy = node.y;
                        node.fz = node.z;
                    }
                }
                ref={fgRef}
                // cooldownTicks={100}
                // onEngineStop={ () => fgRef.current.zoomToFit(4000) }
                // onNodeClick={handleClick}
                />
            {/* <DemoWidget /> */}
        </div>
        
    );
};
