import chalk from 'chalk'

console.log(
  chalk.red('The ' + chalk.italic('serve') + ' script has been removed from the Lightning-SDK ... ')
)
console.log()
console.log('Please install the ' + chalk.italic('Lightning-CLI') + ' globally on your system:')
console.log()
console.log(chalk.bold.dim('npm install -g WebPlatformForEmbedded/Lightning-CLI'))
console.log()
console.log(
  'And then run ' + chalk.green.bold('lng serve') + ' in the directory with your Lightning App'
)
