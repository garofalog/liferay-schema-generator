import React, { useState } from "react";
import "./App.css";
import D3DbSchemaTool from "./components/D3SchemaTool"
import D3DbSchemaTool3D from "./components/D3SchemaTool3D"

const Tabs = (props) => {
    const [selected, setSelected] = useState(props.selected || 0);
    
    const handleChange = (index) => {
        setSelected(index);
    }

    return (
        <div>
            <ul className="inline">
                {
                    props.children.map((item, index) => {
                        let style = index === selected ? ' selected' : '';
                        return <li
                            className={style}
                            key={index}
                            onClick={() => handleChange(index)}>
                            {item.props.title}
                        </li>;
                    })
                }
            </ul>
            <div className="tab">{props.children[selected]}</div>
        </div>
    )
}

const Panel = (props) => {
    return <div className="panel">{props.children}</div>
}

function App() {
    return (

        <Tabs selected={0}>
            <Panel title="3D Schema">
                <D3DbSchemaTool3D />
            </Panel>
            <Panel title="2D Schema">
                <D3DbSchemaTool />
            </Panel>
        </Tabs>

    );
}

export default App;
