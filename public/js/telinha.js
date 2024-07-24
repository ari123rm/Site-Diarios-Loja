const axeBamba = new Loja();

//Puxa o diario do banco de dados
function buildAxeBamba(){
    fetch("/diarios").then((response) =>{
        response.json().then((diarios)=>{
            diarios.diarios.forEach((diario)=>{
                let diarioObj = new Diario(new Date(diario.dia),diario.horarioEntrada,diario.horarioSaida);
                diarioObj.caixaInicial = parseFloat(diario.caixa.inicial);
                diarioObj.caixaFinal =   parseFloat(diario.caixa.final);
                diarioObj.dinheiro =     parseFloat(diario.vendas.dinheiro) ;
                diarioObj.pix =          parseFloat(diario.vendas.pix);
                diarioObj.debito =       parseFloat(diario.vendas.debito) ;
                diarioObj.credito=       parseFloat(diario.vendas.credito);
    
    
    
                diario.despesas.forEach((element,index) => {
                    diarioObj.addDespesas(new Despesa(element.motivo,element.dinheiroPix,parseFloat(element.valor)));
                })
                diario.turnos.forEach((element,index) =>{
                    diarioObj.addTurno(new Turno(element.periodo,element.nome,parseInt(element.quantidadeVendas),parseFloat(element.valor)))
                })
    
                axeBamba.addDiario(diarioObj);
            })
        })
    })
}
buildAxeBamba()

//função para escrever no banco de dados
function escrever__json(){
    fetch('/api/updateDiario', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(axeBamba)
})
.then(response => response.json())
.then(data => {
    console.log(data.message); // Mensagem de sucesso do servidor
})
.catch(error => {
    console.error('Erro ao atualizar o usuário:', error);
});
}



const telaInicial = document.querySelector("#tela-inicial");
//Dia atual :D
const dataText = document.querySelectorAll(".data");
let dataAtual = new Date();
let dataObj =  dataAtual;

dataText.forEach((element) => {
    element.innerText = dataObj.toLocaleDateString();
});
//Dia da semana atual
const semanaText = document.querySelectorAll(".semana");
let semana = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
semanaText.forEach((element) =>{
    
    element.innerText = `${semana[dataObj.getDay()]}`;
});

//Selecionador de Data
const calendarioInput = document.querySelector("#calendario-input");
calendarioInput.value = `${dataObj.toLocaleDateString().split("/")[2]}-${dataObj.toLocaleDateString().split("/")[1]}-${dataObj.toLocaleDateString().split("/")[0]}`;

calendarioInput.onblur = atualizaDia;


//Verificador de Feriados
let feriados = [
    new Date (dataObj.getFullYear(),0,1),
    new Date (dataObj.getFullYear(),3,21),
    new Date (dataObj.getFullYear(),4,1),
    new Date (dataObj.getFullYear(),4,12),
    new Date (dataObj.getFullYear(),5,12),
    new Date (dataObj.getFullYear(),5,24),
    new Date (dataObj.getFullYear(),6,2),
    new Date (dataObj.getFullYear(),7,11),
    new Date (dataObj.getFullYear(),8,7),
    new Date (dataObj.getFullYear(),9,12),
    new Date (dataObj.getFullYear(),10,2),
    new Date (dataObj.getFullYear(),10,15),
    new Date (dataObj.getFullYear(),11,8),
    new Date (dataObj.getFullYear(),11,25),
    new Date (dataObj.getFullYear(),11,31),
]
let nomeFeriados = [
    "Dia mundial da Paz",
    "Tiradentes",
    "Dia do Trabalhador",
    "Dia das Mães",
    "Dia dos Namorados",
    "São João",
    "Independência da Bahia",
    "Dia dos Pais",
    "Independência do Brasil",
    "Dia de Nossa Senhora Aparecida",
    "Dia de Finados",
    "Proclamação da República",
    "Dia da Nossa Senhora da Conceição da Praia",
    "Natal",
    "Ano Novo"
];
function subtrairDias(data, dias){;
    return new Date(data.getTime() - (dias * 24 * 60 * 60 * 1000));
}; 
function DataMoveis(){;
    ano = dataObj.getFullYear();
    X=24;
    Y=5;
    a=ano % 19;
    b=ano % 4;
    c=ano % 7;
    d=(19* a + X) % 30
    e=(2*b + 4 * c + 6 * d + Y) % 7
    soma=d+e
  
    if (soma > 9){;
      dia=(d+e-9);
      mes= 3;
  }else {;
      dia= (d+e+22);
      mes= 2;
     };
    //pascoa
    pascoa=new Date(ano,mes,dia);
    feriados.push(pascoa);
    nomeFeriados.push("Páscoa");
    
    //carnaval
    feriados.push(subtrairDias(new Date(ano,mes,dia), 47));
    nomeFeriados.push("Carnaval");
     
    //quarta de cinzas
    feriados.push(subtrairDias(new Date(ano,mes,dia), 46))
    nomeFeriados.push("Quarta-feira de Cinzas");
     
      
};
DataMoveis();
const feriadoClass = document.querySelectorAll(".feriado");
let verificadorFeriado;
feriadoClass.forEach((element) => {
    verificadorFeriado = -1;
    
    feriados.forEach((feriado,index) => {
        
        if(dataObj.toLocaleDateString() == feriado.toLocaleDateString()){
            verificadorFeriado = index;
        }

    })

    element.innerText = verificadorFeriado != -1? nomeFeriados[verificadorFeriado] : "Não é feriado";
    
})


const telaDia = document.querySelector("#tela-dia");
//Abre e fecha a tela do dia atual
const butaoDia = document.querySelector("#butao-dia");
butaoDia.onclick = () => {
    if(telaDia.style.display == "flex"){
        telaDia.style.display = "none";
    }else{
        telaDia.style.display = "flex";
    }
    esperadoBuild();
}
const butaoDiaSair = document.querySelector("#sair-dia");
butaoDiaSair.onclick = () =>{
    telaDia.style.display = "none";
}

//Pegar inputs do dia
const horaEntrada = document.querySelector("#timeEntrada");
const horaSaida = document.querySelector("#timeSaida");

const caixaInicial = document.querySelector("#caixa-inicial");
const caixaFinal = document.querySelector("#caixa-final");

const vendasInput = document.querySelectorAll("#vendas li input");

let tipoDespesa = document.querySelectorAll(".tipo-despesa");
let dinheiroPix = document.querySelectorAll(".dinheiroPix")
let valorDespesa = document.querySelectorAll(".despesas-money");

let horarioTurno = document.querySelectorAll(".turno-horarios");
let horarioFuncionario = document.querySelectorAll(".funcionario-horarios");
let horarioQuantidadeVendas = document.querySelectorAll(".quantidade-vendas-horarios");
let horarioVendas = document.querySelectorAll(".horario-vendas-input");

//Build valores Esperados
const caixaInicialEsperado = document.querySelector("#caixa-inicial-esperado");
const caixaFinalEsperado = document.querySelector("#caixa-final-esperado");
function esperadoBuild(){
    let esperadoInicial;
    let copiaDataObj = new Date(dataObj.toDateString());
    let ontem = new Date(copiaDataObj.setDate(copiaDataObj.getDate() - 1)).toLocaleDateString();
    if(axeBamba.procurarDiario(ontem) != -1){
        
        esperadoInicial = axeBamba.procurarDiario(ontem).caixaFinal
        caixaInicialEsperado.innerText = `R$ ${esperadoInicial.toFixed(2)}`;
    }else{
        esperadoInicial = 0;
        caixaInicialEsperado.innerText = "Dia anterior não registrado" ;
    }
    let despesasDinheiro = 0;
    dinheiroPix = document.querySelectorAll(".dinheiroPix")
    valorDespesa = document.querySelectorAll(".despesas-money");
    dinheiroPix.forEach((element,index)=>{
        if(element.value == "dinheiro" && valorDespesa[index].value )despesasDinheiro += parseFloat(valorDespesa[index].value);
    })
    let dinheiroAdd = 0;
    if(vendasInput[0].value){
        dinheiroAdd += parseFloat(vendasInput[0].value)
    }
    let inputInicial = 0;
    if(caixaInicial.value)inputInicial = parseFloat(caixaInicial.value)
    let esperadoFinal = inputInicial + dinheiroAdd - despesasDinheiro;
    caixaFinalEsperado.innerText = `R$ ${esperadoFinal.toFixed(2)}`
}


//Ajuste para Real
let realClass = document.querySelectorAll(".real")
function mascara(valor) {
	var valorAlterado = valor.value;
	valorAlterado = valorAlterado.replace(/\D/g, ""); // Remove todos os não dígitos
	valorAlterado = valorAlterado.replace(/(\d+)(\d{2})$/, "$1.$2"); // Adiciona a parte de centavos
	valor.value = valorAlterado;
    
}
realClass.forEach((element) => {
    element.onblur = () => {
        mascara(element)
        esperadoBuild();
    }
})

function dinheiroPixBlur(){
    dinheiroPix.forEach((element) =>{
        element.onblur = () => {
            esperadoBuild()
            inputBlurMoney(valorDespesa,despesaTotalText);
        }
    })
    
}
dinheiroPixBlur();

//Add e remove em despesas
const butaoAddDespesa = document.querySelector("#add-despesa");
function addHtmlDespesas(){
    const ultimoItem = document.querySelectorAll('#despesas li')[document.querySelectorAll('#despesas li').length -3];   
    const li = document.createElement('li');
    li.innerHTML = '<button class ="remove-despesa"> - </button> <input type="text" name="despesas" class="tipo-despesa" autocomplete="off" placeholder="Motivo" list = "auto-despesas"><select name="opcao" id="despesas-opcao" class = "dinheiroPix" placeholder = "Dinheiro ou PIX" list = "dinheiro/pix" ><option value="dinheiro">Dinheiro</option><option value="pix">PIX</option></select><label for="despesas-valor" class = "sifrao">R$</label><input type="number" name="despesas-valor" id="despesas-valor" class="real despesas-money" placeholder="00,00">';
    ultimoItem.parentNode.insertBefore(li, ultimoItem.nextSibling);
    tipoDespesa = document.querySelectorAll(".tipo-despesa");
    dinheiroPix = document.querySelectorAll(".dinheiroPix")
    valorDespesa = document.querySelectorAll(".despesas-money");

    removerDespesaBuild();
    dinheiroPixBlur();
    inputBlurMoney(valorDespesa,despesaTotalText);
}
function removerDespesaBuild(){
    let butaoRemoveDespesa = document.querySelectorAll(".remove-despesa");
        butaoRemoveDespesa.forEach((element,index) => {
            element.onclick = () => {
                const selecionado = document.querySelectorAll('#despesas li')[index + 2];
                const inputSelecionado = document.querySelectorAll("#despesas li")[index + 2].querySelectorAll("input");
                inputSelecionado.forEach((input) =>{
                    input.value = "";
                })
                if (selecionado.parentNode) {
                    selecionado.parentNode.removeChild(selecionado);    
                    
                    
                    
                    
                    removerDespesaBuild();
                    somaTotalInput(valorDespesa,despesaTotalText);
                }
                
            }
        })
}
butaoAddDespesa.onclick = addHtmlDespesas


//Atualiza Total de Vendas e despesas
function inputBlurMoney(tag,totalText){
    tag.forEach((element) =>{   
        element.onblur = () => {
            mascara(element);
            esperadoBuild();
            somaTotalInput(tag,totalText);   
        }
    })
}
function somaTotalInput(html,totalText){
    let soma = 0;
    html.forEach((valorInput) =>{
        if(parseFloat(valorInput.value)){
            soma += parseFloat(valorInput.value);
        }else{
            soma += 0;
        }
    });
    if(totalText){
        totalText.innerText = soma.toFixed(2);
        return -1;
    }else{
        return soma;
    }
}
const vendasTotalText = document.querySelector("#vendas-total");
inputBlurMoney(vendasInput,vendasTotalText);
const despesaTotalText = document.querySelector("#despesas-total")
inputBlurMoney(valorDespesa,despesaTotalText);
const horarioTotalText = document.querySelector("#horario-total")
inputBlurMoney(horarioVendas,horarioTotalText);

//Add e remove em Horarios
const butaoAddHorario = document.querySelector("#add-horario");
function addHtmlHorario(){
    const ultimoItem = document.querySelectorAll('#horarios tr')[document.querySelectorAll('#horarios tr').length -1];   
    const tr = document.createElement('tr');
    tr.innerHTML = '<td><input type="text" name = "turno" class = "turno-horarios" autocomplete="on" placeholder="Horário" list = "turnos"></td>    <td><input type="text" name = "funcionario" class= "funcionario-horarios" autocomplete="on" placeholder="Funcionário" list= "funcionarios"></td> <td><input type="number" name = "quantidade-vendas" class = "quantidade-vendas-horarios" placeholder="0"></td> <td><label for="horario-venda" class = "sifrao">R$</label><input type="number" name="horario-vendas" id="horario-venda" class="real horario-vendas-input" placeholder="00,00"></td> <button class ="remove-horario"> - </button>';
    ultimoItem.parentNode.insertBefore(tr, ultimoItem.nextSibling);
    horarioTurno = document.querySelectorAll(".turno-horarios");
    horarioFuncionario = document.querySelectorAll(".funcionario-horarios");
    horarioQuantidadeVendas = document.querySelectorAll(".quantidade-vendas-horarios");
    horarioVendas = document.querySelectorAll(".horario-vendas-input");
    removerHorarioBuild();
    inputBlurMoney(horarioVendas,horarioTotalText);
}
function removerHorarioBuild(){
    let butaoRemoveHorario = document.querySelectorAll(".remove-horario");
        butaoRemoveHorario.forEach((element,index) => {
            element.onclick = () => {
                const selecionado = document.querySelectorAll('#horarios tr')[index + 2];
                const inputSelecionado = document.querySelectorAll('#horarios tr')[index + 2].querySelectorAll("input");
                inputSelecionado.forEach((input) =>{
                    input.value = "";
                    
                })
                somaTotalInput(horarioVendas,horarioTotalText);
                if (selecionado.parentNode) {
                    selecionado.parentNode.removeChild(selecionado);  
                    
                    
                    
                }
                removerHorarioBuild();
               
            }
        })
}
butaoAddHorario.onclick = addHtmlHorario;

//Função para mudar de data
function atualizaDia(){
    //Atualiza dataObj
    if(calendarioInput.value){
        dataObj = new Date(calendarioInput.value.split('-')[0],calendarioInput.value.split('-')[1] - 1,calendarioInput.value.split('-')[2]);
    }else{
        dataObj = dataAtual;
    }
    //Verifica se a data já foi colocada no diario
    if(axeBamba.procurarDiario(dataObj.toLocaleDateString()) != -1){
        
        horaEntrada.value = axeBamba.procurarDiario(dataObj.toLocaleDateString()).horarioEntrada;
        horaSaida.value  = axeBamba.procurarDiario(dataObj.toLocaleDateString()).horarioSaida;

        caixaInicial.value = (axeBamba.procurarDiario(dataObj.toLocaleDateString()).caixaInicial*100).toFixed(0);
        caixaFinal.value  = (axeBamba.procurarDiario(dataObj.toLocaleDateString()).caixaFinal*100).toFixed(0);

        vendasInput[0].value  = ( axeBamba.procurarDiario(dataObj.toLocaleDateString()).dinheiro *100).toFixed(0);
        vendasInput[1].value =  (axeBamba.procurarDiario(dataObj.toLocaleDateString()).pix*100).toFixed(0);
        vendasInput[2].value  = (axeBamba.procurarDiario(dataObj.toLocaleDateString()).debito*100).toFixed(0);
        vendasInput[3].value =  (axeBamba.procurarDiario(dataObj.toLocaleDateString()).credito*100).toFixed(0);
        

        axeBamba.procurarDiario(dataObj.toLocaleDateString()).despesas.forEach((element,index) => {
            if(index > 0 && tipoDespesa.length == index)addHtmlDespesas();
            tipoDespesa[index].value = element.motivo;
            dinheiroPix[index].value = element.dinheiroPix;
            
            valorDespesa[index].value = (element.valor*100).toFixed(0);
        })
        
        axeBamba.procurarDiario(dataObj.toLocaleDateString()).turnos.forEach((element,index) => {
            
            if(index > 0 && horarioTurno.length == index)addHtmlHorario();
            horarioTurno[index].value = element.periodo;
            horarioFuncionario[index].value = element.nome;
            horarioQuantidadeVendas[index].value = element.quantidadeVendas;
            horarioVendas[index].value = (element.valor*100).toFixed(0);
        })

        realClass = document.querySelectorAll(".real")
        realClass.forEach((element) => {
                mascara(element)
        })


        

    }else{
        horaEntrada.value = '';
        horaSaida.value   = '';

        caixaInicial.value = '';
        caixaFinal.value  = '';

        vendasInput[0].value  =  '' ;
        vendasInput[1].value = '';
        vendasInput[2].value  = '';
        vendasInput[3].value = '';
               

        tipoDespesa.forEach((element,index) => {
            tipoDespesa[index].value = '';
            dinheiroPix[index].value = '';
            valorDespesa[index].value ='';
        })
        horarioTurno.forEach((element,index) => {
            horarioTurno[index].value = '';
            horarioFuncionario[index].value = '';
            horarioQuantidadeVendas[index].value ='';
            horarioVendas[index].value ='';
        })
        
    }
    //Atualiza data
    dataText.forEach((element) => {
        element.innerText = dataObj.toLocaleDateString();
    });
    //Atualiza dia da semana
    semanaText.forEach((element) =>{
        element.innerText = `${semana[dataObj.getDay()]}`;
    });
    //Atualiza estado de feriado
    feriadoClass.forEach((element) => {
        verificadorFeriado = -1;
        feriados.forEach((feriado,index) => {
            if(dataObj.toLocaleDateString() == feriado.toLocaleDateString()){
                verificadorFeriado = index;
            }
        })
        element.innerText = verificadorFeriado != -1? nomeFeriados[verificadorFeriado] : "Não é feriado";
    })
    //Atualiza Total de cada categoria
    somaTotalInput(vendasInput,vendasTotalText);
    somaTotalInput(valorDespesa,despesaTotalText);
    somaTotalInput(horarioVendas,horarioTotalText);
    //Atualiza esperado
    esperadoBuild();
    
}

atualizaDia();

//Salvar Dia
const buttonSaveDia = document.querySelector("#save-dia");
function verificarInputsDia(){
    let verificador = true;
    const inputsDia = document.querySelectorAll("#tela-dia input");
    inputsDia.forEach((element)=>{
        if(element.value == '')verificador = false;
    })
    return verificador;
}
function verificarTotalVH(){
    let verificador = false;
    if(vendasTotalText.innerText == horarioTotalText.innerText){
        verificador = true
    }
    return verificador;
}
buttonSaveDia.onclick = () =>{
    if(verificarInputsDia() && verificarTotalVH()){
        if(axeBamba.procurarDiario(dataObj.toLocaleDateString()) === -1){
            let diaSave;
            diaSave = new Diario(dataObj,horaEntrada.value,horaSaida.value);
            diaSave.caixaInicial = parseFloat(caixaInicial.value);
            diaSave.caixaFinal = parseFloat(caixaFinal.value) ;
    
            diaSave.dinheiro = parseFloat(vendasInput[0].value) ;
            diaSave.pix = parseFloat(vendasInput[1].value);
            diaSave.debito = parseFloat(vendasInput[2].value) ;
            diaSave.credito= parseFloat(vendasInput[3].value);
    
            tipoDespesa.forEach((element,index) => {

                diaSave.addDespesas(new Despesa(element.value,dinheiroPix[index].value,parseFloat(valorDespesa[index].value)));
            })
            horarioTurno.forEach((element,index) =>{
                diaSave.addTurno(new Turno(element.value,horarioFuncionario[index].value,parseInt(horarioQuantidadeVendas[index].value),parseFloat(horarioVendas[index].value)))
            })
    
            axeBamba.addDiario(diaSave);
            console.log(JSON.stringify(diaSave))
            escrever__json();
            alert(`Dia ${axeBamba.procurarDiario(diaSave.dia.toLocaleDateString()).dia.toLocaleDateString()} foi salvo`);
    
        }else{
            let diaAtualizado;
            diaAtualizado = new Diario(dataObj,horaEntrada.value,horaSaida.value);
            diaAtualizado.caixaInicial = parseFloat(caixaInicial.value);
            diaAtualizado.caixaFinal = parseFloat(caixaFinal.value) ;
    
            diaAtualizado.dinheiro = parseFloat(vendasInput[0].value) ;
            diaAtualizado.pix = parseFloat(vendasInput[1].value);
            diaAtualizado.debito = parseFloat(vendasInput[2].value) ;
            diaAtualizado.credito= parseFloat(vendasInput[3].value);
    
            tipoDespesa.forEach((element,index) => {
                diaAtualizado.addDespesas(new Despesa(element.value,dinheiroPix[index].value,parseFloat(valorDespesa[index].value)));
            })
            horarioTurno.forEach((element,index) =>{
                diaAtualizado.addTurno(new Turno(element.value,horarioFuncionario[index].value,parseInt(horarioQuantidadeVendas[index].value),parseFloat(horarioVendas[index].value)))
            })
            axeBamba.diario[axeBamba.idDiario(diaAtualizado.dia.toLocaleDateString())] = diaAtualizado;
            console.log(JSON.stringify(diaAtualizado))
            escrever__json();
            alert(`Dia ${axeBamba.procurarDiario(diaAtualizado.dia.toLocaleDateString()).dia.toLocaleDateString()} foi Alterado`);
            
        
        }
    }else{
        if(!verificarInputsDia())alert("Preencha todos os campos");
        if(!verificarTotalVH())alert("Valor total de VENDAS diferente do total dos TURNOS")
    }

   
    console.log(axeBamba);
}


















