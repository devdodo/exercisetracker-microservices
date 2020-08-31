// Initial controllers for first form
const userAddForm = document.getElementById('useradd');
const userName = document.getElementById('username');
const output1 = document.getElementById('output1');

// Initial controllers for second form
const exerciseAdd = document.getElementById('exerciseadd');
const userId = document.getElementById('userid');
const description = document.getElementById('description');
const duration = document.getElementById('duration');
const dateInput = document.getElementById('dateinput');
const output2 = document.getElementById('output2');

// Main code commands starts here
userAddForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let outputText;

    if(userName.value === ""){
        outputText = "Please Enter a valid username";
        output1.style.display = 'block';
        return output1.innerText = outputText;
    }else{
        outputText = userName.value;
    }

    // Fetch command to post data to server and get response
    fetch('/api/exercise/new-user', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({"username": outputText})
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        const resultData = data.result;

        output1.style.display = 'block';
        output1.innerText = resultData;
    })
    .catch(err => console.error(err));

});

exerciseAdd.addEventListener('submit', (e) => {
    e.preventDefault();
    const userIdValue = userId.value;
    const descriptionValue = description.value;
    const durationValue = duration.value;
    let dateValue = dateInput.value;
    let dateOutput;
    let outputText;

    if( userIdValue === "" || descriptionValue === "" || durationValue === ""){
        outputText = "Please Enter all required fields!"
    }else{
        if(dateValue === ""){
            dateValue = new Date();
            dateOutput = dateValue.getFullYear();
            for(i=0; i < 11; i++){
                if(dateValue.getMonth() == i){
                    if(dateValue.getMonth() < 10){
                        var num = i+1;
                        dateOutput += "-"+"0"+num;
                    }else{
                        var num = i+1;
                        dateOutput += "-"+ num; 
                    }
                    
                }
            }
            dateOutput += "-"+ dateValue.getDate();
            
        }else{
            dateOutput = dateValue;
        }

    }

    // Fetch command to post data to server and get response
    fetch('/api/exercise/add', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ "id": userIdValue,"description": descriptionValue, "duration": durationValue, "exercisedate": dateOutput })
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        const resultData = data.result;

        output2.style.display = 'block';
        output2.innerText = resultData;
    })
    .catch(err => console.error(err));
});