class Despesa{
    motivo;
    dinheiroPix;
    valor;
    constructor(motivo,DP,valor){
        this.motivo = motivo;
        this.dinheiroPix = DP;
        this.valor = valor;
    }
    get motivo(){
        return this.motivo;
    }
    set motivo(m){
        this.motivo = m;
    }

    get dinheiroPix(){
        return this.dinheiroPix;
    }
    set dinheiroPix(type){
        this.dinheiroPix = type;
    }

    get valor(){
        return this.valor;
    }
    set valor(value){
        this.valor = value;
    }
    
}
class Caixa{
    vendas;
    despesas;
    caixa;
    constructor(){
        this.vendas = {
            dinheiro: 0,
            pix: 0,
            debito:0,
            credito:0
        }
        this.despesas = []
        this.caixa = {
            inicial: 0,
            final: 0
        }
    }

    get vendas(){
        return this.vendas;
    }
    set vendas(sell){
        this.vendas = sell;
    }

    get despesas(){
        return this.despesas;
    }
    set despesas(sell){
        this.despesas = sell;
    }

    get caixa(){
        return this.caixa;
    }
    set caixa(sell){
        this.caixa = sell;
    }

    get dinheiro(){
        return this.vendas.dinheiro;
    }
    set dinheiro(money){
        this.vendas.dinheiro = money;
    }

    get pix(){
        return this.vendas.pix;
    }
    set pix(money){
        this.vendas.pix = money;
    }

    get debito(){
        return this.vendas.debito;
    }
    set debito(money){
        this.vendas.debito = money;
    }

    get credito(){
        return this.vendas.credito;
    }
    set credito(money){
        this.vendas.credito = money;
    }

    get caixaInicial(){
        return this.caixa.inicial;
    }
    set caixaInicial(inicial){
        this.caixa.inicial = inicial;
    }
    get caixaFinal(){
        return this.caixa.final;
    }
    set caixaFinal(final){
        this.caixa.final = final;
    }
    
    addDespesas(despesas){
        this.despesas.push(despesas);
    }

    totalVendas(){
        return this.vendas.dinheiro + this.vendas.pix + this.vendas.debito + this.vendas.credito;
    }
    totalDespesas(){
        let soma = 0;
        this.despesas.forEach((element) =>{
            soma += element.valor;
        })
        return soma;
    }
}
class Turno {
    periodo;
    nome;
    quantidadeVendas;
    valor;
    constructor(periodo,nome,qtddVendas,valor){
        this.periodo = periodo;
        this.nome = nome;
        this.quantidadeVendas = qtddVendas;
        this.valor = valor;
    }

    get periodo(){
        return this.periodo;
    }
    set periodo(periodinho){
        this.periodo = periodinho;
    }

    get nome(){
        return this.nome;
    }
    set nome(name){
        this.nome = name;
    }

    get quantidadeVendas(){
        return this.quantidadeVendas;
    }
    set quantidadeVendas(qtddVendas){
        this.quantidadeVendas = qtddVendas;
    }
    get valor(){
        return this.valor;
    }
    set valor(value){
        this.valor = value;
    }
}
class Diario extends Caixa{
    dia;
    horarioEntrada;
    horarioSaida;
    turnos
    constructor(dia,hrEnt,hrSai){
        super();
        this.dia = dia;
        this.horarioEntrada= hrEnt;
        this.horarioSaida = hrSai;
        this.turnos = [];
    }

    get dia(){
        return this.dia;
    }
    set dia(diazinho){
        this.dia = diazinho;
    }

    get horarioEntrada(){
        return this.horarioEntrada;
    }
    set horarioEntrada(entrada){
        this.horarioEntrada = entrada;
    }

    get horarioSaida(){
        return this.horarioSaida;
    }
    set horarioSaida(saida){
        this.horarioSaida = saida;
    }

    get turnos(){
        return this.turnos;
    }
    set turnos(turninho){
        this.turnos = turninho;
    }

    addTurno(turno){
        this.turnos.push(turno);
    }
}
class Loja {
    diarios
    constructor(){
        this.diarios = [];
    }
    get diario(){
        return this.diarios;
    }
    set diario(diarinho){
        this.diarios = diarinho;
    }
    addDiario(diario){
        diario.turnos.forEach((turno,index)=>{
            if(turno.periodo == "" || turno.nome == "" || turno.quantidadeVendas == null || turno.valor == null){
                diario.turnos.splice(index,1);
            }
        })
        diario.despesas.forEach((desp,index)=>{
            if(desp.motivo == "" || desp.valor == null){
                diario.despesas.splice(index,1);
            }
        })
        this.diarios.push(diario);
    }
    procurarDiario(data){
        let encontrado = -1;
        this.diarios.forEach((element,index) => {
            if(element.dia.toLocaleDateString() == data){
                encontrado = element;
            }
        })
        return encontrado;
    }
    idDiario(data){
        let encontrado = -1;
        this.diarios.forEach((element,index) => {
            if(element.dia.toLocaleDateString() == data){
                encontrado = index;
            }
        })
        return encontrado;
    }
    listaPeriodo(data,tipoPeriodo,data2){
        let retorno = new Array();
        switch(tipoPeriodo){
            case 'Diario':
                this.diario.forEach((element) => {
                    
                    if(element.dia.getFullYear() == data.split('-')[0] && element.dia.getMonth() + 1 == data.split('-')[1] && element.dia.getDate() == data.split('-')[2]){
                        
                        retorno.push(element);
                    }
                });
                break;
            case 'Semanal':
                this.diario.forEach((element) =>{
                    if(element.dia.getWeek() == data.split('-W')[1]){
                        retorno.push(element)
                    }
                })
                break;
            case 'Mensal':
                this.diario.forEach((element) =>{
                    if(element.dia.getFullYear() == data.split('-')[0] && element.dia.getMonth() + 1 == data.split('-')[1]){
                     retorno.push(element);   
                    }
                })
                break;
            case 'Anual':
                this.diario.forEach((element)=>{
                    if(element.dia.getFullYear() == data){
                        retorno.push(element);
                    }

                })
                break;

            case 'Geral':
                retorno = this.diario
               
                break;
            case 'Custom':
                let verificador = false;
                this.diario.forEach((element)=>{
                    if(element.dia.getFullYear() == data.split('-')[0] && element.dia.getMonth() + 1 == data.split('-')[1] && element.dia.getDate() == data.split('-')[2] || verificador){
                        retorno.push(element);
                        verificador = true
                    }
                    if(element.dia.getFullYear() == data2.split('-')[0] && element.dia.getMonth() + 1 == data2.split('-')[1] && element.dia.getDate() == data2.split('-')[2]){
                        verificador = false
                    }
                })
                break;

            default:
                retorno = -1;
                break;
        }
        return retorno;
    }
    organize(){
        this.diarios.forEach(diario =>{
            diario.turnos.forEach((turno,index)=>{
                if(turno.periodo == "" || turno.nome == "" || turno.quantidadeVendas == null || turno.valor == null){
                    diario.turnos.splice(index,1);
                }
            })
            diario.despesas.forEach((desp,index)=>{
                if(desp.motivo == "" || desp.valor == null){
                    diario.despesas.splice(index,1);
                }
            })
        });
        
        var i, j, temp;
        var swapped;
        for (i = 0; i < this.diario.length - 1; i++) 
        {
            swapped = false;
            for (j = 0; j < this.diario.length - i - 1; j++) 
            {
                if (this.diario[j].dia.valueOf() > this.diario[j + 1].dia.valueOf()) 
                {
                    // Swap arr[j] and arr[j+1]
                    temp = this.diario[j];
                    this.diario[j] = this.diario[j + 1];
                    this.diario[j + 1] = temp;
                    swapped = true;
                }
            }

            // IF no two elements were 
            // swapped by inner loop, then break
            if (swapped == false)
            break;
        }
    } 
}

//Criando os datasets (grafico.js)
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
    obj(){
      return {
        label: this.label,
        data: this.data,
        backgroundColor: this.backgroundColor,
        parsing:this.parsing
      }
    }
  }

// Criando o objeto para o calculo dos totais (impressao.js)
class Total{
    funcionarios
    vendas
    despesas
    constructor(){
        this.despesas ={
            dinheiro:0,
            pix:0,
            depositos: 0,
            total:0
        };
        this.vendas={
            dinheiro:0,
            pix:0,
            debito:0,
            credito:0,
            total:0,
        };
        this.funcionarios=[]
    }
}


//Adicionando a função .getWeek() na classe Date
/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
    
        dowOffset = typeof(dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
        var newYear = new Date(this.getFullYear(),0,1);
        var day = newYear.getDay() - dowOffset; //the day of week the year begins on
        day = (day >= 0 ? day : day + 7);
        day--;
        var daynum = Math.floor((this.getTime() - newYear.getTime() - 
        (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
        var weeknum;
        //if the year starts before the middle of a week
        if(day < 4) {
            weeknum = Math.floor((daynum+day-1)/7) + 1;
            if(weeknum > 52) {
                nYear = new Date(this.getFullYear() + 1,0,1);
                nday = nYear.getDay() - dowOffset;
                nday = nday >= 0 ? nday : nday + 7;
                /*if the next year starts before the middle of
                  the week, it is week #1 of that year*/
                weeknum = nday < 4 ? 1 : 53;
            }
        }
        else {
            weeknum = Math.floor((daynum+day-1)/7);
        }
        return weeknum;
}; 
