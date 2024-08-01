//pegar lista html
const lista = document.querySelector("#diarios-print");
const inputMes = document.querySelector("#mesImpressao");




//ajustando o input do mes para o mes atual
inputMes.value = `${dataAtual.toLocaleDateString().split("/")[2]}-${dataAtual.toLocaleDateString().split("/")[1]}`;


//atribuindo para before print
window.onbeforeprint = () => {
    loja.organize();
    lista.innerHTML = '';
    loja.listaPeriodo(inputMes.value,"Mensal","").forEach((element) => {
        let dia = `<li><h2>Dia: ${element.dia.toLocaleDateString()}</h2></li>`;
        let horario = `<li><h3>Horários</h3><table><tr><th>Horário Inicio: </th><td>${element.horarioEntrada}</td></tr><tr><th>Horário Saída: </th><td>${element.horarioSaida}</td></tr></table></li>`
        let caixa = `<li><h3>Caixa:</h3> <table>  <tr><th>Caixa Inicial: </th><td>R$ ${element.caixaInicial.toFixed(2)}</td></tr><tr><th>Caixa Final: </th><td>R$ ${element.caixaFinal.toFixed(2)}</td></tr></table></li>`
        let vendas = `<li><h3>Vendas:</h3> <table><tr> <td>Dinheiro: </td><td>R$ ${element.dinheiro.toFixed(2)}</td></tr> <tr><td>PIX:</td><td>R$ ${element.pix.toFixed(2)}</td> </tr><tr><td>Débito:</td><td>R$ ${element.debito.toFixed(2)}</td></tr><tr><td>Crédito:</td><td>R$ ${element.credito.toFixed(2)}</td></tr><tr> <th>TOTAL:</th> <td>R$ ${(element.dinheiro + element.pix + element.debito + element.credito).toFixed(2)}</td></tr></table></li>`

        let despesas = `<li><h3>Despesas:</h3><table><tr><th>Motivo</th><th>Método</th><th>Valor</th></tr>`;
        let totalDesp = 0;
        element.despesas.forEach((desp)=>{
            despesas += `<tr><td>${desp.motivo}</td><td>${desp.dinheiroPix}</td><td>R$ ${desp.valor.toFixed(2)}</td></tr>`;
            totalDesp +=desp.valor;
        });
        despesas += `<tr><th>TOTAL:</th><td></td><td>R$ ${totalDesp.toFixed(2)}</td></tr></table></li>`;

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
        })
        turnos += `<tr><th>TOTAL:</th><td></td><td></td><td>R$ ${totalTurn.toFixed(2)}</td></tr></table></li>`;

        lista.innerHTML += `<li> <ul type = "none"> ${dia}${horario} ${caixa} ${vendas} ${despesas} ${turnos}</ul></li>`;
    });
    
    
} 

/*   
                    
                        
                        
                    
                        
                        
                            
                            <tr><td>Funcionário</td><td>Turno</td><td>0</td><td>R$ 00,00</td></tr>
                            <tr><td>Funcionário</td><td>Turno</td><td>0</td><td>R$ 00,00</td></tr>

                            
                        
                    
                </ul>
            </li>

*/