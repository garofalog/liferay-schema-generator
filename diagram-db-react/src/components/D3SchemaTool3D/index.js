
import React, { useRef, useCallback, useState } from "react";
import {ForceGraph3D} from 'react-force-graph';
import myschema from "../../data/my-schema-nodes.json"
import SpriteText from 'three-spritetext';
const NODE_R = 8;

export default () => {

    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    // eslint-disable-next-line no-unused-vars
    const [hoverNode, setHoverNode] = useState(null);

    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };

    const updateWidthAndHeight = () => {
        setWidth(window.innerWidth-100);
        setHeight(window.innerHeight-150);
    };

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
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
        ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
        ctx.fill();
    }, [hoverNode]);

    const fgRef = useRef();

    const handleClick = useCallback(node => {
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        fgRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
            node,
            3000
        );
    }, [fgRef]);

    React.useEffect(() => {
        ["DOMContentLoaded", "resize", "onLoad"].forEach(ev => {
            window.addEventListener(ev, updateWidthAndHeight);
        })
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fieldList = useCallback((node, ctx, globalScale) => {
        let Fieldslist = node.id.toUpperCase() + "<br>"
        node.fields.forEach((el, i) => {
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
        <div>
            <ForceGraph3D
                className="canvas3d"
                width={width}
                height={height}
                backgroundColor="#000"
                nodeRelSize={NODE_R}
                ref={fgRef}
                graphData={myschema}
                nodeLabel={fieldList}
                linkWidth={link => highlightLinks.has(link) ? 5 : 1}
                linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
                nodeCanvasObjectMode={node => highlightNodes.has(node) ? 'before' : undefined}
                onLinkHover={handleLinkHover}
                nodeCanvasObject={
                    (node, ctx, globalScale) => {
                        paintRing()
                        const label = node.id;
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        const textWidth = ctx.measureText(label).width;
                        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2)
                        ctx.fillStyle = 'rgba(217, 238, 255, 1)';
                        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = node.color;
                        ctx.fillText(label, node.x, node.y);
                    }
                }
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
            />
        </div>
    );
};
