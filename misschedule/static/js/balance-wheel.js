/*массив цветов*/
var colors = [
    '#F0E68C',
    '#008080',
    '#D2B48C',
    '#6495ED',
    '#FFA07A',
    '#2E8B57',
    '#D8BFD8',
    '#AFEEEE',
];
var arrSliders = [1, 1, 1, 1, 1, 1, 1, 1.5];
const canvas = document.getElementById('id_cv');
const ctx = canvas.getContext('2d');
var count_sectors;
var arr_txtrow1 = [
    'Карьера',
    'Финансы',
    'Отдых',
    'Саморазвитие',
    'Семья',
    'Здоровье',
    'Духовность',
    'Личная жизнь',
];

const radius = 185;
const padding = 1;
const inner_range = 4;
const min_radius = radius / (inner_range + 2);
const xc = radius + padding;
const yc = radius + padding;

//обновляет массив со значениями слайдеров радиуса (веса)
function reNewSlidersValue() {
    for (a = 1; a < 1; a++) {
        arrSliders[a - 1] = document.getElementById('es' + a).value;
    }
}

/*возвращает радианы из градусов*/
function Radian(gradus) {
    return (Math.PI / 180) * gradus;
}


function fillTextCircle(text, x, y, radius, startRotation, a) {
    const gradus = (Math.PI / 36)
    const state = {
        wText: text.length <= 5 ? 7.5 : text.length < 6 ? 7 : text.length <= 8 ? 5.5 : text.length < 10 ? 8 : 4,
        startRotation: text.length < 6 ? gradus * 2.2 : text.length < 8 ? gradus * 1.4 : text.length < 10 ? gradus * 1.3 : gradus * 0.15,
    };
    var numRadsPerLetter = Math.PI / state.wText / text.length;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((startRotation * (a + 2)) + state.startRotation);

    for (var i = 0; i < text.length; i++) {
        ctx.save();
        ctx.rotate(i * (numRadsPerLetter - (text.length <= 5 && i == 2 ? gradus * 0.04 : 0)));

        ctx.fillText(text[i], 0, -radius, min_radius - 25);
        ctx.restore();
    }
    ctx.restore();
}

//рисуем названия каждого сектора
function writeNum(count_sectors) {
    ctx.fillStyle = colors[a];
    ctx.font = '14pt Arial';
    var angleOneSector = 360 / count_sectors;

    for (a = 0; a < count_sectors; a++) {
        ctx.fillStyle = 'black';
        //360- т.к. углы по умолчанию считаются против часовой, а мне надо ПО часовой
        // var point = getXY_byAngle(
        //   580,
        //   240,
        //   Radian(359 - a * angleOneSector - angleOneSector / 2)
        // );

        // ctx.fillText(arr_txtrow1[a], point[0], point[1]); //коррекция X, Y
        fillTextCircle(arr_txtrow1[a], xc, yc, radius / 12 * 10.75, (Math.PI / 4), a);
    }
}

/*рисование на канвасе*/
function createDiagram() {
    copy = []
    canvas.getAttribute("value").split(',').forEach(a=>copy.push(parseFloat(a)))
    if (copy.length === 8)
        arrSliders = copy
    var start = (finish = 0);
    count_sectors = 8;
    var cntSectors = parseInt(count_sectors);
    var oneSector = 360 / cntSectors;

    ctx.fillStyle = '#fff'; /*test #fff */
    ctx.fillRect(0, 0, 510, 510); //очистка canvas 0,0, ширина, высота

    reNewSlidersValue(); //обновление значений в arrSliders[] с радиусами
    /*рисуем цветные сектора*/
    for (a = 0; a < count_sectors; a++) {
        start = finish;
        finish = start + oneSector;
        // linear-gradient(90deg, #34bacc 0%, #00ffaf 100%)
        var grad = ctx.createLinearGradient(radius / 2, radius / 2, radius * 3 / 4, radius * 3 / 4);
        grad.addColorStop(0, "#34bacc");
        grad.addColorStop(1, "#00ffaf");

        ctx.fillStyle = colors[a]
        ctx.beginPath();
        ctx.arc(xc, yc, min_radius * (inner_range + 2), Radian(start), Radian(finish));
        ctx.lineTo(xc, yc);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(xc, yc, min_radius * (inner_range + 1), Radian(start), Radian(finish));
        ctx.lineTo(xc, yc);
        ctx.fill();
        ctx.fillStyle = colors[a];
        ctx.beginPath();
        ctx.arc(xc, yc, min_radius * (arrSliders[a]), Radian(start), Radian(finish));
        ctx.lineTo(xc, yc);
        ctx.fill();
        ctx.fillStyle = colors[a];
    }

    //рисуем окружности
    for (a = 1; a < inner_range + 2; a++) {
        if (a <= inner_range) {
            ctx.strokeStyle = '#585e65';
            ctx.lineWidth = 1
        } else {
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#000000';
        }
        /*наружнее кольцо состоит из двух, 11 не показываем*/
        ctx.beginPath();
        ctx.arc(xc, yc, min_radius * a, 0, Radian(360));
        ctx.stroke();
    }



    /*рисуем перегородки между секторами*/
    for (a = 0; a < count_sectors; a++) {
        start = finish;
        finish = start + oneSector;
        ctx.fillStyle = colors[a];
        ctx.beginPath();
        ctx.arc(xc, yc, radius, Radian(start), Radian(finish));
        ctx.lineTo(xc, yc);
        ctx.stroke();
    }
    writeNum(count_sectors);
}

canvas.addEventListener('mousemove', function (event) {
    const coordinates = getSectorCoordinates(event);
    const sector = coordinates[0]
    const value = coordinates[1]
    if (value <= 9 && canvas.getAttribute("hoverable") === "true") {
        createDiagram()
        ctx.fillStyle = 'rgba(170,170,170,0.25)'
        ctx.beginPath();
        ctx.arc(xc, yc, min_radius * (value + 1), Radian(sector * 360 / 8), Radian((sector + 1) * 360 / 8));
        ctx.lineTo(xc, yc);
        ctx.fill();
    }
});

canvas.addEventListener('click', function (event) {
    const coordinates = getSectorCoordinates(event);
    const sector = coordinates[0]
    const value = coordinates[1]
    if (canvas.getAttribute("hoverable") === "true") {
        if (value + 1 !== arrSliders[sector])
            arrSliders[sector] = value + 1
        else
            arrSliders[sector] = 0

        createDiagram()
    }
})

function getSectorCoordinates(event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left - radius - padding
    const y = event.clientY - rect.top - radius - padding
    let mAngle = Math.atan2(y, x);
    const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    if (mAngle > -1 * Math.PI && mAngle < 0) {
        mAngle = 2 * Math.PI + mAngle;
    }
    const sector = Math.floor(mAngle / (2 * Math.PI) * 8)
    let value = Math.floor(distance / min_radius)
    if (value > inner_range)
        value = inner_range
    return [sector, value]
}