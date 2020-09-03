
import React, { useRef, useCallback, useState, useEffect } from "react";
import { ForceGraph2D } from 'react-force-graph';
import myschema from "./../../data/my-schema-nodes.json"

export default () => {
    const fgRef = useRef();
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    // eslint-disable-next-line no-unused-vars
    const [hoverNode, setHoverNode] = useState(null);

    useEffect(() => {
        const fg = fgRef.current;
        fg.d3Force('charge').strength(-400);
    }, []);

    const updateWidthAndHeight = () => {
        setWidth(window.innerWidth - 100);
        setHeight(window.innerHeight - 150);
    };

    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };

    const handleNodeHover = node => {
        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
            highlightNodes.add("node");
        }
        setHoverNode(node || null);
        updateHighlight();
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

    React.useEffect(() => {
        ["DOMContentLoaded", "resize", "onload"].forEach(ev => {
            window.addEventListener(ev, updateWidthAndHeight);
        })
        return () => window.removeEventListener("DOMContentLoaded", updateWidthAndHeight);
    });
    
    return (
        <div>
            <ForceGraph2D
                width={width}
                height={height}
                linkDirectionalParticleWidth={ link => highlightLinks.has(link) ? 4 : 0 }
                onNodeHover={handleNodeHover}
                onLinkHover={handleLinkHover}
                graphData={myschema}
                nodeAutoColorBy="group"
                linkDirectionalParticles="value"
                linkDirectionalParticleSpeed={d => d.value * 0.001}
                nodeCanvasObject = {
                    (node, ctx, globalScale) => {
                        const label = node.id;
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        const textWidth = ctx.measureText(label).width;
                        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
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
            />
        </div>
    );
};
