

let tempData = "";

//onload createtable
$(document).ready(() => {
    if (localStorage.getItem('recList') != null) {
        if ($('#tbody').html() == "") {
            createTable();
        } else {
            $('#tbody').html("");
            createTable();
        }
    }
})


//onload jsondata 
$(document).ready(function () {
    $.getJSON("data.json", function (data) {
        tempData = data;
        let headArr = Object.keys(tempData[0]);
        console.log(headArr);

        const cardDiv = $('#cardDiv');
        for (let i = 0; i < tempData.length; i++) {
            const card = $('<div class="card col-5 m-1 shadow rounded-5  border-2 pictures d-inline-flex mx-1 p-4 flex-col "; id="cardUpd"; style="width:40vw":  align-content-start ;"></div>');
            const imgC = $("<img>");
            imgC.attr({
                class: "card-img-top shadow",
                src: `${tempData[i].ImageUrl}`,
                style: "width: 31rem; height: 200px;"
            })
            const cardBody = $('<div></div>');
            cardBody.attr("class", "card-body text-dark fst-italic px-5 pt-2 pb-2 bg-light");
            const p1 = $(`<p class="card-text  fs-5">Name: ${tempData[i].Name} </P>`);
            const p2 = $(`<p class="card-text fs-5">Types: ${tempData[i].Types} </P>`);
            const p5 = $(`<p class="card-text fs-5">Gun Price: ${tempData[i].Price} </P>`);
            cardBody.append(p1);
            cardBody.append(p2);
            cardBody.append(p5);
            card.append(imgC)
            card.append(cardBody);
            cardDiv.append(card);
        }

    }).fail(function () {
        console.log("file not found.");
    });
})


// **************************
//Show borrower modal Add borrower section
$('#showModal').click(function () {
    $('#dob').change(function () {
        for (let i = 0; i < tempData.length; i++) {
            if (calAge($('#dob').val()) >= 18 && calAge($('#dob').val()) < 70) {
                if (tempData[i].Types != "Sniper") {
                    const opt = $(`<option></option>`);
                    opt.attr({
                        value: `${tempData[i].Name}`,
                    });
                    opt.text(`${tempData[i].Name}`);
                    $('#SelectArmor').append(opt)
                }
            } else {
                const opt = $(`<option></option>`);
                opt.attr({
                    value: `${tempData[i].Name}`,
                });
                opt.text(`${tempData[i].Name}`);
                $('#SelectArmor').append(opt)
            }
        }
    })


    $('#SelectArmor').change(() => {
        $('#priceCal').text(findPrice($('#SelectArmor').val()))
    })
    //click submit button
    $('#saveBtn').click(function () {
        let newObj = {};
        newObj.id = maxID();
        let theadArr = ["name", "phoneNo", "dob", "address", "SelectArmor", "totalPrice"];
        for (let i = 0; i < 6; i++) {
            if (i == 4) {
                if ($(`#${theadArr[i]}`).val() != "") {
                    let newArr = [];
                    newArr.unshift($(`#${theadArr[i]}`).val())
                    newObj[`${theadArr[i]}`] = newArr;
                } else {
                    return
                }
            } else if (i == 5) {

                if ($('#SelectArmor').val() != "") {
                    let price = findPrice($('#SelectArmor').val());
                    console.log(price);
                    newObj["totalPrice"] = price
                } else {
                    return;
                }
            } else {
                if ($(`#${theadArr[i]}`).val() != "") {
                    newObj[theadArr[i]] = $(`#${theadArr[i]}`).val();
                } else {
                    return;
                }
            }
        }
        //create table
        if (localStorage.getItem('recList') == null) {
            let newData = [];
            //create table
            newData.unshift(newObj);
            localStorage.setItem('recList', JSON.stringify(newData));
            console.log(JSON.parse(localStorage.getItem('recList')));
            if ($('#tbody').html() == "") {
                createTable();
            } else {
                $('#tbody').html("");
                createTable();
            }
        } else {
            let currRec = JSON.parse(localStorage.getItem('recList'))
            currRec.unshift(newObj);
            localStorage.setItem('recList', JSON.stringify(currRec));
            if ($('#tbody').html() == "") {
                createTable();
            } else {
                $('#tbody').html("");
                createTable();
            }
        }
    });

    // validation form
    $("#addBorrowerForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            phoneNo: {
                required: true,
                number: true,
                minlength: 10
            },
            dob: {
                required: true
            },
            address: {
                required: true
            },
            SelectArmor: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Please enter you name",
                minlength: "length of name must be 5"
            },
            phoneNo: {
                required: "please enter you 10 digit mobile no.",
                minlength: "Enter valid mob no.",
                number: "mobile no. shoud be in numeric"
            },
            dob: {
                required: "Please enter you date of birth above 18-years to buy armors"
            },
            address: {
                required: "Please enter your resident address"
            },
            SelectArmor: {
                required: "please select a book."
            }
        }
    });
});

//calTotalPrice
function findPrice(str) {
    for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].Name == str) {
            return tempData[i].Price;
        }
    }
}

//create table
function createTable() {
    let localData = JSON.parse(localStorage.getItem('recList'));
    let headerArr = Object.keys(localData[0]);
    for (let i = 0; i < localData.length; i++) {
        const row = $('<tr></tr>');
        row.attr({
            id: `${localData[i].id}`
        });
        for (let j = 0; j < headerArr.length; j++) {
            const td = $('<td></td>');
            td.text(localData[i][headerArr[j]]);
            row.append(td);
        }
        //return and add btn
        const actRow = $('<td></td>')
        const rtnBtn = $('<button class="bg-success border-0 rounded-5 text-light" id="rtnModal">Return GUN <i class="fa-sharp fa-solid fa-person-rifle"></i></button>');
        rtnBtn.attr('onclick', 'returnBookFun(this)')
        const addGunBtn = $('<button class="bg-danger border-0 rounded-5 text-light" id="addGunButton">Buy New GUN <i class="fa-sharp fa-solid fa-person-rifle"></i></button>');
        addGunBtn.attr("onclick", "addGunFunction(this)")
        actRow.append(rtnBtn);
        actRow.append(addGunBtn);
        row.append(actRow);
        $('#tbody').append(row);
    }
    $('#myTable').DataTable();
}
// Calculate age
function calAge(str) {
    let year = new Date(str).getFullYear();
    let today = new Date().getFullYear();
    return today - year;

}

// *************max function

function maxID() {
    let maxid = 0;
    if (localStorage.getItem('recList') != null) {
        let currData = JSON.parse(localStorage.getItem('recList'));
        for (let i = 0; i < currData.length; i++) {
            if (maxid < currData[i].id) {
                maxid = currData[i].id;
            }
        }
    }
    return maxid + 1;
}

// *******new**
//click add book button
function addGunFunction(e) {
    $('#addGun').modal('show');
    let bookList = tempData;
    let targetRow = $(e).parent().parent().attr("id");
    let tempRec = JSON.parse(localStorage.getItem('recList'));

    $('#selectAddGun').empty();
    for (let j = 0; j < bookList.length; j++) {
        let optionB = $(`<option value="${bookList[j].Name}"></option`);
        optionB.text(bookList[j].Name);
        $('#selectAddGun').append(optionB);
    }
    $('#selectAddGun').change(() => {
        $('#bKPrice').text(findPrice($('#selectAddGun').val()))
    })

    //click book button
    $('#addGun1').click(() => {
        console.log('clicked');
        // debugger;
        for (let i = 0; i < tempRec.length; i++) {
            if (tempRec[i].id == targetRow) {
                let gunArr = tempRec[i].SelectArmor;
                let newGun = $('#selectAddGun').val();
                //todo
                gunArr.unshift(newGun)
                tempRec[i].SelectArmor = gunArr;

                let guncost = tempRec[i].totalPrice;
                let currBkPrice = findPrice($('#selectAddGun').val());
                let newp = guncost + currBkPrice;
                tempRec[i].totalPrice = newp
                localStorage.setItem('recList', JSON.stringify(tempRec));
                //update table
                if ($('#tbody').html() == "") {
                    createTable();
                } else {
                    $('#tbody').html("");
                    createTable();
                }
            }
        }
        $('#addGun').modal('hide');
    })


}

let newTotalPrice = 0;
//return modal funciton
function returnBookFun(e) {
    $('#returnBook').modal('show');
    let tempRec = JSON.parse(localStorage.getItem('recList'));
    // let bookList = tempData;
    let targetRow = $(e).parent().parent().attr("id");
    for (let i = 0; i < tempRec.length; i++) {
        if (tempRec[i].id == targetRow) {
            let gunArr = tempRec[i].SelectArmor;
            for (let j = 0; j < gunArr.length; j++) {
                const opt = $('<option></option>')
                opt.val(`${gunArr[j]}`);
                opt.text(`${gunArr[j]}`);
                $('#selectReturnBook').append(opt);
            }
            //update price
            $('#selectReturnBook').change(() => {
                let totalCost = parseInt(tempRec[i].totalPrice);
                let currBookPrice = findPrice($('#selectReturnBook').val());
                // console.log("bk price", currBookPrice);
                let newPrice = totalCost - currBookPrice;
                // console.log("new p",newPrice);
                $('#rtnPrice').text(newPrice);
            })
        }
    }

    $('#returnBtn').click(() => {
        for (let i = 0; i < tempRec.length; i++) {
            if (tempRec[i].id == targetRow) {
                let nbookList = tempRec[i].SelectArmor;
                let currBook = $('#selectReturnBook').val();
                // debugger;
                for (let j = 0; j < nbookList.length; j++) {
                    if (nbookList[j] == currBook) {
                        nbookList.splice(j, 1);
                    }
                    tempRec[i].SelectArmor = nbookList;
                    let ntotalPrice = parseInt($('#rtnPrice').text());
                    // debugger
                    tempRec[i].totalPrice = ntotalPrice;
                    //update table
                    localStorage.setItem('recList', JSON.stringify(tempRec));
                    if ($('#tbody').html() == "") {
                        createTable();
                    } else {
                        $('#tbody').html("");
                        createTable();
                    }
                }
            }
        }

        $('#returnBook').modal('hide');
    })
}

