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
function addOnClickForItems(){
    const NodeList = getElementById('main-article').querySelectorAll('*');
    NodeList.forEach(node=>{
        const tagName = node.tagName.toLowerCase()
        if(['h1','h2','h3','h4','h5','h6','p','label'].includes(tagName))
            node.onclick = ()=>updateText(node.id)
        else if(tagName === 'img')
            node.onclick = ()=>updateImage(node.id)
        else if(tagName === 'iframe')
            node.onclick = ()=>updateEmbed(node.id)
        else if(tagName === 'a')
            node.onclick = ()=>updateLink(node.id)
    })
}
function upload(){
    const fileSelector = document.getElementById('myfile');
    fileSelector.addEventListener('change', (event) => {
      const fileList = event.target.files;
      const fileReader=new FileReader();
        fileReader.onload=function(){
            const fileOutput =fileReader.result;
            getElementById('main-article').innerHTML = fileOutput
            addOnClickForItems()
        }
        fileReader.readAsText(fileList[0]);
      
    });
    getElementById('myfile').click()
    
}
function removeStyle(id){
    const element = document.getElementById(id);
    element.parentNode.removeChild(element);
}
//show pull down and push up button
function showPullDownAndPushUp(toBeShown){
   getElementById('position-controller').style.display = toBeShown?'flex':'none';
}
//push up an element
function pushUp(){
    const updateElement = getElementById(`place-${getElementById('tag-selector').value}-button`)
    const id = updateElement.getAttribute('data-update') 
    const NodeList = getElementById('main-article').querySelectorAll('*')
    let i;
    for(i in NodeList)
        if(NodeList[i].id === id) break;

    if(i!=0){
        const nodeToBeReplaced = NodeList[i];
        const previousNode = NodeList[parseInt(i) - 1];
        getElementById('main-article').insertBefore(nodeToBeReplaced,previousNode)
    }
}
function pullDown(){
    const updateElement = getElementById(`place-${getElementById('tag-selector').value}-button`)
    const id = updateElement.getAttribute('data-update') 
    const NodeList = getElementById('main-article').querySelectorAll('*')
    let i;
    for(i in NodeList)
        if(NodeList[i].id === id) break;

    if(i!=NodeList.length - 1){
        const nodeToBeReplaced = NodeList[parseInt(i) + 1];
        const previousNode = NodeList[i];
        getElementById('main-article').insertBefore(nodeToBeReplaced,previousNode)
    }
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
        nodeList.forEach(node=>{
            node.classList.add('article-element-no-border')
            node.classList.remove('embed-dev-pad')
        })
        gridButton.setAttribute('data-grid-on','0');
        gridButton.innerText = "Turn on grid"
    }
    else{
        nodeList.forEach(node=>{
            node.classList.remove('article-element-no-border')
            if(node.tagName === 'IFRAME')
                node.classList.add('embed-dev-pad')
        })
        gridButton.setAttribute('data-grid-on','1');
        gridButton.innerText = "Turn off grid"
    }
}
// add custom css
function addStyle(property=null,value=null,_id=null){
    const selectedStyle = property ? property : getElementById(getElementById('tag-selector').value +'-css-styles').value;
    const id = _id ? _id : getUniqueId()
    const styleJS = 
    `<div class="custom-css-styles" id="style-container-${id}">
        <p id="property-${id}">${selectedStyle}</p>
        <input id="value-${id}" placeholder="value" value="${value?value:''}"/>
        <i class="fa-solid fa-trash" id="trash-${id}" onclick="removeStyle('style-container-${id}')"></i>
    </div>`;
    const container = getElementById('custom-css-styles-container')
    container.innerHTML += styleJS;
}
function updateLayout(){
    //clear the css container
    getElementById('custom-css-styles-container').innerHTML = ""
    const Styletype = getElementById('tag-selector').value.toLowerCase()
    const nodeList = getElementById('controller').querySelectorAll("div[id$='-type-style-control']")
    nodeList.forEach(node=>{
        if(node.id === `${Styletype}-type-style-control`)
            node.style.display = 'block';
        else
            node.style.display = 'none';
    })
}
updateLayout()
// --------------------------------------------------------------------------------------------
// add text style 
function placeText(){
    //get the type
    const selectedStyle = getElementById('styles').value;
    //create the type
    const node = createElement(selectedStyle)
    //add a unique id to it
    node.setAttribute('id',getUniqueId())
    node.setAttribute('class','article-element common-style')
    //place text inside the element
    const text = getElementById('text-input-box').value;
    node.innerText = text;
    node.onclick = ()=>updateText(node.id);
    //check for custom css
    const cssList = getElementById('custom-css-styles-container').querySelectorAll("div")
    cssList.forEach(item=>{
        // style-container-
        const _id = item.getAttribute('id')
        const id = _id.substring(_id.lastIndexOf('-')+1)
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
    //access the containers
    getElementById('text-input-box').value = ''
    getElementById('styles').value = 'h1'
    showPullDownAndPushUp(false) 
}
function updateText(id){
    //switch Layout
    getElementById('tag-selector').value = 'text';
    updateLayout()
    //show position controller
    showPullDownAndPushUp(true)
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
    const textStyles = ['font-family','font-weight','font-size','font-style','color','border','margin',
    'margin-left','margin-right','margin-top','margin-bottom','padding','padding-left',
    'padding-right','padding-top','padding-bottom' ]
    textStyles.forEach(property=>{
        if(element.style[property])
            addStyle(property,element.style[property],element.getAttribute('id'))
    })
    // show the update button
    getElementById('cancel-text-update').style.display = 'inline';
    
    
}
function replaceNode(new_node){
    const selectedStyle = getElementById('tag-selector').value;
    const id = getElementById(`place-${selectedStyle}-button`).getAttribute('data-update');
    const container = getElementById('main-article')
    const old_node = getElementById(id)
    container.replaceChild(new_node,old_node)
    cancelUpdate()
}
function cancelUpdate(){
    //show position controller
    showPullDownAndPushUp(false)
    const selectedStyle = getElementById('tag-selector').value;
    const element = getElementById(`place-${selectedStyle.charAt(0)+selectedStyle.substring(1)}-button`)
    element.innerText = `Place ${selectedStyle}`;
    element.setAttribute('data-update','0')
    getElementById(`cancel-${selectedStyle.toLowerCase()}-update`).style.display = 'none';

    //clear the css
    getElementById('custom-css-styles-container').innerHTML = ""
}
// --------------------------------------------------------------------------------------------



// --------------------------------------------------------------------------------------------
// image section
function placeImage(){
    
    const imageURL  = getElementById('image-input').value
    if(imageURL === '' || !imageURL.startsWith('https://')){
        alert("Image url cannot be empty or has no https")
        return;
    }
    //create the type
    const node = createElement('img')
    //add a unique id to it
    node.setAttribute('id',getUniqueId())
    node.setAttribute('class','article-element image-default')
    node.src = imageURL
    node.onclick = ()=>updateImage(node.id);
    //add css
    const cssList = getElementById('custom-css-styles-container').querySelectorAll("div")
    cssList.forEach(item=>{
        const _id = item.getAttribute('id')
        const id = _id.substring(_id.lastIndexOf('-')+1)
        const property = getElementById(`property-${id}`).innerText
        const value = getElementById(`value-${id}`).value
        node.style[property] = value.toString();
    })
    //add the type to the editor
    if(getElementById('place-image-button').getAttribute('data-update') === '0')
        addToArticle(node)
    else
        replaceNode(node)
    //clear the css container
    getElementById('custom-css-styles-container').innerHTML = ""
    showPullDownAndPushUp(false) 

}
function updateImage(id){
    //switch Layout
    getElementById('tag-selector').value = 'image';
    updateLayout()
    //show position controller
    showPullDownAndPushUp(true)
    //show update button
    getElementById('place-image-button').innerText = 'Update';
    getElementById('place-image-button').setAttribute('data-update',id)

    //clear the css
    getElementById('custom-css-styles-container').innerHTML = ""
    // access the element
    const element = getElementById(id)
    //access the containers
    getElementById('image-input').value = element.src
    // place the values
    const ImageStyles = ['width','height','object-fit','opacity','border','border-radius',
    'margin','margin-left','margin-right','margin-top','margin-bottom','padding',
    'padding-left','padding-right','padding-top','padding-bottom' ]
    ImageStyles.forEach(property=>{
        if(element.style[property])
            addStyle(property,element.style[property],element.getAttribute('id'))
    })
    // show the update button
    getElementById('cancel-image-update').style.display = 'inline';
    
}
// --------------------------------------------------------------------------------------------



// --------------------------------------------------------------------------------------------
// link section
function placeLink(){
    const linkText  = getElementById('link-input').value
    const destination  = getElementById('destination-input').value
    if(linkText === '' || destination === '' || !destination.startsWith('https://')){
        alert("Fields cannot be empty or has no https")
        return;
    }
    //create the type
    const node = createElement('a')
    //add a unique id to it
    node.setAttribute('id',getUniqueId())
    node.setAttribute('class','article-element common-style')
    
    node.href = destination
    node.innerText = linkText
    node.target = '_blank'
    node.onclick = ()=>updateLink(node.id);
    //add css
    const cssList = getElementById('custom-css-styles-container').querySelectorAll("div")
    cssList.forEach(item=>{
        const _id = item.getAttribute('id')
        const id = _id.substring(_id.lastIndexOf('-')+1)
        const property = getElementById(`property-${id}`).innerText
        const value = getElementById(`value-${id}`).value
        node.style[property] = value.toString();
    })
    //add the type to the editor
    if(getElementById('place-link-button').getAttribute('data-update') === '0')
        addToArticle(node)
    else
        replaceNode(node)
    //clear the css container
    getElementById('custom-css-styles-container').innerHTML = ""
    showPullDownAndPushUp(false) 
}
function updateLink(id){
    //switch Layout
    getElementById('tag-selector').value = 'link';
    updateLayout()
    //show position controller
    showPullDownAndPushUp(true)
    //show update button
    getElementById('place-link-button').innerText = 'Update';
    getElementById('place-link-button').setAttribute('data-update',id)

    //clear the css
    getElementById('custom-css-styles-container').innerHTML = ""
    // access the element
    const element = getElementById(id)
    //access the containers
    getElementById('link-input').value = element.innerText
    getElementById('destination-input').value = element.href
    // place the values
    const textStyles = ['font-family','font-weight','font-size','color','border','margin',
    'margin-left','margin-right','margin-top','margin-bottom','padding','padding-left',
    'padding-right','padding-top','padding-bottom','text-decoration','font-style' ]
    textStyles.forEach(property=>{
        if(element.style[property])
            addStyle(property,element.style[property],element.getAttribute('id'))
    })
    // show the update button
    getElementById('cancel-link-update').style.display = 'inline';
}


// embeding section
function placeEmbed(){
    let embedSrc  = getElementById('embed-input').value
    if(!embedSrc){
        alert("Fields cannot be empty or has no https")
        return;
    }
    //https://www.youtube.com/embed/r_OOdAGhTmk
    else if(embedSrc.startsWith('https://youtu.be/'))
        embedSrc = `https://www.youtube.com/embed/${embedSrc.substring(embedSrc.lastIndexOf('/')+1)}`
    
    //create the type
    const node = createElement('iframe')
    //add a unique id to it
    node.setAttribute('id',getUniqueId())
    node.setAttribute('class','article-element common-style embed-default embed-dev-pad')
    
    node.src = embedSrc
    node.onclick = ()=>updateEmbed(node.id)    
    //add css
    const cssList = getElementById('custom-css-styles-container').querySelectorAll("div")
    cssList.forEach(item=>{
        const _id = item.getAttribute('id')
        const id = _id.substring(_id.lastIndexOf('-')+1)
        const property = getElementById(`property-${id}`).innerText
        const value = getElementById(`value-${id}`).value
        node.style[property] = value.toString();
    })
    //add the type to the editor
    if(getElementById('place-embed-button').getAttribute('data-update') === '0')
        addToArticle(node)
    else
        replaceNode(node)
    //clear the css container
    getElementById('custom-css-styles-container').innerHTML = ""
    showPullDownAndPushUp(false) 
}
function updateEmbed(id){
    //switch Layout
    getElementById('tag-selector').value = 'embed';
    updateLayout()
    //show position controller
    showPullDownAndPushUp(true)
    //show update button
    getElementById('place-embed-button').innerText = 'Update';
    getElementById('place-embed-button').setAttribute('data-update',id)

    //clear the css
    getElementById('custom-css-styles-container').innerHTML = ""
    // access the element
    const element = getElementById(id)
    //access the containers
    getElementById('embed-input').value = element.src
    // place the values
    const textStyles = ['width','height','border','margin',
    'margin-left','margin-right','margin-top','margin-bottom','padding','padding-left',
    'padding-right','padding-top','padding-bottom','text-decoration','font-style' ]
    textStyles.forEach(property=>{
        if(element.style[property])
            addStyle(property,element.style[property],element.getAttribute('id'))
    })
    // show the update button
    getElementById('cancel-embed-update').style.display = 'inline';
}
