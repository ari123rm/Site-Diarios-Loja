//pegar lista html
const lista = document.querySelector("#diarios-print");
const inputMes = document.querySelector("#mesImpressao");




//ajustando o input do mes para o mes atual
inputMes.value = `${dataAtual.toLocaleDateString().split("/")[2]}-${dataAtual.toLocaleDateString().split("/")[1]}`;


//build totais
function totalSoma(total,element){
    total.vendas.dinheiro += element.dinheiro;
        total.vendas.pix += element.pix;
        total.vendas.debito += element.debito;
        total.vendas.credito += element.credito;
        total.vendas.total += element.totalVendas();
        
        element.despesas.forEach((desp)=>{
            if(desp.motivo != "nada" && desp.motivo != "Nada" &&  desp.motivo != "" && (desp.dinheiroPix == "pix" || desp.dinheiroPix == "dinheiro")){
                if(desp.motivo != "Depósito"){
                    switch(desp.dinheiroPix){
                        case "dinheiro":
                            total.despesas.dinheiro += desp.valor
                            break;
                        case "pix":
                            total.despesas.pix += desp.valor
                            break;
                        default:
                            desp.valor = 0;
                            break;
                    }
                    total.despesas.total += desp.valor;
                }else{
                    total.despesas.depositos += desp.valor;
                }
                
            }
        });
        element.turnos.forEach((turn)=>{
            let id = -1;
            total.funcionarios.forEach((repetido,index)=>{
                if(turn.nome == repetido.nome)id = index;
            })
            if(id != -1){
                total.funcionarios[id].qtdd += turn.quantidadeVendas;
                total.funcionarios[id].total += turn.valor;
            }else{
                total.funcionarios.push({nome:turn.nome,qtdd:turn.quantidadeVendas,total:turn.valor});
            }
        });
}
function totalHTML(total,tipoPeriodo,periodo){
    let meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    let nome;
    switch(tipoPeriodo){
        case'mes':
            nome = meses[periodo];
            break;
        case'ano':
            nome = periodo;
            break;
        case'geral':
            nome = 'Geral';
            break;
        default:
            nome = 'Não encontrado'
            break;
    }
    let titulo = `<li><h2>Total ${nome}</h2></li>`;

    let vendas = `<li><h3>Vendas:</h3> <table><tr> <th>Dinheiro: </th><td>R$ ${total.vendas.dinheiro.toFixed(2)}</td></tr> <tr><th>PIX:</th><td>R$ ${total.vendas.pix.toFixed(2)}</td> </tr><tr><th>Débito:</th><td>R$ ${total.vendas.debito.toFixed(2)}</td></tr><tr><th>Crédito:</th><td>R$ ${total.vendas.credito.toFixed(2)}</td></tr><tr> <th>TOTAL:</th> <th>R$ ${total.vendas.total.toFixed(2)}</th></tr></table></li>`
    let despesas = `<li><h3>Despesas:</h3> <table><tr><th>Dinheiro:</th><td>R$ ${total.despesas.dinheiro.toFixed(2)}</td></tr><tr><th>PIX</th><td>R$ ${total.despesas.pix.toFixed(2)}</td></tr><tr><th>TOTAL:</th><th>R$ ${total.despesas.total.toFixed(2)}</th></tr><tr><th>Depósitos:</th><td>R$ ${total.despesas.depositos.toFixed(2)}</td></tr></table></li>`;
    let turnos = `<li><h3>Turnos:</h3><table><tr><th>Funcionário</th><th>N°</th><th>Valor</th></tr>`;
    total.funcionarios.forEach((func)=>{
        turnos += `<tr><td>${func.nome}</td><td>${func.qtdd}</td><td>R$ ${func.total.toFixed(2)}</td></tr>`;
    })
    turnos += `</table></li>`;
    lista.innerHTML += `<li><ul type = "none"> ${titulo} ${vendas} ${despesas} ${turnos}<ul></li>`
}
//atribuindo para before print
window.onbeforeprint = () => {
    let totalMes = new Total();
    let totalAno = new Total();
    let totalGeral = new Total();
    loja.organize();
    lista.innerHTML = '';
    loja.listaPeriodo(inputMes.value,"Mensal","").forEach((element) => {
        let dia = `<li><h2>Dia: ${element.dia.toLocaleDateString()}</h2></li>`;
        let horario = `<li><h3>Horários</h3><table><tr><th>Horário Inicio: </th><td>${element.horarioEntrada}</td></tr><tr><th>Horário Saída: </th><td>${element.horarioSaida}</td></tr></table></li>`
        let caixa = `<li><h3>Caixa:</h3> <table>  <tr><th>Caixa Inicial: </th><td>R$ ${element.caixaInicial.toFixed(2)}</td></tr><tr><th>Caixa Final: </th><td>R$ ${element.caixaFinal.toFixed(2)}</td></tr></table></li>`
        let vendas = `<li><h3>Vendas:</h3> <table><tr> <td>Dinheiro: </td><td>R$ ${element.dinheiro.toFixed(2)}</td></tr> <tr><td>PIX:</td><td>R$ ${element.pix.toFixed(2)}</td> </tr><tr><td>Débito:</td><td>R$ ${element.debito.toFixed(2)}</td></tr><tr><td>Crédito:</td><td>R$ ${element.credito.toFixed(2)}</td></tr><tr> <th>TOTAL:</th> <td>R$ ${element.totalVendas().toFixed(2)}</td></tr></table></li>`

        let despesas = `<li><h3>Despesas:</h3><table><tr><th>Motivo</th><th>Método</th><th>Valor</th></tr>`;
        let totalDesp = 0;
        element.despesas.forEach((desp)=>{
            despesas += `<tr><td>${desp.motivo}</td><td>${desp.dinheiroPix}</td><td>R$ ${desp.valor.toFixed(2)}</td></tr>`;
            totalDesp +=desp.valor;
        });
        despesas += `<tr><th>TOTAL:</th><td></td><td>R$ ${element.totalDespesas().toFixed(2)}</td></tr></table></li>`;

        let turnos = `<li><h3>Turnos:</h3><table><tr><th>Funcionário</th><th>Turno</th><th>N°</th><th>Valor</th></tr>`;
        let totalTurn = 0;
        element.turnos.forEach((turn)=>{
            let periodo;
            switch(turn.periodo){
                case 'Completo':
                    periodo = "Comp";
                    break;
                case 'Matutino':
                    periodo = "Mat";
                    break;
                case 'Vespertino':
                    periodo = "Vesp";
                    break;
                default:
                    periodo = turn.periodo;
                    break;
            }
            turnos += `<tr><td>${turn.nome}</td><td>${periodo}</td><td>${turn.quantidadeVendas}</td><td>R$ ${turn.valor.toFixed(2)}</td></tr>`;
            totalTurn += turn.valor;
        });
        turnos += `<tr><th>TOTAL:</th><td></td><td></td><td>R$ ${totalTurn.toFixed(2)}</td></tr></table></li>`;

        lista.innerHTML += `<li> <ul type = "none"> ${dia}${horario} ${caixa} ${vendas} ${despesas} ${turnos}</ul></li>`;
        totalSoma(totalMes,element);
        
    });
    if(loja.listaPeriodo(inputMes.value,"Mensal","").length %2 == 0)lista.innerHTML += `<li><ul type = "none"><ul></li>`;
    totalHTML(totalMes,'mes',inputMes.value.split('-')[1] - 1);

    loja.listaPeriodo(inputMes.value.split('-')[0],'Anual','').forEach((element)=>{
        totalSoma(totalAno,element);
    })
    totalHTML(totalAno,'ano',inputMes.value.split('-')[0]);
    
    loja.listaPeriodo('','Geral','').forEach((element)=>{
        totalSoma(totalGeral,element);
    })
    totalHTML(totalGeral,'geral','');




} 

/*   
                    
                        
                        
                    
                        
                        
                            
                            <tr><td>Funcionário</td><td>Turno</td><td>0</td><td>R$ 00,00</td></tr>
                            <tr><td>Funcionário</td><td>Turno</td><td>0</td><td>R$ 00,00</td></tr>

                            
                        
                    
                </ul>
            </li>

*/