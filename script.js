'use strict'
window.onload = load;
const Week = 604800000;
const Month = 2592000000;
let CalculationResultStorage = [];

let firstDate = document.getElementById('checkin-date');
let secondDate = document.getElementById('checkout-date');

let DataInputs = document.getElementsByClassName("data-input");

firstDate.addEventListener('change', () => {
let block = new Date(firstDate.value).toISOString().split('T')[0];
secondDate.setAttribute('min', block);
	document.getElementById("checkout-date").disabled = false;
});

secondDate.addEventListener('change', () => {
firstDate.setAttribute('max', new Date(secondDate.value).toISOString().split('T')[0]);
});



let CalculateButton = document.getElementById('CalculateButton');
CalculateButton.addEventListener('click', (click) => { this.CalculationAction(click)});


//функція для визначення будніх або вихідних днів
function CalculationDaysOfWeek(FirstDate, SecondDate, DaysTypeValue) {

	let CountedDays = parseInt((durationBetweenDates(FirstDate, SecondDate, 'Порахувати кількість днів' )).split(' ')[0]).toFixed(0);
	let CountedSelectDays = 0;

	for (let i = 0; i <= CountedDays; i++) {
		let DayOfWeek;

		if (i == 0) {
			DayOfWeek = new Date(FirstDate).toString().slice(0, 3);
		} else { 
			DayOfWeek = new Date(FirstDate.setDate(FirstDate.getDate() + 1)).toString().slice(0, 3);
		}


		
		if (DaysTypeValue === 'Будні дні') {

			if (DayOfWeek !== 'Sun' && DayOfWeek !== 'Sat')  {
				CountedSelectDays++;
				
			}
			
		} else if (DaysTypeValue === 'Вихідні дні') {
			if (DayOfWeek == 'Sun' || DayOfWeek == 'Sat') {
				CountedSelectDays++;		
				console.log(DayOfWeek);	
		} 
	}
}
	console.log(CountedSelectDays);
	return CountedSelectDays;
}

//функція для розрахунку
function CalculationAction(event) {

	let FirstDate = new Date(document.getElementById('checkin-date').value);
	let SecondDate = new Date (document.getElementById('checkout-date').value);

	let Preset = document.getElementById('preset-selection').value;
	let DaysTypeValue = document.getElementById('DaysType').value;
	let Dimension = document.getElementById('Dimension').value;
	
	let CalculationResult;
	let SecondDateinMs;

	if (FirstDate > SecondDate || SecondDate < FirstDate) {
		alert("Кінцева дата не може бути меншою за початкову");
	}  else {


		let FirstDateDay = new Date(FirstDate).toString().slice(0, 3);
		let SecondDateDay = new Date(SecondDate).toString().slice(0, 3);


		if (Preset === "Тиждень") {
			SecondDateinMs = FirstDate.getTime() + Week;
			SecondDate = new Date(SecondDateinMs);
			document.getElementById('checkout-date').value = SecondDate.toISOString().split('T')[0];
		} else if (Preset === 'Місяць') {
			SecondDateinMs = FirstDate.getTime() + Month;
			SecondDate = new Date(SecondDateinMs);
			document.getElementById('checkout-date').value = SecondDate.toISOString().split('T')[0];
		} else if (Preset === '') {
			SecondDate = SecondDate.getTime();
		}

	
		if (DaysTypeValue === 'Всі дні') {
			CalculationResult = durationBetweenDates(FirstDate, SecondDate, Dimension) ;
		} else { 
			let CountedDaysinMs = (CalculationDaysOfWeek(FirstDate, SecondDate, DaysTypeValue))*24*60*60000;
			CalculationResult = CalculateDimension(Dimension, CountedDaysinMs);
		}

		

		saveToLocalStorage(FirstDate, SecondDate, CalculationResult);
		History();
	}
	console.log(CalculationResult);
}	

	


//функція для розрахунку в потрібній розмірності
function CalculateDimension(Dimension, CalculationResult) {
	switch(Dimension) {
        case 'Порахувати кількість днів': 
        CalculationResult = `${CalculationResult/60000/60/24} days`;
        return CalculationResult;
        break;
               
        case 'Порахувати кількість годин': 
        CalculationResult = `${CalculationResult/60000/60} hours`;
        return CalculationResult;
        break;

        case 'Порахувати кількість хвилин': 
        CalculationResult = `${CalculationResult/60000} minutes`;
        return CalculationResult;
        break;

        case 'Порахувати кількість секунд': 
        CalculationResult = `${CalculationResult/1000} seconds`;
        return CalculationResult;
        break;   
    }
    console.log(CalculationResult);
}

//фунція для розрахунку різниці дат
function durationBetweenDates(FirstDate, SecondDate, Dimension) {

    let FirstDate1 = new Date(FirstDate);
    let SecondDate1 = SecondDate;
    let CalculationResult = 0;
    CalculationResult = Math.abs(FirstDate1 - SecondDate1);

    return CalculateDimension(Dimension, CalculationResult);
}

//функція для збереження в локалсторадж

function saveToLocalStorage(FirstDate, SecondDate, CalculationResult) {

    const FirstDateFormatted = new Date(FirstDate).toISOString().split('T')[0];
    const SecondDateFormatted = new Date(SecondDate).toISOString().split('T')[0];

	const CalculationResults = JSON.parse(localStorage.getItem('CalculationResults')) || [];
	if (CalculationResults.length >= 10) {
		CalculationResults.shift();
	}
	CalculationResults.push({ range: `${FirstDateFormatted} - ${SecondDateFormatted}`, CalculationResult })
    localStorage.setItem('CalculationResults', JSON.stringify(CalculationResults));

}

//функція для відображення попередніх результатів
function History() {
   
    const table = document.querySelector('.history');
    const CalculationResults = JSON.parse(localStorage.getItem('CalculationResults'));
    const tbody = table.querySelector('tbody')
    table.style.display = 'table';
    tbody.innerHTML = null;

    CalculationResults.forEach(CalculationResult => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        td2.className = 'resultHistory';
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
        td1.innerHTML = CalculationResult.range;
        td2.innerHTML = CalculationResult.CalculationResult;
    })

}



function load() {
    History();
};




