const roomNum = document.getElementById('roomNum')
const extension = document.getElementById('extension')


document.getElementById('form1').addEventListener('submit', function(event){
    console.log('called')
    event.preventDefault()

    const inputValue = roomNum.value
    const extValue = extension.value

    if(isNaN(inputValue)){
        console.log('not a number')
        alert('please enter a valid room number')
        
    }

    if(isNaN(extValue)){
        alert('please enter a valid extension')
        return;
    }



    event.target.submit()
})