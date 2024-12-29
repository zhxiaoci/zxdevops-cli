const program = require("commander")
const chalk = require("chalk")
const figlet = require("figlet")
const readline = require('readline');

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process')


program.name("zxdevops-cli").usage(`<command>[option]`).version(`1.0.0`)

program
    .command("create <name>")
    .description("创建项目")
    .option("-f, --force", "覆盖已存在的文件")
    .action(projectName => {
        main(projectName)
    }
)

async function main(projectName) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    console.log(chalk.green.underline.bold("The project has been initialized") + '(Subsequent commands do not require entering the project name again)')
    rl.question('Enter the framework installation command:\n', (command) => {
    
        const child = spawn(`${command} ${projectName}`, { stdio: 'inherit', shell: true })
        child.on('error', (error) => {
            console.error(`Error installing the project: ${error.message}`);
            process.exit(1);
        });
        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`)

            if (code === 0) {
                console.log(`Project installation completed ${chalk.green.bold('successfully')}.`);
                const githubDir = path.join(process.cwd(), projectName, '.github', 'workflow');
                fs.mkdirSync(githubDir, { recursive: true });
                fs.cpSync(path.join(__dirname, 'workflow'), githubDir, { recursive: true })
                console.log(figlet.textSync("devops-zxd", {
                    font: "Ghost",
                    horizontalLayout: "default",
                    verticalLayout: "default",
                    width: 80,
                    whitespaceBreak: true
                }))
                console.log(`.github/workflow.yml has been created ${chalk.green.bold('successfully')}.`);
            } else {
                console.error(`Project installation failed with exit code ${code}`);
            }
    
            process.exit(code);
        });
    })
}

program.parse(process.argv)
