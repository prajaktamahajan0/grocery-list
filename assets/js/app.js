let cl = console.log;

const GroceryForm = document.getElementById('GroceryForm');
const GroceryItem = document.getElementById('GroceryItem');
const GroceryList = document.getElementById('GroceryList');
const addBtn = document.getElementById('addBtn');
const filter = document.getElementById('filter');
const deleteAll = document.getElementById('deleteAll')
let groceryarr = JSON.parse(localStorage.getItem('groceryarr')) || [];

function UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const groceryadd = (eve) => {
    eve.preventDefault();
    let skill = GroceryItem.value;
    let groceryobj = {
        skillName: skill,
        skillId: UUID()
    }
    groceryarr.unshift(groceryobj)
    localStorage.setItem('groceryarr', JSON.stringify(groceryarr))
    eve.target.reset()

    let li = document.createElement("li");
    li.id = groceryobj.skillId
    li.className = "list-group-item font-weight-bold align-items-center d-flex justify-content-between"
    li.innerHTML = `<span>${groceryobj.skillName}</span>
  
                      <span>
                          <i class="fa-solid fa-xmark   delete"
                          onclick = "onItemDelete(this)"
                          data-deleteId = "${groceryobj.skillId}"></i>
                       </span>                       
                      `

    GroceryList.prepend(li)
    
    Swal.fire({
        text: `${groceryobj.skillName} added successfully `,
        position: 'top-end',
        icon: 'success',
        title: 'Your list has been saved',
        showConfirmButton: false,
        timer: 1000
    })
}


const templating = (arr) => {
    let result = '';
    arr.forEach(item => {
        result += ` 
                      <li class="list-group-item font-weight-bold align-items-center d-flex justify-content-between" id="${item.skillId}">
                      <span>${item.skillName}</span>
                      <span>
                       
  
                      <i class="fa-solid fa-xmark delete "
                         onclick = "onItemDelete(this)"
                         data-deleteId = "${item.skillId}"></i>
                      </span>
                       </li>
                     `
    });
    GroceryList.innerHTML = result;
}

templating(groceryarr)


const onItemDelete = (ele) => {
    let deleteId = ele.dataset.deleteid;
    let deletedValue = document.getElementById(deleteId).firstElementChild.innerHTML;
    let confirmDelete = confirm(`Are you sure`)

    if (confirmDelete) {
        groceryarr = groceryarr.filter(item => {
            return item.skillId !== deleteId
        })

        localStorage.setItem('groceryarr', JSON.stringify(groceryarr))

        document.getElementById(deleteId).remove()

        // swal.fire({
        //     icon: 'success',
        //     timer: 3000
        // })

        Swal.fire({
            title: `${deletedValue} is deleted from todo list`,
            title: 'Are you sure?',
            text: "permanently deleted",
            icon: 'warning',
            timer: 5000,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    } else {
        return false;
    }
}

const onclearAll = () => {
    groceryarr = []
    templating(groceryarr)

    Swal.fire(        
        'Deleted!',
        'Your items has been deleted.',
        'success'
    )
}

const onkeyup = (eve) => {
    let search = eve.target.value;
    cl(search)

    let filterarr = groceryarr.filter(ele => ele.skillName.includes(search));
    templating(filterarr)
}

GroceryForm.addEventListener('submit', groceryadd)
deleteAll.addEventListener('click', onclearAll)
filter.addEventListener('keyup', onkeyup)