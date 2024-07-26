//Pegando os inputs
const tipoGrafico = document.querySelector("#tipo-grafico")
const dadosGrafico = document.querySelector("#dados-grafico")
const data1Grafico = document.querySelector("#grafico-data1")
const data2Grafico = document.querySelector("#grafico-data2")
const periodoGrafico = document.querySelector("#tipo-periodo-grafico")

//função para mudar Input das datas
function mudarInputDatas(periodo){
  switch(periodo){
    case 'Diario':
      data1Grafico.type = "date";
      data1Grafico.value = calendarioInput.value;
      data2Grafico.type = "hidden";
      break;
    case 'Semanal':
      
      data1Grafico.type = "week";
      data2Grafico.type = "hidden";
      break;
    case 'Mensal':
      data1Grafico.type = "month";
      data2Grafico.type = "hidden";
      data1Grafico.value = `${calendarioInput.value.split("-")[0]}-${calendarioInput.value.split("-")[1]}`;
      break;
    case 'Anual':
      data1Grafico.type = "number";
      data2Grafico.type = "hidden";
      data1Grafico.value = calendarioInput.value.split("-")[0];
      break;
    case "Custom":
      data1Grafico.type = "date";
      data2Grafico.type = "date";
      data1Grafico.value = calendarioInput.value;
      data2Grafico.value = calendarioInput.value;
      break;
    default:
      
      data1Grafico.type = "hidden";
      data2Grafico.type = "hidden";
      break;
  }
}

//Criando a classe para o dataSet


//inicializando labels e dataSets



//Criando as Labels
function buildLabels(tipoLabel,dados){
  let labels = [];
  switch(tipoLabel){
    case 'dias':
      dados.forEach((element) => {
       labels.push(element.dia.toLocaleDateString());
      });
      break;
    case 'vendas':
        labels.push('Dinheiro');
        labels.push('PIX');
        labels.push('Débito');
        labels.push('Crédito');
      break;
    case 'despesas':
      dados.forEach((element) => {
        element.despesas.forEach((despesa)=>{
          let verificador = true;
          if(despesa.motivo == 'Depósito'|| despesa.motivo == 'nada'){
            verificador = false
          }else{
            labels.forEach((label) =>{
              if(label == despesa.motivo){
                verificador = false
              }
            })
          }
          if(verificador)labels.push(despesa.motivo);
        })
      })
      break;
    case 'funcionarios':
      dados.forEach((element) => {
        element.turnos.forEach((turno)=>{
          let verificador = true;
          labels.forEach((label) =>{
            if(label == turno.nome){
              verificador = false
            }
          })
          if(verificador && turno.nome != '')labels.push(turno.nome);
        })
      })
      break;
    case 'ano':
      let meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
      labels = meses;
      break;
    default:
      labels.push(-1);
      break;
    
  }
  return labels;
  
}

//Criando os datasets
class DataSet{
  constructor(label,key,dados,background){
    this.label = label;
    this.data = dados;
    this.backgroundColor = background;
    this.parsing = {
      yAxisKey: key,
      key: key
    }
  }
}
function buildDataSets(key,data,ano){
  let dataSets = [];
 
  switch(key){
    case "vendasXdespesas":
      let v = [];
      let d = []
      if(ano){
        for(let i=0;i<12;i++){
          v[i] = 0;
          d[i] = 0;
        }
      }
      data.forEach((element,index) =>{
        if(ano){
          v[element.dia.getMonth()] += element.dinheiro;
          v[element.dia.getMonth()] += element.pix;
          v[element.dia.getMonth()] += element.debito;
          v[element.dia.getMonth()] += element.credito;
          element.despesas.forEach((despesa) =>{
            if(despesa.motivo != "Depósito" && despesa.motivo != 'nada')d[element.dia.getMonth()] += despesa.valor;
          
          });
        }else{
          v[index] = d[index] = 0
          v[index] += element.dinheiro;
          v[index] += element.pix;
          v[index] += element.debito;
          v[index] += element.credito;
          element.despesas.forEach((despesa) =>{
            if(despesa.motivo != "Depósito" && despesa.motivo != 'nada')d[index] += despesa.valor;
            
          });
        }
      } )
      console.log(v)
      dataSets.push(new DataSet("Vendas R$",'',v,['green']));
      dataSets.push(new DataSet("Despesas R$",'',d,['red']));
      break;
    case "vendas":
      let total = [0,0,0,0];
      data.forEach((element) =>{
        total[0] += element.dinheiro;
        total[1] += element.pix;
        total[2] += element.debito;
        total[3] += element.credito;
      } )
      dataSets.push(new DataSet("Valor em R$",[],total,['darkGreen','MidnightBlue','SaddleBrown','SlateGrey']));
      break;
    case "despesas":
      let nomes = [];
      let valoresDespesa = [];
      data.forEach((element)=> {
        element.despesas.forEach((despesa)=>{
          let id = -1;
          nomes.forEach((nome,i) =>{
            if(nome == despesa.motivo){
              id = i;
            }
          });
          if(despesa.motivo != 'Depósito' && despesa.motivo != 'nada'){
            if(id != -1){
              valoresDespesa[id] += despesa.valor;
            }else{
              nomes[nomes.length] = despesa.motivo
              valoresDespesa[valoresDespesa.length] = despesa.valor;
            }
          }
          
        })
      })
      console.log(nomes)
      dataSets.push(new DataSet("Valor em R$",[],valoresDespesa,['orange','lightCoral','orangeRed','IndianRed']));
      break;
    case "vendedor":
      let vendasV = [];
      let names = [];
      data.forEach((element) => {
        element.turnos.forEach((turno)=>{
          let id = -1;
          let verificador = false;
          names.forEach((label,index) =>{
            if(label == turno.nome){
              verificador = true
              id = index;
            }
          })
          if(turno.nome != ''){
            if(verificador){
              vendasV[id] += turno.valor;
            }else{
              names[names.length] = turno.nome
              vendasV[vendasV.length] = turno.valor;
            }
          }
        })
      })
      
      dataSets.push(new DataSet("Valor vendido em R$",[],vendasV,['aqua','lightBlue','cyan','blue','darkBlue','lightCyan']));
      break;
    case "quantidadeVendas":
      let quantidadeV = [];
      let func = [];
      data.forEach((element) => {
        element.turnos.forEach((turno)=>{
          let id = -1;
          let verificador = false;
          func.forEach((label,index) =>{
            if(label == turno.nome){
              verificador = true
              id = index;
            }
          })
          if(turno.nome != ''){
            if(verificador){
              quantidadeV[id] += turno.quantidadeVendas;
            }else{
              func[func.length] = turno.nome;
              quantidadeV[quantidadeV.length] = turno.quantidadeVendas;
            }
          }
        })
      })
      dataSets.push(new DataSet("Quantidade de vendas",[],quantidadeV,['aqua','lightBlue','cyan','blue','darkBlue','lightCyan']));
      break;
    case 'depositos':
      let depo = []
      data.forEach((element,index) =>{
        element.despesas.forEach((despesa) =>{
          if(despesa.motivo == "Depósito" && despesa.motivo != 'nada')depo[index] = despesa.valor;
        });
      } )
      dataSets.push(new DataSet("Depósitos R$",'',depo,['lightSalmon']));
      break;
      break;
    case 'totalVenda':
      let sell = [];
      if(ano)sell = [0,0,0,0,0,0,0,0,0,0,0,0]
      data.forEach((element,index) =>{
        if(ano){
          sell[element.dia.getMonth()] += element.dinheiro;
          sell[element.dia.getMonth()] += element.pix;
          sell[element.dia.getMonth()] += element.debito;
          sell[element.dia.getMonth()] += element.credito;
          }else{
          sell[index] = 0
          sell[index] += element.dinheiro;
          sell[index] += element.pix;
          sell[index] += element.debito;
          sell[index] += element.credito;
        }
        
      } )
      
      dataSets.push(new DataSet("Vendas R$",'',sell,['lightGreen']));
      break;
    case 'totalDespesas':
      let desp = []
      if(ano)desp = [0,0,0,0,0,0,0,0,0,0,0,0];
      data.forEach((element,index) =>{
        if(ano){
          element.despesas.forEach((despesa) =>{
            if(despesa.motivo != "Depósito" && despesa.motivo != 'nada')desp[element.dia.getMonth()] += despesa.valor;
          });
        }else{
          desp[index] = 0;
          element.despesas.forEach((despesa) =>{
            if(despesa.motivo != "Depósito" && despesa.motivo != 'nada')desp[index] += despesa.valor;
          });
        }
        
      } )
      dataSets.push(new DataSet("Despesas R$",'',desp,['lightCoral']));
      break;   
    case 'horarioEntrada':
      let entra = []
      data.forEach((element,index) =>{
        entra[index] = parseFloat(element.horarioEntrada.split(':')[0]) + parseFloat(element.horarioEntrada.split(':')[1])/100;
      })
      dataSets.push(new DataSet("Horario de Entrada",'',entra,['lightBlue']));
      break;

    case 'horarioSaida':
      
      break;
    default:

      break;
  }
  return dataSets;
}
//Conectando as labels com dataset

function data(dado){
  let opcao = [['vendasXdespesas','totalVenda','totalDespesas','horarioEntrada','horarioSaida','depositos'],['vendas'],['despesas'],['vendedor','quantidadeVendas']];
  let labels = [];
  let datasets = [];
  let ano = false;
  opcao.forEach((tiposLabel,id)=>{
    tiposLabel.forEach((tipo)=>{
      if(dadosGrafico.value == tipo){
        switch(id){
          case 0:
            if(periodoGrafico.value == "Anual"){
              labels  = buildLabels('ano',dado);
              ano = true
            }else{
              labels = buildLabels('dias',dado)
            }
            break;
          case 1:
            labels = buildLabels('vendas',dado);
            break;
          case 2:
            labels = buildLabels('despesas',dado);
            break;
          case 3:
            labels = buildLabels('funcionarios',dado);
            break;
        }
      }
    })
  })
  return {labels: labels,datasets:buildDataSets(dadosGrafico.value,dado,ano)}
}
function option(tipo){
  let retorno = {};
  switch(tipo){
    case 'bar':
    retorno.scales ={
          y: {
            beginAtZero: true
          }
    }
    break;
    case 'line':
      retorno = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
    }
    break;
    case 'pie':
      retorno = {
        tooltipTemplate: '<%= value + "%" %>'
    }
    break;
    case 'doughnut':
      retorno = {
        tooltipTemplate: '<%= value + "%" %>'
    }
    break;
    default:
      break;
  }
  return retorno;
}

//Função carregarTabela
const lucroDespesa = document.getElementById('chart-grafico');

let grafico = new Chart(lucroDespesa, {} );

function carregarTabela(){
  grafico.destroy();
  let dados = loja.listaPeriodo(data1Grafico.value,periodoGrafico.value,data2Grafico.value);
  
  const cfg = {
    type: tipoGrafico.value,
    data: data(dados),
    options: option(tipoGrafico.value)
  }
  console.log(cfg)
  grafico = new Chart(lucroDespesa, cfg );

 
}
window.onload = carregarTabela



//Atribuir ao ONCHANGE

tipoGrafico.onchange = carregarTabela;
dadosGrafico.onchange = carregarTabela;
data1Grafico.onchange = carregarTabela;
data2Grafico.onchange = carregarTabela;
periodoGrafico.onchange = () =>{
  mudarInputDatas(periodoGrafico.value)
  carregarTabela();
}








