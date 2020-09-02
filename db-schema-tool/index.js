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

import fdir from "fdir"
import fs from "fs"
import rimraf from "rimraf"
import xml2js from "xml2js"
// the builder
const parser = new xml2js.Parser()
const PATH_AND_NAMES = []
const dirServer = process.env.PWD

let fol = ""

try {
    let obj = JSON.parse(fs.readFileSync('./project-path.json'))
    fol = obj[0].choices
} catch (err) { console.log(err) }

// get all files list in a directory synchronously
const files = new fdir()
    .withFullPaths()
    .crawl(fol)
    .sync()

// filter service.xml from all files array paths list - excluding META-INF/service.xml files
const PATTERN = /service\.xml$/
const SERVICES_PATHS_LIST = files
    .filter(str => PATTERN.test(str))
    .filter(nometa => nometa.indexOf("META") === -1)

const createPathList = async () => {
    SERVICES_PATHS_LIST.forEach((el) => {
        var re = new RegExp("(?<=" + fol + "/)(.*)?(?=/service.xml)")
        const tempname = el.match(re)
        PATH_AND_NAMES.push({
            filename: tempname[0].replace(/\//g, "_"),
            path: tempname.input
        })
    })
}

const clearStuff = async () => {
    try {
        rimraf(`${dirServer}/db-schema-tool/models`, () => {
            fs.mkdirSync(`${dirServer}/db-schema-tool/models`)
        })
    } catch (err) {console.error(err)}
}

const makeJson = async () => {
    try {
        // add converted json files in /models folder
        PATH_AND_NAMES.forEach((el) => {
            let jsonResult, newFilePath = ""
            fs.readFile(el.path, (err, data) => {
                if (err) throw err
                parser.parseString(data, (err, result) => {
                    if (err) throw err
                    jsonResult = JSON.stringify(result)
                    newFilePath = `${dirServer}/models/${el.filename}.json`
                    fs.writeFileSync(newFilePath, jsonResult, (err) => {
                        err ? console.log(err) : console.log("Output saved to " + newFilePath)
                    })
                })
            })
        })
    } catch (err) {
        console.error(err)
    }
}

const main = async () => {
        // var dirServerFiles = fs.readdirSync(dirServer);
        await createPathList()
        await clearStuff()
        await makeJson()
}

main()
