const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
});
const lists = document.querySelectorAll('.list');
lists.forEach(list => {
    list.addEventListener('dragover', dragOver);
    list.addEventListener('dragenter', dragEnter);
    list.addEventListener('dragleave', dragLeave);
    list.addEventListener('drop', dragDrop);
});

function dragStart(e){
    e.dataTransfer.setData('text/plain', e.target.id);
}
function dragEnd(e){
    console.log('Drag Ended');
}
function dragOver(e){
    e.preventDefault();
}
function dragEnter(e){
    e.preventDefault();
    e.target.classList.add('over');
}
function dragLeave(e){
    this.classList.remove('over');
}
function dragDrop(e){
    const id = e.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    e.target.appendChild(draggableElement);
    e.target.classList.remove('over');
}