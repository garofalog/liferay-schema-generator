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

// import  fdir from "fdir";
import fs from "fs"
const dirServer = process.env.PWD
const fileObjs = fs.readdirSync(`${dirServer}/models`)
const allData = []
const allIds = []
const foreignTables = []
let mygraph = {
    links: [],
    nodes: []
}

fileObjs.forEach((file) => {
    let correctPath = `${dirServer}/models/${file}`
    let fileContent = fs.readFileSync(correctPath)
    let readableContent = JSON.stringify(JSON.parse(fileContent))
    let uObject = JSON.parse(readableContent.replace(/-/g, "_").replace(/\$/g, "field"))
    let entity = uObject.service_builder.entity

    entity.forEach(table => {
        const tableLongReference = table.field.name || false // table ref
        table.column.forEach((attr) => {
            let attrLongName = attr.field.name
            let isAttrPrimary = attr.field.primary
            if (attrLongName.indexOf("Id") > -1 && isAttrPrimary) {
                allIds.push({
                    key: attrLongName,
                    table: tableLongReference
                })
            }
            Object.keys(allIds).forEach(key => {
                if (allIds[key].key === attrLongName) {
                    foreignTables.push(allIds[key].table)
                }
            })
        })
    })
})

fs.writeFileSync("./allIds.json", JSON.stringify(allIds), (err) => {
    err ? console.log(err) : console.log("Output saved to /allIds.json")
})

const finalArray = allIds.map( obj => obj.key)
const result = Object.values(foreignTables.reduce((c, v) => {
    c[v] = c[v] || [v, 0]
    c[v][1]++
    return c
}, {})).map(o => ({
    key: o[1],
    table: o[0],
}))

fileObjs.forEach((file) => {
    let correctPath = `${dirServer}/models/${file}`
    const fileContent = JSON.parse(fs.readFileSync(correctPath))
    const readableContent = JSON.stringify(fileContent)
    const uObject = readableContent.replace(/-/g, "_").replace(/\$/g, "field")
    const entity = JSON.parse(uObject).service_builder.entity
    entity.forEach(table => {
        const tableLongReference = table.field.name || false // table ref
        table.column.forEach((attr) => {
            const attrLongName = attr.field.name
            const isForeignKey = finalArray.includes(attrLongName) ? true : false
            let tar
            Object.keys(allIds).forEach(key => {
                if (allIds[key].key === attrLongName) {
                    tar = allIds[key].table
                    result.forEach(ee => {
                        if (ee.table === tar) {
                            mygraph.links.push({
                                source: tableLongReference,
                                target: isForeignKey ? tar : "no-tar",
                                value: ee.key                                    
                            })
                        }
                    })
                }
            })
        })
    })
})

fileObjs.forEach((file) => {
    let correctPath = `${dirServer}/models/${file}`
    let fileContent = JSON.parse(fs.readFileSync(correctPath))
    let readableContent = JSON.stringify(fileContent)
    let uObject = readableContent.replace(/-/g, "_").replace(/\$/g, "field")
    let entity = JSON.parse(uObject).service_builder.entity    
    entity.forEach(table => {
        let tableReference = table.field.table || false // table ref
        let tableLongReference = table.field.name || false // table ref        
        let node = {
            items: [],
            tableLongReference,
            tableReference
        }
        table.column.forEach( attr => {
            let attrType = attr.field.type || "no-type" // type
            let attrLongName = attr.field.name
            let attrDbName = attr.field.db_name || "no-dbname"
            let isAttrPrimary = attr.field.primary ? true : false
            let isForeignKey = finalArray.includes(attrLongName) ? true : false
            node.items.push({
                attrDbName,
                attrLongName,
                attrType,
                isAttrPrimary,
                isForeignKey,
                tableReference: tableReference || "none"
            })
        })
        allData.push(node)
    })
})

fs.writeFileSync(`${dirServer}/diagram-db-react/src/data/db-schema.json`, JSON.stringify(allData), (err) => {
    err ? console.log(err) : console.log("Output saved to /db-schema.json")
})

const dbschema = JSON.parse(fs.readFileSync(`${dirServer}/diagram-db-react/src/data/db-schema.json`))

dbschema.forEach((el, index) => {
    const tableTitle = el.tableLongReference
    let acc = []
    el.items.forEach(f => {
        acc.push({
            attrLongName: f.attrLongName,
            isForeignKey: f.isForeignKey,
            isAttrPrimary: f.isAttrPrimary
        })
    })
    mygraph.nodes.push({
        group: index,
        id: tableTitle,
        fields: acc
    })
})

fs.writeFileSync(`${dirServer}/diagram-db-react/src/data/my-schema-nodes.json`, JSON.stringify(mygraph), (err) => {
    err ? console.log(err) : console.log("Output saved to /my-schema-nodes.json")
})
