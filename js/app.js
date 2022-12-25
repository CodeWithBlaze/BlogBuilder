function download(){
    const nodeList = getElementById('main-article')
    var data = new Blob([nodeList.innerHTML], {type: 'text/plain'});
    textFile = window.URL.createObjectURL(data);
    // returns a URL you can use as a href
    const downloadButton = document.createElement('a')
    downloadButton.href = textFile;
    downloadButton.setAttribute('download','document.txt')
    downloadButton.click()
    // return textFile;
     
}
function upload(){
    const fileSelector = document.getElementById('myfile');
    fileSelector.addEventListener('change', (event) => {
      const fileList = event.target.files;
      const fileReader=new FileReader();
        fileReader.onload=function(){
            const fileOutput =fileReader.result;
            getElementById('main-article').innerHTML = fileOutput
        }
        fileReader.readAsText(fileList[0]);
      
    });
    getElementById('myfile').click()
    
}
//get elements by id
function getElementById(id){
    return document.getElementById(id)
}
// create element by type
function createElementByType(type){
    const node = document.createElement(type)
    return node;
}
// create element
function createElement(type){
    const node = createElementByType(type)
    return node;
}
// create a unique id
function getUniqueId(){
    const random = (Math.random() * 10000000000000000).toString() + (Math.random() * 10000000000000000).toString()
    return random
}
// add to article
function addToArticle(node){
    const article = getElementById('main-article')
    article.appendChild(node);
}
// start and stop the borders for each element
function toggleGrid(){
    const gridButton = getElementById('grid-control-button');
    const gridStatus = gridButton.getAttribute('data-grid-on')
    const nodeList = getElementById('main-article').querySelectorAll("*")
    if(gridStatus == '1'){
        nodeList.forEach(node=>node.classList.add('article-element-no-border'))
        gridButton.setAttribute('data-grid-on','0');
        gridButton.innerText = "Turn on grid"
    }
    else{
        nodeList.forEach(node=>node.classList.remove('article-element-no-border'))
        gridButton.setAttribute('data-grid-on','1');
        gridButton.innerText = "Turn off grid"
    }
}
// add custom css
function addStyle(property=null,value=null,_id=null){
    const selectedStyle = property ? property : getElementById('css-styles').value;
    const id = _id ? _id : getUniqueId()
    const styleJS = 
    `<div class="custom-css-styles" id="${id}">
        <p id="property-${id}">${selectedStyle}</p>
        <input id="value-${id}" placeholder="value" value="${value?value:''}"/>
        <i class="fa-solid fa-trash" id="trash-${id}"></i>
    </div>`;
    const container = getElementById('custom-css-styles-container')
    container.innerHTML += styleJS;
}


// add text style 
function placeText(){
    //get the type
    const selectedStyle = getElementById('styles').value;
    //create the type
    const node = createElement(selectedStyle)
    //add a unique id to it
    node.setAttribute('id',getUniqueId())
    node.setAttribute('class','article-element')
    //place text inside the element
    const text = getElementById('text-input-box').value;
    node.innerText = text;
    node.onclick = ()=>updateText(node.id);
    //check for custom css
    const cssList = getElementById('custom-css-styles-container').querySelectorAll("div")
    cssList.forEach(item=>{
        const id = item.getAttribute('id')
        const property = getElementById(`property-${id}`).innerText
        const value = getElementById(`value-${id}`).value
        node.style[property] = value.toString();
    })
    //add the type to the editor
    if(getElementById('place-text-button').getAttribute('data-update') === '0')
        addToArticle(node)
    else
        replaceNode(node)
    //clear the css container
    getElementById('custom-css-styles-container').innerHTML = ""
}
function updateText(id){
    //show update button
    getElementById('place-text-button').innerText = 'Update';
    getElementById('place-text-button').setAttribute('data-update',id)
    
    //clear the css
    getElementById('custom-css-styles-container').innerHTML = ""
    // access the element
    const element = getElementById(id)
    //access the containers
    getElementById('text-input-box').value = element.innerText
    const tagType = element.tagName.toLowerCase()
    getElementById('styles').value = tagType 
    // place the values
    const textStyles = ['font-family','font-weight','font-size','color','border','margin',
    'margin-left','margin-right','margin-top','margin-bottom','padding','padding-left',
    'padding-right','padding-top','padding-bottom' ]
    textStyles.forEach(property=>{
        if(element.style[property])
            addStyle(property,element.style[property],element.getAttribute('id'))
    })
    // show the update button
    getElementById('Cancel').style.display = 'inline';
}
function replaceNode(new_node){
    
    const id = getElementById('place-text-button').getAttribute('data-update');
    const container = getElementById('main-article')
    const old_node = getElementById(id)
    // console.log("old node",old_node)
    // console.log("new_node",new_node)
    container.replaceChild(new_node,old_node)
    cancelUpdate()
}
function cancelUpdate(){
    getElementById('place-text-button').innerText = 'Place Text';
    getElementById('place-text-button').setAttribute('data-update','0')
    getElementById('Cancel').style.display = 'none';

    //clear the css
    getElementById('custom-css-styles-container').innerHTML = ""
    //access the containers
    getElementById('text-input-box').value = ''
    getElementById('styles').value = 'h1' 
}