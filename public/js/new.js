console.log("yoyo");

var deleteThis = function(e) {
    console.log(e);
    $(e.target).parent().remove();
};
var imgHtml = `<div id="imgBox" class="mb-3 p-2" style="border:2px solid #DCDCDC;">
<label for="img" class="form-label">Image Url</label>
<input type="file" class="form-control imageBox box" id="img" placeholder="Image URL"  required>
<button  type="button" class="btn btn-secondary btn-sm mt-1"  onclick=deleteThis(event)>Delete</button>
</div>
`;

var textHtml = `<div id="textBox" class="mb-3 p-2" style="border:2px solid #DCDCDC;">
<label for="desc" class="form-label">Text</label>
<textarea class="form-control textBox box" style="white-space: pre-wrap;" id="desc" cols="20" rows="5" required></textarea>
<button type="button" class="btn btn-secondary btn-sm mt-1"  onclick=deleteThis(event)>Delete</button>
</div>`




$('.addImg').click(()=>{
    console.log("image");

    
    $('#last').append(imgHtml);
   
    
     
});

$('.addText').click(()=>{
    console.log("Text");
    $('#last').append(textHtml);
});



const getData= function() {

var obj={}
obj.texts=[];
obj.images=[];

var  boxes = document.querySelectorAll(' .box');
var count=0;
for(box of boxes) {
  box.setAttribute('id',count);  
count+=1;
}
var formData = new FormData();

var  textBoxes = document.querySelectorAll(' .textBox');
for(tb of textBoxes)
{
    obj.texts.push({pos: tb.getAttribute('id'),value:tb.value});
}

formData.append('image',document.querySelector('#img').files[0]);
if(document.querySelector('#img').value=='') {

    obj.imgCoverPresent='false'
}
else
{
    obj.imgCoverPresent='true'
}




var  imageBoxes = document.querySelectorAll(' .imageBox');
for(ib of imageBoxes)
{
    formData.append('image',ib.files[0]);
 obj.images.push({pos: ib.getAttribute('id')});
} 


obj.title = document.querySelector('#title').value;
obj.desc=document.querySelector('#desc').value;
console.log(obj);


formData.append('extra',JSON.stringify(obj));
console.log(formData);

return formData;
}






$('#submitPost').click(function(e){
    
    
    $('#load').toggleClass("loader");
    document.getElementById('submitPost').style.pointerEvents = 'none'
    
    e.preventDefault();
    console.log("called");
    
    const obj= getData();
    console.log(obj);
    let id=$('form').attr('id'); 


     fetch(`/addContent/${id}`, {
    method:'POST',
    body:obj	
}).then((res) => {if(res.status==200)
    {  $('#load').toggleClass("loader");
    document.getElementById('submitPost').style.pointerEvents= 'auto'
     window.location.href ='/myDashBoard';
    }                                                                        
}).catch(function(e) {
    $('#load').toggleClass("loader");
    document.getElementById('submitPost').style.pointerEvents= 'auto'
    console.log('Error',e);
    alert("faield");
});



console.log("submit");

});
