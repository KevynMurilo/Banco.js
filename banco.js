const fs = require('fs');
const prompt = require('prompt-sync')();

const banner = `____                            _             _        
|  _ \\                          (_)           | |       
| |_) |  ___  _ __ ___   __   __ _  _ __    __| |  ___  
|  _ <  / _ \\| '_ \` _ \\  \\ \\ / /| || '_ \\  / _\` | / _ \\ 
| |_) ||  __/| | | | | |  \\ V / | || | | || (_| || (_) |
|____/  \\___||_| |_| |_|   \\_/  |_||_| |_| \\__,_| \\___/ 
        /\\                                              
       /  \\    ___                                      
      / /\\ \\  / _ \\                                     
     / ____ \\| (_) |                                    
 ___/_/    \\_\\\\___/                _____  ______  _____ 
|  _ \\                            |_   _||  ____|/ ____|
| |_) |  __ _  _ __    ___  ___     | |  | |__  | |  __ 
|  _ <  / _\` || '_ \\  / __|/ _ \\    | |  |  __| | | |_ |
| |_) || (_| || | | || (__| (_) |  _| |_ | |    | |__| |
|____/  \\__,_||_| |_| \\___|\\___/  |_____||_|     \\_____|

`;

console.log(banner);
console.log("Pressione Enter para continuar");

prompt();

let usuarios = [];

function verificarRegistro(loginRegistro, cpfRegistro) {
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].login === loginRegistro || usuarios[i].cpf === cpfRegistro) {
      return true;
    }
  }
  return false;
}

function registro() {
  let nomeCompleto = prompt("Digite seu nome: ");
  let sobrenome = prompt("Digite seu sobrenome: ");
  let cpf = prompt("Digite seu CPF para registro: ");
  let loginRegistro = prompt("Digite o login para Registro: ");

  if (verificarRegistro(loginRegistro, cpf)) {
    console.log("Usuário já cadastrado, tente outro.");
    entrarComLogin();
    return;
  }

  let senhaRegistro = prompt("Digite a senha para Registro: ");
  let saldoRegistro = 0; // Defina o saldo inicial aqui

  usuarios.push({ nome: nomeCompleto, sobrenome: sobrenome, cpf: cpf, login: loginRegistro, senha: senhaRegistro, saldo: saldoRegistro });

  console.log("Registro efetuado com sucesso!");
  salvarEmArquivo();
  entrarComLogin();
}

function entrarComLogin() {
  let loginAcesso = prompt("Digite o login para acesso: ");
  let senhaAcesso = prompt("Digite a senha para acesso: ");

  // Ler o arquivo "informacoes.txt" e verificar as credenciais
  fs.readFile('informacoes.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    let usuariosSalvos = data.split('\n');
    let usuarioEncontrado = false;

    for (let i = 0; i < usuariosSalvos.length; i += 7) {
      if (i + 6 >= usuariosSalvos.length) {
        break; // Verificar se há dados suficientes no array
      }

      let infoNome = usuariosSalvos[i].split(': ')[1];
      let infoSobrenome = usuariosSalvos[i + 1].split(': ')[1];
      let infoCPF = usuariosSalvos[i + 2].split(': ')[1];
      let infoLogin = usuariosSalvos[i + 3].split(': ')[1];
      let infoSenha = usuariosSalvos[i + 4].split(': ')[1];
      let infoSaldo = parseFloat(usuariosSalvos[i + 5].split(': ')[1]);

      if (loginAcesso === infoLogin && senhaAcesso === infoSenha) {
        console.log("Usuário logado com sucesso!");
        usuarioEncontrado = true;
        loginFeito(infoLogin, infoSaldo);
        break;
      }
    }

    if (!usuarioEncontrado) {
      console.log("Credenciais inválidas! Tente novamente.");
      entrarComLogin(); // Chamada recursiva para retornar à tela de login
    }
  });
}

function salvarEmArquivo() {
  let conteudo = '';

  for (let i = 0; i < usuarios.length; i++) {
    conteudo += `Nome: ${usuarios[i].nome}\nSobrenome: ${usuarios[i].sobrenome}\nCPF: ${usuarios[i].cpf}\nLogin: ${usuarios[i].login}\nSenha: ${usuarios[i].senha}\nSaldo: ${usuarios[i].saldo}\n\n`;
  }

  // Salvar as informações no arquivo "informacoes.txt" (substituindo o conteúdo)
  fs.writeFile('informacoes.txt', conteudo, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Informações salvas com sucesso!");
  });
}

function escolherFuncao() {
  while (true) {
    let valorDigitado = parseInt(prompt("Digite 1 para cadastrar, 2 para login e 3 para sair: "));

    if (valorDigitado === 1) {
      registro();
      break;
    } else if (valorDigitado === 2) {
      entrarComLogin();
      break;
    } else if (valorDigitado === 3) {
      console.log("Encerrado");
      salvarEmArquivo();
      break;
    } else {
      console.log("Digite um número válido");
    }
  }
}

function loginFeito(login, saldo) {
  let inf = parseInt(prompt("Digite 1 para saque, 2 para depósito, 3 para mostrar saldo, 4 para ver dados da conta e 5 para sair: "));

  if (inf === 1) {
    let quantSaque = parseInt(prompt("Digite quanto quer sacar: "));

    if (quantSaque > saldo) {
      console.log("Saldo insuficiente para o saque.");
    } else if (quantSaque < 0) {
      console.log("Valor inválido para o saque.");
    } else {
      saldo -= quantSaque;
      console.log(`Seu saldo atual é ${saldo}`);

      for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].login === login) {
          usuarios[i].saldo = saldo;
          break;
        }
      }

      salvarEmArquivo();
    }

    loginFeito(login, saldo);
  } else if (inf === 2) {
    let deposito = parseInt(prompt("Digite quanto quer depositar: "));

    if (deposito < 0) {
      console.log("Valor inválido para o depósito.");
    } else {
      saldo += deposito;
      console.log(`Seu saldo atual é ${saldo}`);

      for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].login === login) {
          usuarios[i].saldo = saldo;
          break;
        }
      }

      salvarEmArquivo();
    }

    loginFeito(login, saldo);
  } else if (inf === 3) {
    console.log(`Seu saldo atual é ${saldo}`);
    loginFeito(login, saldo);
  } else if (inf === 4) {
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].login === login) {
        console.log(`Nome: ${usuarios[i].nome}`);
        console.log(`Sobrenome: ${usuarios[i].sobrenome}`);
        console.log(`CPF: ${usuarios[i].cpf}`);
        console.log(`Login: ${usuarios[i].login}`);
        console.log(`Saldo: ${usuarios[i].saldo}`);
        break;
      }
    }

    loginFeito(login, saldo);
  } else if (inf === 5) {
    console.log("Saindo...");
    salvarEmArquivo();
    escolherFuncao();
  } else {
    console.log("Digite um número válido");
    loginFeito(login, saldo);
  }
}

escolherFuncao();
