// modulos externos
const inquirer = require('inquirer');
const chalk = require('chalk');

// modulos internos
const fs = require('fs');

// program
operation();

function operation() {

  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'O que você deseja fazer?',
      choices: [
        'Criar conta',
        'Consultar saldo',
        'Depositar',
        'Sacar',
        'Sair'
      ]
    }
  ]).then((result) => {
    const action = result['action'];

    if (action === 'Criar conta') {
      createAccount();

    } else if (action === 'Consultar saldo') {
      getAccountBalance();

    } else if (action === 'Depositar') {
      deposit();

    } else if (action === 'Sacar') {
      withdrawMoney();

    } else {
      console.log(chalk.bgBlue.black('Obrigado por usar o Accounts! Até breve!'));
      process.exit();
    }

  })
    .catch((err) => {
      console.log(err);
    });

}

// create account
function createAccount() {
  console.log(chalk.bgGreen.black('Obrigado por escolher o Accounts!'))
  console.log(chalk.green())

  buildAccount();

}

function buildAccount() {

  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Digite seu nome: '
    }
  ]).then(answer => {

    const accountName = answer.accountName;

    if (!fs.existsSync('accounts')) {
      fs.mkdirSync('accounts')
    }

    if (fs.existsSync(`accounts/${accountName}.json`)) {
      console.log(chalk.bgRed.black('Esta conta já existe! Escolha outro nome.'))
      return buildAccount();
    }

    fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', err => {
      console.log(err)
    })

    console.log(`Olá, ${chalk.green.bold(accountName)}! Seja bem-vindo(a)!`);
    console.log(chalk.bgGreen.black('Parabéns! Sua conta foi criada!'))
    operation();

  }).catch(err => {
    console.log(err)
  })
}

// verify amount of user account
function getAccountBalance() {

  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Qual é o nome da sua conta?'
    }
  ])
    .then(answer => {
      const accountName = answer.accountName;
      const account = getAccount(accountName);

      if (!checkAccount(accountName)) {
        return getAccountBalance();
      }
      console.log(chalk.green(`Seu saldo é de R$${account.balance}`))

      return operation();
    })
    .catch(err => console.log(err));

}

// add an amount to user account
function deposit() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Qual é o nome da sua conta?'
    }
  ]).then(answer => {
    const accountName = answer.accountName;

    // verify if account exists
    if (!checkAccount(accountName)) {
      return deposit();
    }

    inquirer.prompt([
      {
        name: 'ammount',
        message: 'Quanto deseja depositar?'
      }
    ]).then(answer => {

      const ammount = Number(answer.ammount);

      // add an ammount
      addAmount(accountName, ammount)
      operation();

    }).catch(err => console.log(err))

  }).catch(err => console.log(err))
}

// verify account amount
function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('Essa conta não existe. Escolha outro nome.'))
    return false;
  }

  return true
}

function addAmount(accountName, amount) {
  const account = getAccount(accountName);
  verifyAmount(amount);

  account.balance = parseFloat(amount) + parseFloat(account.balance);
  fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(account), err => console.log(err));

  console.log(chalk.green(`Foi depositado um valor de R$${amount} e seu saldo é de R$${account.balance}`));
}

function verifyAmount(amount) {
  if (!amount) {
    console.log(chalk.bgRed.black('Nenhum valor digitado. Tente novamente.'));
    return operation()
  }

  if (amount < 0) {
    console.log(chalk.bgRed.black('Valor inválido. Tente novamente.'));
    return operation()
  }
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf8',
    flag: 'r' // somente ler
  });

  return JSON.parse(accountJSON);
}

// withdraw money
function withdrawMoney() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Digite o nome da sua conta: '
    }
  ]).then(answer => {
    const accountName = answer.accountName;
    if (!checkAccount(accountName)) {
      return withdrawMoney();
    }

    inquirer.prompt([
      {
        name: 'amount',
        message: 'Digite quanto você quer sacar: '
      }
    ]).then(answer => {
      const amount = answer.amount;
      const account = getAccount(accountName);

      account.balance -= amount;

      fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(account), err => console.log(err));

      console.log(chalk.green(`Você sacou R$${amount}. Seu saldo atual é de R$${account.balance}`));

      return operation()

    }).catch(err => console.log(err));


  }).catch(err => console.log(err));

}