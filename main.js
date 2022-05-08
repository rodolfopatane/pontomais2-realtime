const REFRESH_TIME = 1000;
let timer;
const calculaTempo = (pontos) => {
    let agora = new Date();
    agora = `${agora.getHours()}:${agora.getMinutes()}:${agora.getSeconds()}`;
    const limit = pontos.length % 2 === 0 ? pontos.length : pontos.push(agora);
    const pontosDoDia = pontos.slice(0, limit);

    const calcular = (pontos) => {
        const res = pontos.reduce((acc, cur, index, arr) => {
            if (index % 2 === 0)
                return acc;
            const dateAcc = new Date('0'); dateAcc.setHours(arr[index - 1].split(':')[0]); dateAcc.setMinutes(arr[index - 1].split(':')[1]);
            const dateCur = new Date('0'); dateCur.setHours(cur.split(':')[0]); dateCur.setMinutes(cur.split(':')[1]);
            if (cur.split(':')[2]) dateCur.setSeconds(cur.split(':')[2]);
            const diffInSeconds = (dateCur - dateAcc) / 1000;
            if (index === 1)
                return diffInSeconds
            return acc + diffInSeconds
        })
        if (res) {
            const total = res / 60 / 60;
            const percentualData = total - Math.floor(total);
            const totalMinutes = Math.floor(percentualData * 60);
            const totalSeconds = res - ((Math.floor(total) * 60 * 60) + (totalMinutes * 60));
            return { horas: Math.floor(total), minutos: totalMinutes, segundos: totalSeconds };
        }
    }
    return calcular(pontosDoDia);
};
const awaitLoadPage = (callback) => {
    const interval = setInterval(() => {
        console.log('Aguardando componentes da pagina...')
        const div = document.getElementsByTagName('pm-employee-resume')[0];
        const hourElements = document.getElementsByClassName('hour')
        if (div && hourElements && hourElements.length && hourElements.length > 0) {
            clearInterval(interval);
            callback(div)
        }
    }, 500);
}
const updateData = () => {
    awaitLoadPage((div) => {
        div.insertAdjacentHTML('afterend', `<div style="text-align: center" id="total_trabalhado"></div>`)
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            try {
                const pontosElements = document.getElementsByClassName('hour')
                const _pontos = Array.prototype.map.call(pontosElements, pontoElement => pontoElement.innerText.split('-')[0].trim()).reverse()
                if (_pontos.length < 1) throw Error('Sem dados para calcular')
                const { horas, minutos, segundos } = calculaTempo(_pontos)
                document.getElementById('total_trabalhado').innerHTML = `<h2 style="color: #EA6700 !important">Tempo Total: ${horas}h ${minutos}m ${segundos}s </h2>`
            } catch (error) {
                if (document.getElementById('total_trabalhado')) document.getElementById('total_trabalhado').remove()
                clearInterval(timer);
                updateData();
            }
        }, REFRESH_TIME);

    })
}

updateData()
