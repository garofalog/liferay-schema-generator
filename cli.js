import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import fs from 'fs';
import {
    exec
} from 'child_process';

const diagramPath = []

console.log(
    chalk.cyan(
        figlet.textSync("Welcome from", { 
            horizontalLayout: "full",
            font: "Thin",
            width: 80
        })
    )
);
console.log(
    chalk.blue(
        figlet.textSync("Liferay", {
            horizontalLayout: "full",
            font: "Larry 3D 2"
        })
    )
);

const questionaire = async () => {
    let folder = ''
    await inquirer.prompt({
        type: 'input',
        name: 'liferay_folder_path',
        message: "Insert Liferay Portal's folder absolute path",
    }).then( answers => {   
        console.log(answers)
        folder = answers.liferay_folder_path.match(/\/$/g) === null ? answers.liferay_folder_path : answers.liferay_folder_path.slice(0, -1)
    });
    const sec = await inquirer.prompt({
        type: 'expand',
        name: 'choices',
        message: 'Which path you want to start from to generate your diagram?',
        choices: [{
                key: 'c',
                name: 'Our Commerce',
                value: folder + '/modules/apps/commerce',
            },
            {
                key: 'o',
                name: 'OPEN',
                value: folder + '/modules/apps',
            },
            {
                key: 'd',
                name: 'DXP',
                value: folder + '/modules/xdp/apps',
            },
        ],
    }).then(answ2 => {
        diagramPath.push(answ2)
        return answ2
    })
}

const main = async () => {
    await questionaire().then(answ => {
        fs.writeFile("./project-path.json", JSON.stringify(diagramPath), (err) => {
            err ? console.log(err) : console.log("Output saved to /project-path.json")
        })

    })
    await exec('node db-schema-tool/index.js', (error, stdout, stderr) => {
        if (stdout) {
            console.log(`stdout: ${stdout}`)
        } else if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        if (error !== null) {
            console.log(`callIndex exec error: ${error}`);
        }
    });
    await exec('node db-schema-tool/model.js', (error, stdout, stderr) => {
        if (stdout) {
            console.log(`stdout: ${stdout}`)
        } else if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        if (error !== null) {
            console.log(`createModel exec error: ${error}`);
        }
    });
}
main();
