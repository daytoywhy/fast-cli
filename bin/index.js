#!/usr/bin/env node

const { program } = require('commander')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const path = require('path')
const gitClone = require('git-clone')
const ora = require('ora')
const chalk = require('chalk')
//首行提示
program.name('fast-cli').usage('<command> [options]')

//版本号
program.version(`V${require('../package.json').version}`)

const projectList = {
  'vue': 'git@github.com:daytoywhy/vue-music-next.git',
  'react': 'git@github.com:daytoywhy/cxx-react.git',
  'vue&ts': 'git@github.com:daytoywhy/vue-music-next.git',
  'react&ts':  'git@github.com:daytoywhy/cxx-react.git'
}
//命令
//创建项目的命令
program.command('create <app-name>')
.description('创建一个新的项目')
.action(async function(name){
  //创建项目的逻辑
  //创建一个名为name的文件夹，把模板代码都放到这个目录底下
  //1、判断是否已经有重名的目录,process.cwd()拿到当前目录路径
  const targetPath = path.join(process.cwd(), name)
  if(fs.existsSync(targetPath)){
    //存在重名目录
   const awsaner = await inquirer.prompt([
      {
        type:'confirm',
        message:'是否覆盖之前的文件夹',
        default:false,
        name:'isCover'
      }
    ])
    if(awsaner.isCover){
      fs.remove(targetPath)
    } else {
      return
    }
  } 
  //2、新建
 const awsaner2 = await inquirer.prompt([
    {
      type:'list',
      message: '选择什么框架创建项目',
      name: 'type',
      choices:[
        {
          name:'vue',
          value:'vue'
        },
        {
          name: 'react',
          value:'react'
        }
      ]
    },
    {
      type:'list',
      message: '是否要用TS？',
      name: 'ts',
      choices:[
        {
          name:'是',
          value:true
        },
        {
          name: '否',
          value:false
        }
      ]
    }
  ])
  const key = awsaner2.type + (awsaner2.ts ? '&ts' : '')
  const spinning = ora('正在下载模板...').start( )
  gitClone(projectList[key], name,{checkout: 'main'},function(err){
    if(err){
      spinning.fail('下载失败')
    }else{
      spinning.succeed('下载成功')
      fs.remove(path.join(targetPath,'.git'))
      console.log('Done, now run:');
      console.log(chalk.green(`\n cd ${name}`));
      console.log(chalk.green('npm install'));
      console.log(chalk.green('npm run dev \n'));
    }
  })
})

//给help信息添加信息
program.on('--help', function(){
 console.log('\nRun <command> --help for detailed usage of given command\n');
})

program.parse(process.argv)