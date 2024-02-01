for(let i=0;i<rows;i++){
    for(let j=0;j<close;j++){
        let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e)=>{
            let address=addressBar.value;
            let [getCellAndCellProp, cellProp]=getCellAndCellProp(address);
            let enteredData=getCellAndCellProp.value;
            cellProp.value=enteredData;
        })
    }
}
function evaluateFormula(formula){
    //gets converted into array for example if it is A1+A2 then it is stored as an array A1,+,A2
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90){
            let [cell, cellProp]=getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i]=cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

let formulaBar=document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown",(e)=>{
    let inputFormula=formulaBar.value;
    if(e.key === "Enter" && inputFormula){
        let evaluatedValue=evaluateFormula(inputFormula);

        //to update UI and cellProp in DB
        setCellUIAndCellProp(evaluatedValue,inputFormula);
        addChildToParent(inputFormula);
    }
})

function addChildToParent(formula){
    let childAddress = addressBar.Value;
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90){
            let [parentCell, parentCellProp]=getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function setCellUIAndCellProp(evaluatedValue,formula){
    let address=addressBar.value;
    let [cell, cellProp]=getCellAndCellProp(address);
    //UI update
    cell.innerText=evaluatedValue;
    //DB update
    cellProp.value=evaluatedValue;
    cellProp.formula=formula;
}