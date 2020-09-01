
import React, { useRef, useCallback, useState, useEffect } from "react";
import { ForceGraph2D } from 'react-force-graph';
import myschema from "./../../my-schema-nodes.json"

export default () => {
    const fgRef = useRef();
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    // eslint-disable-next-line no-unused-vars
    const [hoverNode, setHoverNode] = useState(null);

    useEffect(() => {
        const fg = fgRef.current;
        fg.d3Force('charge').strength(-1400);
    }, []);

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
        let Fieldslist = ''
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
            <ForceGraph2D
                linkWidth={ link => highlightLinks.has(link) ? 10 : 1 }
                linkDirectionalParticleWidth={ link => highlightLinks.has(link) ? 4 : 0 }
                nodeCanvasObjectMode={ node => highlightNodes.has(node) ? 'before' : undefined }
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
                        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
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
            />
        </div>
    );
};
