/* eslint-disable no-undef */
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import fs from "fs";
const dirServer = process.env.PWD

const dbschema = JSON.parse(fs.readFileSync("./../db-schema.json"))
const allIds = JSON.parse(fs.readFileSync("./allIds.json"))
const fileObjs = fs.readdirSync(`${dirServer}/models`);
const mygraph = {
    links: [],
    nodes: []
}
// let groupNum = 0
const foreignTables = []
const finalArray = allIds.map(obj => obj.key);

fileObjs.forEach((file) => {
    let correctPath = `${dirServer}/models/${file}`
    // console.log("temp",temp)
    const fileContent = fs.readFileSync(correctPath)
    const readableContent = JSON.stringify(JSON.parse(fileContent))
    const uObject = JSON.parse(readableContent.replace(/-/g, "_").replace(/\$/g, "field"));
    // console.log("namespace -> ", namespace)
    const entity = uObject.service_builder.entity

    // crea allIds.json (links) - array da confrontare per creare i link in d3
    entity.forEach(table => {
        const tableLongReference = table.field.name || false // table ref
        table.column.forEach((attr) => {

            const attrLongName = attr.field.name
            // const attrDbName = attr.field.db_name || "no-dbname"
            const isAttrPrimary = attr.field.primary
            // const isForeignKey = finalArray.includes(attrLongName) ? true : false
            if (attrLongName.indexOf("Id") > -1 && isAttrPrimary) {
                // all primary keys
                //  creo allIds -> key > primary, table > tabella
                allIds.push({
                    // attrLongName
                    key: attrLongName,
                    table: tableLongReference
                })
            }

            Object.keys(allIds).forEach(key => {
                if (allIds[key].key === attrLongName) {
                    foreignTables.push(allIds[key].table)
                }
            });

            const isForeignKey = finalArray.includes(attrLongName) ? true : false

            // Object.keys(allIds).forEach(key => {
            //     if (allIds[key].key === attrLongName) {
            //         table_sPrimary.forEach(ee => {
            //             if (ee.table === allIds[key].table) {
            //                 mygraph.links.push({
            //                     source: tableLongReference,
            //                     target: isForeignKey ? allIds[key].table : "no-tar",
            //                     value: ee.key
            //                 })
            //             }
            //         })
            //     }
            // });

        })
    })

})
// console.log("foreignTables ->", foreignTables)
// console.log("finalArray ->", finalArray) vuoto
// console.log("table_sPrimary ->", table_sPrimary); vuoto


// console.log("allids ->", allIds)
// fs.writeFileSync("./allIds.json", JSON.stringify(allIds), (err) => {
//     err ? console.log(err) : console.log("Output saved to /allIds.json");
// });
const table_sPrimary = Object.values(foreignTables.reduce((c, v) => {
    c[v] = c[v] || [v, 0];
    c[v][1]++;
    return c;
}, {})).map(o => ({
    key: o[1],
    table: o[0],
}));

console.log(table_sPrimary)


fileObjs.forEach((file) => {
    let correctPath = `${dirServer}/models/${file}`
    // console.log("temp",temp)
    const fileContent = fs.readFileSync(correctPath)
    const readableContent = JSON.stringify(JSON.parse(fileContent))
    const uObject = JSON.parse(readableContent.replace(/-/g, "_").replace(/\$/g, "field"));
    // console.log("namespace -> ", namespace)
    const entity = uObject.service_builder.entity

    // crea allIds.json (links) - array da confrontare per creare i link in d3
    entity.forEach(table => {
        const tableLongReference = table.field.name || false // table ref
        // table.column.forEach((attr) => {
                    
            Object.keys(allIds).forEach(key => {
                if (allIds[key].key === attrLongName) {
                    table_sPrimary.forEach(ee => {
                        if (ee.table === allIds[key].table) {
                            mygraph.links.push({
                                source: tableLongReference,
                                target: isForeignKey ? allIds[key].table : "no-tar",
                                value: ee.key
                            })
                        }
                    })
                }
            });

        // });
    })
})

// console.log(dbschema)
// creo nodes in mygraph
dbschema.forEach((el, index) => {
    // console.log(index)
    const tableTitle = el.tableLongReference
    // console.log("tableTitle > ", tableTitle)

    let acc = []
    el.items.forEach( f => {
        // console.log(`field name: ${attrType},\ field type: ${attrType},\ field primary: ${isAttrPrimary}`)
        // console.log(f.attrLongName)
        // aggiungo i fields in mygraph.nodes

        //mygraph.nodes[0].fields
        acc.push({
            attrLongName: f.attrLongName,
            isForeignKey: f.isAttrPrimary,
            isAttrPrimary: f.isForeignKey
        })

    })

    mygraph.nodes.push({
        group: index,
        id: tableTitle,
        fields: acc
    })
    // console.log("groupNum ", mygraph.nodes[groupNum].fields)

})

console.log("scriivo")
fs.writeFileSync(`${dirServer}/diagram-db-react/src/my-schema-nodes.json`, JSON.stringify(mygraph), (err) => {
    err ? console.log(err) : console.log("Output saved to /my-schema-nodes.json")
});